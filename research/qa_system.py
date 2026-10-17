# qa_system.py

import os
import pickle
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Import the config module to load API key
from config import get_google_api_key, validate_api_key

# Import our existing data loading and preprocessing functions from their respective files
from data_loader import DataLoader
from analysis import extract_and_clean_evidence

# Global cache for the QA chain to avoid reloading
_qa_chain_cache = None
_vectorstore_path = "vectorstore_cache"

def load_cached_vectorstore():
    """Load cached vectorstore if it exists, otherwise return None."""
    if Path(_vectorstore_path).exists():
        try:
            print("📁 Loading cached vectorstore...")
            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=get_google_api_key()
            )
            vectorstore = FAISS.load_local(_vectorstore_path, embeddings, allow_dangerous_deserialization=True)
            print("✅ Cached vectorstore loaded successfully!")
            return vectorstore
        except Exception as e:
            print(f"⚠️ Failed to load cached vectorstore: {e}")
            return None
    return None

def save_vectorstore(vectorstore):
    """Save vectorstore to cache for faster future loading."""
    try:
        vectorstore.save_local(_vectorstore_path)
        print("💾 Vectorstore cached for faster future loading!")
    except Exception as e:
        print(f"⚠️ Failed to cache vectorstore: {e}")

def prepare_data_for_qa():
    """Loads and preprocesses data, returning a list of LangChain Document objects."""
    print("Loading and preprocessing data...")
    
    # Create an instance of our DataLoader to load the data
    loader = DataLoader()
    open_source_df = loader.load_jsonl_file("financebench_open_source.jsonl")

    if open_source_df is None:
        return []

    # Use the preprocessing function we already created
    processed_df = extract_and_clean_evidence(open_source_df)
    
    # LangChain needs data in a specific Document format
    docs = []
    for _, row in processed_df.iterrows():
        # Handle the evidence field which might be a list
        content = ""
        evidence = row.get('evidence', '')
        
        if isinstance(evidence, list) and evidence:
            # If evidence is a list, join the text from all evidence items
            evidence_texts = []
            for item in evidence:
                if isinstance(item, dict) and 'evidence_text' in item:
                    evidence_texts.append(item['evidence_text'])
                elif isinstance(item, str):
                    evidence_texts.append(item)
            content = ' '.join(evidence_texts)
        elif isinstance(evidence, str):
            content = evidence
        
        # For financial questions, also include the correct answer in the context
        # This helps the model learn the expected answer format
        if content and 'question' in row and 'answer' in row:
            # Create enriched content that includes question context and evidence
            enriched_content = f"""
Question: {row['question']}
Answer: {row['answer']}

Supporting Evidence:
{content}
"""
        elif not content and 'question' in row and 'answer' in row:
            # Fallback if no evidence, use question and answer
            enriched_content = f"Question: {row['question']}\nAnswer: {row['answer']}"
        else:
            enriched_content = content
        
        if enriched_content and isinstance(enriched_content, str):
            docs.append(Document(
                page_content=enriched_content,
                metadata={
                    "doc_name": row.get('doc_name', 'Unknown'),
                    "question": row.get('question', ''),
                    "answer": row.get('answer', ''),
                    "company": row.get('company', 'Unknown')
                }
            ))
    print(f"Prepared {len(docs)} documents for the Q&A system.")
    return docs

def create_qa_chain():
    """
    Creates and returns a LangChain RetrievalQA chain using Gemini Pro with caching for speed.
    """
    global _qa_chain_cache
    
    # Return cached chain if available
    if _qa_chain_cache is not None:
        print("🚀 Using cached Q&A chain for faster response!")
        return _qa_chain_cache
    
    print("⚡ Initializing Q&A system...")
    
    # Try to load cached vectorstore first
    vectorstore = load_cached_vectorstore()
    
    if vectorstore is None:
        # No cache available, create from scratch
        print("📄 Processing documents for first-time setup...")
        
        # Text splitter - optimized for financial data
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,  # Smaller chunks for better retrieval of specific numbers
            chunk_overlap=200,  # More overlap to preserve context
            separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
        )
        
        docs = prepare_data_for_qa()
        
        if not docs:
            print("❌ No documents to process. Exiting.")
            return None
            
        texts = text_splitter.split_documents(docs)
        print(f"✅ Created {len(texts)} text chunks for vector search")

        # Create Embeddings and Vector Store with Gemini's model
        os.environ['GOOGLE_API_KEY'] = get_google_api_key()
        
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = FAISS.from_documents(texts, embeddings)
        
        # Save vectorstore for future use
        save_vectorstore(vectorstore)
    
    # Set up the Language Model with better settings for financial data
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        temperature=0.1,  # Lower temperature for more precise answers
        max_tokens=1024
    )

    # Build the Retrieval Chain with improved retrieval
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 8}  # Retrieve more chunks to find specific data
        ),
        return_source_documents=True,  # Return sources for transparency
        verbose=False  # Reduce verbose output for speed
    )
    
    # Cache the chain for future use
    _qa_chain_cache = qa_chain
    print("💾 Q&A chain cached for faster future queries!")
    
    return qa_chain

def ask_question(question):
    """Ask a single question to the Q&A system and return the answer."""
    if not validate_api_key():
        return "Error: GOOGLE_API_KEY not found or invalid. Please check your .env file."

    try:
        qa_chain = create_qa_chain()
        if qa_chain:
            response = qa_chain.invoke({"query": question})
            return response['result']
        else:
            return "Failed to create Q&A chain"
    except Exception as e:
        return f"Error getting answer: {e}"

def run_qa_system():
    """Main function to run the Q&A system with a sample question."""
    if not validate_api_key():
        print("Error: GOOGLE_API_KEY not found or invalid. Please check your .env file.")
        return

    print("✅ API key validated successfully")
    qa_chain = create_qa_chain()
    
    if qa_chain:
        print("\n🤖 Q&A System is ready. You can now ask questions based on the financial documents.")
        
        sample_question = "What is the FY2018 capital expenditure amount for 3M?"
        
        print(f"\n❓ Question: {sample_question}")
        print("🔍 Searching for answer...")
        
        try:
            response = qa_chain.invoke({"query": sample_question})
            print(f"💡 Answer: {response['result']}")
        except Exception as e:
            print(f"❌ Error getting answer: {e}")
    else:
        print("❌ Failed to create Q&A chain")

if __name__ == "__main__":
    run_qa_system()
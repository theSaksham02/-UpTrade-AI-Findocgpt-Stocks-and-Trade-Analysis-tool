# qa_system.py

import os
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
        # Ensure we only create documents for rows with cleaned text
        if row['cleaned_text']:
            docs.append(Document(
                page_content=row['cleaned_text'],
                metadata={
                    "source": row['doc_name'],
                    "question": row['question'],
                    "answer": row['answer']
                }
            ))
    print(f"Prepared {len(docs)} documents for the Q&A system.")
    return docs

def create_qa_chain():
    """
    Creates and returns a LangChain RetrievalQA chain using Gemini Pro.
    """
    # 2. Split text into chunks for the LLM
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    docs = prepare_data_for_qa()
    
    if not docs:
        print("No documents to process. Exiting.")
        return None
        
    texts = text_splitter.split_documents(docs)

    # 3. Create Embeddings and a Vector Store with Gemini's model
    os.environ['GOOGLE_API_KEY'] = get_google_api_key()
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = FAISS.from_documents(texts, embeddings)
    
    # 4. Set up the Language Model
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)

    # 5. Build the Retrieval Chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    )
    return qa_chain

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
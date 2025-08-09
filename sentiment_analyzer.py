# sentiment_analyzer.py

import os
import pandas as pd
from transformers import pipeline
from config import get_google_api_key, validate_api_key

def load_financial_data():
    """
    Load financial data from the FinanceBench dataset.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "data", "financebench-main", "data", "financebench_open_source.jsonl")
    
    try:
        df = pd.read_json(file_path, lines=True)
        print(f"Successfully loaded financebench_open_source.jsonl with {len(df)} entries.")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

def extract_text_for_sentiment(df):
    """
    Extract and clean text for sentiment analysis from the evidence field.
    """
    texts = []
    for _, row in df.iterrows():
        text_content = ""
        evidence = row.get('evidence', '')
        
        # Handle evidence field which might be a list
        if isinstance(evidence, list) and evidence:
            evidence_texts = []
            for item in evidence:
                if isinstance(item, dict) and 'evidence_text' in item:
                    evidence_texts.append(item['evidence_text'])
                elif isinstance(item, str):
                    evidence_texts.append(item)
            text_content = ' '.join(evidence_texts)
        elif isinstance(evidence, str):
            text_content = evidence
        
        # Fallback to question + answer if no evidence
        if not text_content and 'question' in row and 'answer' in row:
            text_content = f"{row['question']} {row['answer']}"
        
        # Truncate text to fit model limits (512 tokens ≈ 300 words to be safe)
        # More conservative truncation to avoid token length issues
        words = text_content.split()
        if len(words) > 300:
            text_content = ' '.join(words[:300])
        
        texts.append(text_content)
    
    df['cleaned_text'] = texts
    return df

def get_sentiment_pipeline():
    """
    Initializes and returns a sentiment analysis pipeline using DistilBERT.
    """
    try:
        # Use a pre-trained DistilBERT model fine-tuned for sentiment analysis.
        model_name = "distilbert-base-uncased-finetuned-sst-2-english"
        sentiment_pipeline = pipeline("sentiment-analysis", model=model_name, truncation=True, max_length=512)
        print(f"✅ Sentiment analysis pipeline loaded with model: {model_name}")
        return sentiment_pipeline
    except Exception as e:
        print(f"❌ Error loading sentiment analysis pipeline: {e}")
        return None

def analyze_sentiment(df, pipeline):
    """
    Analyzes the sentiment of the cleaned text in a DataFrame.
    Processes texts individually to handle length and error issues.
    """
    if df is None or pipeline is None:
        print("Data or pipeline not available.")
        return df

    sentiment_labels = []
    sentiment_scores = []
    
    print(f"🔍 Analyzing sentiment for {len(df)} texts...")
    
    for i, text in enumerate(df['cleaned_text']):
        try:
            # Skip empty texts
            if not text or not text.strip():
                sentiment_labels.append('NEUTRAL')
                sentiment_scores.append(0.5)
                continue
            
            # Analyze sentiment for individual text
            result = pipeline(text)
            if isinstance(result, list) and len(result) > 0:
                sentiment_labels.append(result[0]['label'])
                sentiment_scores.append(result[0]['score'])
            else:
                sentiment_labels.append('NEUTRAL')
                sentiment_scores.append(0.5)
                
            # Progress indicator
            if (i + 1) % 20 == 0:
                print(f"  Processed {i + 1}/{len(df)} texts...")
                
        except Exception as e:
            print(f"❌ Error analyzing text {i+1}: {e}")
            sentiment_labels.append('NEUTRAL')
            sentiment_scores.append(0.5)
    
    # Add results to dataframe
    df['sentiment_label'] = sentiment_labels
    df['sentiment_score'] = sentiment_scores
    
    print("✅ Sentiment analysis completed!")
    return df

def main():
    """
    Main function to load data, analyze sentiment, and display results.
    """
    # Load the raw data
    raw_df = load_financial_data()
    
    if raw_df is not None:
        # Extract and preprocess text for sentiment analysis
        processed_df = extract_text_for_sentiment(raw_df)
        
        # Get the sentiment analysis pipeline
        sentiment_pipeline = get_sentiment_pipeline()
        
        if sentiment_pipeline:
            # Analyze sentiment on the cleaned text
            final_df = analyze_sentiment(processed_df, sentiment_pipeline)
            
            print("\n📈 First 5 entries with sentiment analysis results:")
            print(final_df[['question', 'sentiment_label', 'sentiment_score']].head())
            
            # Display sentiment distribution
            print("\n📊 Sentiment Distribution:")
            sentiment_counts = final_df['sentiment_label'].value_counts()
            print(sentiment_counts)
            
            # Show some examples of each sentiment
            print("\n🔍 Examples by sentiment:")
            for sentiment in final_df['sentiment_label'].unique():
                example = final_df[final_df['sentiment_label'] == sentiment].iloc[0]
                print(f"\n{sentiment} (score: {example['sentiment_score']:.3f}):")
                print(f"Question: {example['question'][:100]}...")
                print(f"Text sample: {example['cleaned_text'][:150]}...")
        else:
            print("❌ Failed to load sentiment analysis pipeline")
    else:
        print("❌ Failed to load data")

if __name__ == "__main__":
    main()
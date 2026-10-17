# analysis.py

import pandas as pd
import os
import re
from data_loader import DataLoader

def clean_text(text):
    """
    Cleans raw text by removing extra whitespaces and newline characters.
    """
    if not isinstance(text, str):
        return ""
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_and_clean_evidence(df):
    """
    Extracts nested text and metadata from the 'evidence' column and cleans the text.
    """
    # Create empty lists to store the extracted data
    extracted_text = []
    doc_names = []
    doc_links = []
    
    for _, row in df.iterrows():
        evidence_list = row['evidence']
        
        # Check if the evidence list is not empty
        if evidence_list:
            first_evidence = evidence_list[0]
            
            # Safely get the text and clean it
            text = first_evidence.get('evidence_text', '')
            clean_text_output = clean_text(text)
            extracted_text.append(clean_text_output)
            
            # Safely get the doc_name and doc_link
            doc_names.append(first_evidence.get('doc_name', ''))
            doc_links.append(row.get('doc_link', '')) # 'doc_link' is a top-level column
        else:
            # Handle cases with no evidence
            extracted_text.append("")
            doc_names.append("")
            doc_links.append("")

    # Add the new, cleaned columns to the DataFrame
    df['cleaned_text'] = extracted_text
    df['doc_name'] = doc_names
    df['doc_link'] = doc_links
    
    return df

def main():
    # Create an instance of our DataLoader
    loader = DataLoader()

    # Load the open source dataset
    open_source_df = loader.load_jsonl_file("financebench_open_source.jsonl")

    if open_source_df is not None:
        # Preprocess the DataFrame
        processed_df = extract_and_clean_evidence(open_source_df)
        
        print("\nProcessed DataFrame with new columns:")
        # Display the new columns to verify the result
        print(processed_df[['question', 'cleaned_text', 'doc_name', 'doc_link']].head())
        
if __name__ == "__main__":
    main()
# analysis.py

import pandas as pd
import os
from data_loader import DataLoader

def main():
    """
    Main function to load the open source data and perform initial inspection.
    """
    # Create an instance of our DataLoader
    loader = DataLoader()

    # Load the open source dataset
    open_source_df = loader.load_jsonl_file("financebench_open_source.jsonl")

    if open_source_df is not None:
        print("\nColumns in the Open Source DataFrame:")
        print(open_source_df.columns)
        
        print("\nFirst 5 entries from key columns:")
        # Corrected line: 'question' is singular, not plural
        print(open_source_df[['question', 'evidence']].head())

        # You can also get more specific, for example, look at the first piece of evidence
        first_evidence = open_source_df['evidence'].iloc[0]
        print("\nStructure of the first 'evidence' entry:")
        print(first_evidence)
        
if __name__ == "__main__":
    main()
# data_loader.py

import pandas as pd
import os

class DataLoader:
    """
    A robust class for loading and managing the FinanceBench dataset files.
    This approach is cleaner and more reusable for a large project.
    """
    def __init__(self, base_dir="data"):
        """
        Initializes the DataLoader with the base directory for data files.
        """
        # Finds the absolute path of the data directory to avoid FileNotFoundError
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = os.path.join(script_dir, base_dir, "financebench-main", "data")

    def load_jsonl_file(self, filename):
        """
        Loads a single JSONL file into a pandas DataFrame.
        
        Args:
            filename (str): The name of the file to load (e.g., "financebench_document_information.jsonl").
            
        Returns:
            pd.DataFrame: The loaded DataFrame, or None if an error occurs.
        """
        file_path = os.path.join(self.data_dir, filename)
        
        if not os.path.exists(file_path):
            print(f"Error: File not found at path: {os.path.abspath(file_path)}")
            return None
        
        try:
            df = pd.read_json(file_path, lines=True)
            print(f"Successfully loaded {filename} with {len(df)} entries.")
            return df
        except Exception as e:
            print(f"Error reading {filename}: {e}")
            return None

# --- Example Usage (for demonstration purposes) ---
if __name__ == "__main__":
    # Create an instance of the DataLoader class
    loader = DataLoader()

    # Load the document information file
    doc_info_df = loader.load_jsonl_file("financebench_document_information.jsonl")

    if doc_info_df is not None:
        print("\nDocument Information DataFrame:")
        print(doc_info_df.head())
        print("\n---")
        
    # Now, let's load the other file to show reusability
    open_source_df = loader.load_jsonl_file("financebench_open_source.jsonl")

    if open_source_df is not None:
        print("\nOpen Source DataFrame:")
        print(open_source_df.head())
        print("\n---")
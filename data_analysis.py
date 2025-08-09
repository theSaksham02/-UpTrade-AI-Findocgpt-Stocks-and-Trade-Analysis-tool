import pandas as pd
import os

def load_financial_data(jsonl_path):
    """
    Load financial data from a JSONL file into a pandas DataFrame.
    Raises FileNotFoundError if the file does not exist.
    """
    if not os.path.exists(jsonl_path):
        print(f"Error: Could not find file at path: {os.path.abspath(jsonl_path)}")
        raise FileNotFoundError(f"File not found: {jsonl_path}")
    try:
        df = pd.read_json(jsonl_path, lines=True)
        print(f"Successfully loaded data from: {os.path.abspath(jsonl_path)}")
    except Exception as e:
        print(f"Error reading JSONL file: {e}")
        return None
    return df

def main():
    # Construct the file path relative to the script's directory.
    # This is the most reliable way to find the file.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "data", "financebench-main", "data", "financebench_document_information.jsonl")

    # Load the data
    df = load_financial_data(file_path)
    if df is None:
        return

    # Display first 5 rows
    print("\nFirst 5 rows of the DataFrame:")
    print(df.head())

    # Show columns and data types
    print("\nDataFrame information:")
    print(df.info())

    # Show summary statistics for numeric columns
    print("\nSummary statistics:")
    print(df.describe(include='all'))

if __name__ == "__main__":
    main()
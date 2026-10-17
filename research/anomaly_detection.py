# anomaly_detection.py

import pandas as pd

def detect_volume_anomalies(data, window=30, std_dev_factor=2.5):
    """
    Detects anomalies in trading volume using a rolling mean and standard deviation.

    An anomaly is defined as a day where the trading volume is significantly
    higher than the average volume over a given window.

    Args:
        data (pd.DataFrame): A pandas DataFrame containing historical stock data
                             with a 'Volume' column.
        window (int): The rolling window size to calculate the mean and standard deviation.
        std_dev_factor (float): The number of standard deviations above the mean
                                to be considered an anomaly.

    Returns:
        pd.DataFrame: The original DataFrame with two new columns:
                      'volume_anomaly' (boolean) and 'anomaly_reason' (string).
    """
    # Handle MultiIndex columns from yfinance
    if isinstance(data.columns, pd.MultiIndex):
        data.columns = ['_'.join(col).strip() if isinstance(col, tuple) else col for col in data.columns]
    
    # Find volume column (could be 'Volume', 'Volume_AAPL', etc.)
    volume_col = None
    for col in data.columns:
        if 'Volume' in str(col):
            volume_col = col
            break
    
    if volume_col is None or data[volume_col].empty:
        data['volume_anomaly'] = False
        data['anomaly_reason'] = ""
        return data

    # Calculate the rolling mean and standard deviation of the volume
    rolling_mean = data[volume_col].rolling(window=window).mean()
    rolling_std = data[volume_col].rolling(window=window).std()

    # Define the anomaly threshold
    anomaly_threshold = rolling_mean + (rolling_std * std_dev_factor)

    # Identify anomalies
    data['volume_anomaly'] = data[volume_col] > anomaly_threshold
    
    # Provide a reason for the anomaly
    def get_reason(row):
        try:
            # Get the volume_anomaly value safely
            is_anomaly = bool(row['volume_anomaly'])
            if is_anomaly:
                mean_vol = rolling_mean.loc[row.name]
                vol = row[volume_col]
                return (
                    f"Volume of {vol:,} was "
                    f"{vol / mean_vol:.1f}x higher than the {window}-day average."
                )
        except Exception:
            pass
        return ""
        
    data['anomaly_reason'] = data.apply(get_reason, axis=1)

    return data

def main():
    """
    Example usage of the anomaly detection function.
    """
    # Create a sample DataFrame with volume data
    dates = pd.to_datetime(pd.date_range(start="2023-01-01", periods=100))
    volume = pd.Series([100] * 100, index=dates)
    
    # Introduce some anomalies
    volume.iloc[30] = 500  # Spike
    volume.iloc[60] = 600  # Another spike
    volume.iloc[90] = 750  # A big spike
    
    sample_data = pd.DataFrame({'Volume': volume})
    
    # Detect anomalies
    anomalies_df = detect_volume_anomalies(sample_data)
    
    # Print the results
    detected_anomalies = anomalies_df[anomalies_df['volume_anomaly']]
    
    if not detected_anomalies.empty:
        print("🚨 Anomalies Detected:")
        print(detected_anomalies[['Volume', 'anomaly_reason']])
    else:
        print("✅ No anomalies detected.")

if __name__ == "__main__":
    main()

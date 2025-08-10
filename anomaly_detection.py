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
    if 'Volume' not in data or data['Volume'].empty:
        data['volume_anomaly'] = False
        data['anomaly_reason'] = ""
        return data

    # Calculate the rolling mean and standard deviation of the volume
    rolling_mean = data['Volume'].rolling(window=window).mean()
    rolling_std = data['Volume'].rolling(window=window).std()

    # Define the anomaly threshold
    anomaly_threshold = rolling_mean + (rolling_std * std_dev_factor)

    # Identify anomalies
    data['volume_anomaly'] = data['Volume'] > anomaly_threshold
    
    # Provide a reason for the anomaly
    def get_reason(row):
        if row['volume_anomaly']:
            mean_vol = rolling_mean[row.name]
            return (
                f"Volume of {row['Volume']:,} was "
                f"{row['Volume'] / mean_vol:.1f}x higher than the {window}-day average."
            )
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

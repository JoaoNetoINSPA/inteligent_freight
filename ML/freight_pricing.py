import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os

def load_data(file_path):
    print(f"Loading data from {file_path}...")
    df = pd.read_csv(file_path)
    print(f"Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
    return df

def prepare_features(df):
    feature_columns = [
        'customer_zip_code_prefix',
        'product_weight_g',
        'product_length_cm',
        'product_height_cm',
        'product_width_cm',
        'seller_zip_code_prefix'
    ]
    
    target_column = 'freight_value'
    
    print(f"\nPreparing features: {feature_columns}")
    print(f"Target variable: {target_column}")
    
    X = df[feature_columns].copy()
    y = df[target_column].copy()
    
    print(f"\nInitial data shape: X={X.shape}, y={y.shape}")
    
    missing_values = X.isnull().sum()
    if missing_values.any():
        print(f"\nMissing values found:")
        print(missing_values[missing_values > 0])
        X = X.fillna(X.median())
        print("Missing values filled with median")
    
    infinite_values = np.isinf(X.select_dtypes(include=[np.number])).sum()
    if infinite_values.any():
        print(f"\nInfinite values found:")
        print(infinite_values[infinite_values > 0])
        X = X.replace([np.inf, -np.inf], np.nan)
        X = X.fillna(X.median())
        print("Infinite values replaced with median")
    
    valid_indices = ~(y.isnull() | np.isinf(y))
    X = X[valid_indices]
    y = y[valid_indices]
    
    print(f"\nAfter cleaning: X={X.shape}, y={y.shape}")
    print(f"Target statistics:")
    print(f"  Mean: {y.mean():.2f}")
    print(f"  Std: {y.std():.2f}")
    print(f"  Min: {y.min():.2f}")
    print(f"  Max: {y.max():.2f}")
    
    return X, y

def train_model(X, y):
    print("\n" + "="*50)
    print("Training Random Forest Regressor...")
    print("="*50)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    print("\nTraining model...")
    model.fit(X_train, y_train)
    
    print("\nEvaluating model...")
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    train_r2 = r2_score(y_train, y_train_pred)    
    test_r2 = r2_score(y_test, y_test_pred)
    
    return model, {
        'train_r2': train_r2,
        'test_r2': test_r2
    }

def save_model(model, file_path):
    print(f"\nSaving model to {file_path}...")
    with open(file_path, 'wb') as f:
        pickle.dump(model, f)
    file_size = os.path.getsize(file_path) / (1024 * 1024)
    print(f"Model saved successfully! File size: {file_size:.2f} MB")

def main():
    print("="*50)
    print("FREIGHT PRICING MODEL TRAINING")
    print("="*50)
    
    data_file = 'shipping_dataset.csv'
    model_file = 'freight_pricing_model.pickle'
    
    if not os.path.exists(data_file):
        print(f"Error: {data_file} not found!")
        return
    
    df = load_data(data_file)
    X, y = prepare_features(df)
    model, metrics = train_model(X, y)
    save_model(model, model_file)

    print("\n" + "="*50)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("="*50)
    print(f"\nModel saved as: {model_file}")
    print(f"Final Test R² Score: {metrics['test_r2']:.4f}")

if __name__ == "__main__":
    main()

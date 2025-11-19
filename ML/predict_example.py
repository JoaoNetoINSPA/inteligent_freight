import pickle
import pandas as pd
import os

def load_model(model_path='freight_pricing_model.pickle'):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    return model

def predict_freight(
    customer_zip_code_prefix,
    product_weight_g,
    product_length_cm,
    product_height_cm,
    product_width_cm,
    seller_zip_code_prefix,
    model_path='freight_pricing_model.pickle'
):
    model = load_model(model_path)
    
    features = pd.DataFrame({
        'customer_zip_code_prefix': [customer_zip_code_prefix],
        'product_weight_g': [product_weight_g],
        'product_length_cm': [product_length_cm],
        'product_height_cm': [product_height_cm],
        'product_width_cm': [product_width_cm],
        'seller_zip_code_prefix': [seller_zip_code_prefix]
    })
    
    predicted_freight = model.predict(features)
    return predicted_freight[0]

if __name__ == "__main__":
    print("="*50)
    print("FREIGHT PRICING PREDICTION EXAMPLE")
    print("="*50)
    
    example_prediction = predict_freight(
        customer_zip_code_prefix=28013,
        product_weight_g=650.0,
        product_length_cm=28.0,
        product_height_cm=9.0,
        product_width_cm=14.0,
        seller_zip_code_prefix=27277
    )
    
    print(f"\nExample prediction:")
    print(f"  Customer ZIP: 28013")
    print(f"  Seller ZIP: 27277")
    print(f"  Weight: 650g")
    print(f"  Dimensions: 28cm x 9cm x 14cm")
    print(f"\n  Predicted Freight Value: ${example_prediction:.2f}")
    print("\n" + "="*50)


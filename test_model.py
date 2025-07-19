#!/usr/bin/env python3
"""
Test script to verify that the plant disease detection model can be loaded
and used to make predictions on sample images.
"""

import os
import sys
import tensorflow as tf
from PIL import Image
import numpy as np

# Suppress TensorFlow INFO and WARNING messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Define the class names
CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

def test_model():
    """Test loading the model and making a prediction on a sample image."""
    print("🔍 Testing Plant Disease Detection Model")
    print("----------------------------------------")
    
    # Check if model file exists
    model_path = 'plant_disease_efficientnetb4.h5'
    if not os.path.exists(model_path):
        print(f"❌ Error: Model file '{model_path}' not found.")
        print(f"   Please ensure the model file is in the current directory: {os.getcwd()}")
        return False
    
    # Try to load the model
    print(f"📁 Loading model from: {model_path}")
    try:
        model = tf.keras.models.load_model(model_path, compile=False)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return False
    
    # Check for sample images
    sample_images = [
        file for file in os.listdir('.') 
        if file.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.isfile(file)
    ]
    
    if not sample_images:
        print("❌ No sample images found in the current directory.")
        print("   Please add some .jpg, .jpeg or .png files to test.")
        return False
    
    # Test prediction on a sample image
    sample_image = sample_images[0]
    print(f"🖼️  Testing prediction on: {sample_image}")
    
    try:
        # Load and preprocess the image
        img = Image.open(sample_image)
        img_resized = img.resize((380, 380))
        img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
        img_array = tf.expand_dims(img_array, 0)  # Create a batch
        
        # Make prediction
        predictions = model.predict(img_array)
        
        # Get the top prediction
        idx = np.argmax(predictions[0])
        prediction = CLASS_NAMES[idx]
        confidence = float(predictions[0][idx])
        
        print(f"✅ Prediction successful!")
        print(f"📊 Results:")
        print(f"   - Predicted class: {prediction}")
        print(f"   - Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        
        # Show top 3 predictions
        top_indices = predictions[0].argsort()[-3:][::-1]
        print("   - Top 3 predictions:")
        for i in top_indices:
            print(f"     {CLASS_NAMES[i]}: {predictions[0][i]:.4f} ({predictions[0][i]*100:.2f}%)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_model()
    if success:
        print("\n✅ Model test completed successfully!")
        print("   The model is working correctly and ready to use with the Laravel application.")
    else:
        print("\n❌ Model test failed.")
        print("   Please fix the issues before proceeding with the Laravel application.")
        sys.exit(1) 
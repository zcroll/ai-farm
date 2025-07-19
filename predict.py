#!/usr/bin/env python3
import sys
import json
import numpy as np
import tensorflow as tf
from PIL import Image
import os
import io
from contextlib import redirect_stdout, redirect_stderr

# Suppress TensorFlow INFO and WARNING messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Define the class names - same as in app.py
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

def main():
    """
    Main function to process command line arguments and run the prediction.
    
    Expected usage:
    python predict.py /path/to/image.jpg
    
    Output:
    JSON string with prediction and confidence
    """
    # Check if image path is provided
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Image path argument required"}))
        sys.exit(1)
    
    img_path = sys.argv[1]
    
    # Check if file exists
    if not os.path.exists(img_path):
        print(json.dumps({"error": f"Image file not found: {img_path}"}))
        sys.exit(1)
    
    try:
        # Load the model - use the same model file as in app.py
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'plant_disease_efficientnetb4.h5')
        model = tf.keras.models.load_model(model_path, compile=False)
        
        # Load and preprocess the image
        img = Image.open(img_path)
        img_resized = img.resize((380, 380))  # Same size as in app.py
        img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
        img_array = tf.expand_dims(img_array, 0)  # Create a batch
        
        # Redirect stdout to capture TensorFlow's progress output
        f = io.StringIO()
        with redirect_stdout(f):
            # Make prediction
            predictions = model.predict(img_array, verbose=0)  # Set verbose=0 to disable progress bar
        
        # Get the top prediction
        idx = np.argmax(predictions[0])
        prediction = CLASS_NAMES[idx]
        confidence = float(predictions[0][idx])
        
        # Return JSON result
        print(json.dumps({"prediction": prediction, "confidence": confidence}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 
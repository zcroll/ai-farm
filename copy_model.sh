#!/bin/bash

# Script to copy the plant disease detection model from the source directory to the project

SOURCE_DIR="$HOME/Desktop/abdlellhad"
MODEL_FILE="plant_disease_efficientnetb4.h5"
TARGET_DIR="."

echo "🔍 Looking for model file..."

if [ -f "$SOURCE_DIR/$MODEL_FILE" ]; then
    echo "✅ Found model file at: $SOURCE_DIR/$MODEL_FILE"
    
    if [ -f "$TARGET_DIR/$MODEL_FILE" ]; then
        echo "⚠️  Model file already exists in project directory."
        read -p "Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Operation cancelled."
            exit 1
        fi
    fi
    
    echo "📋 Copying model file to project directory..."
    cp "$SOURCE_DIR/$MODEL_FILE" "$TARGET_DIR/"
    
    if [ $? -eq 0 ]; then
        echo "✅ Model file copied successfully!"
        echo "📏 File size: $(du -h "$TARGET_DIR/$MODEL_FILE" | cut -f1)"
    else
        echo "❌ Failed to copy model file."
        exit 1
    fi
else
    echo "❌ Model file not found at: $SOURCE_DIR/$MODEL_FILE"
    echo "Please make sure the file exists and try again."
    exit 1
fi

# Copy sample test images if available
echo "🖼️  Looking for sample test images..."
IMAGE_COUNT=0

for img in "$SOURCE_DIR"/*.{jpg,jpeg,png}; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        echo "📋 Copying sample image: $filename"
        cp "$img" "$TARGET_DIR/"
        if [ $? -eq 0 ]; then
            IMAGE_COUNT=$((IMAGE_COUNT + 1))
        fi
    fi
done

if [ $IMAGE_COUNT -gt 0 ]; then
    echo "✅ Copied $IMAGE_COUNT sample images for testing."
else
    echo "⚠️  No sample images found in source directory."
    echo "You may need to add some images manually for testing."
fi

echo "🎉 Done! You can now run ./test_model.py to verify the model works correctly." 
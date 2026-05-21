import easyocr
import os

# Define a clean model storage path on your D drive project folder
d_drive_model_path = os.path.join(os.getcwd(), "easyocr_models")

print("🔄 Initializing Lightweight EasyOCR Engine on D: Drive...")
print(f"📂 Models will be saved to: {d_drive_model_path}")

# Initialize the reader and force it to store models on D:
reader = easyocr.Reader(['en'], gpu=False, model_storage_directory=d_drive_model_path)

image_name = 'sample.png'

if os.path.exists(image_name):
    print(f"🔍 Processing '{image_name}'... Please wait.")
    
    # Run text detection and recognition
    result = reader.readtext(image_name)
    
    print("\n--- 📄 EXTRACTED TEXT RESULTS ---")
    if result:
        for item in result:
            text = item[1]        # The actual string extracted
            confidence = item[2]  # The confidence percentage
            print(f"Detected: {text} (Confidence: {confidence:.2f})")
    else:
        print("[No text detected in this image]")
else:
    print(f"❌ Missing '{image_name}' in your backend folder!")
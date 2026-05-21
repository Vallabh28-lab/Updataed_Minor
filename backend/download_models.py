import os
import urllib.request
import zipfile

# Define the target folder on D drive
model_dir = r"D:\Sardesai_Data\MINOR\MINOR\backend\easyocr_models"
os.makedirs(model_dir, exist_ok=True)

# Direct URLs to the model zip files
models = {
    "craft_mlt_25k.zip": "https://github.com/JaidedAI/EasyOCR/releases/download/v1.3/craft_mlt_25k.zip",
    "english_g2.zip": "https://github.com/JaidedAI/EasyOCR/releases/download/v1.3/english_g2.zip"
}

print("📥 Starting manual download directly to D: drive...")

for zip_name, url in models.items():
    zip_path = os.path.join(model_dir, zip_name)
    
    # Download the zip file
    print(f"\n🔄 Downloading {zip_name}... Please wait.")
    try:
        # Using a browser-like user agent to prevent the connection from resetting
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        urllib.request.install_opener(opener)
        
        urllib.request.urlretrieve(url, zip_path)
        print(f"✅ Successfully downloaded {zip_name}")
        
        # Unzip the file immediately
        print(f"📦 Extracting {zip_name}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(model_dir)
            
        # Clean up the zip file to save space
        os.remove(zip_path)
        print(f"🧹 Cleaned up temporary {zip_name}")
        
    except Exception as e:
        print(f"❌ Failed downloading {zip_name}. Error: {e}")

print("\n🎉 All done! Check your folder to ensure the files are there.")
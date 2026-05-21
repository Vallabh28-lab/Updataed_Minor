from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
import json
import bcrypt  # Import bcrypt for password verification

app = Flask(__name__)
CORS(app) 

# 1. Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["legal_cases_db"] 
collection = db["past_cases"]

@app.route('/search', methods=['POST'])
def search_cases():
    filters = request.get_json()
    query = {}
    
    if filters.get("court") and filters["court"] != "All Courts":
        query["court_level"] = filters["court"]
    if filters.get("year") and filters["year"] != "All Years":
        query["year"] = filters["year"]
    if filters.get("type") and filters["type"] != "All Types":
        query["case_type"] = filters["type"]

    # Limit to 20 for performance across 26,000 cases
    results = list(collection.find(query).limit(20)) 
    return json.loads(json_util.dumps(results))

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        age = data.get('age')
        email = data.get('email')
        password = data.get('password')
        profession = data.get('profession')

        if not all([name, age, email, password, profession]):
            return jsonify({"message": "All fields are required", "status": "error"}), 400

        # Check if user already exists
        existing_user = db.users.find_one({"email": email})
        if existing_user:
            return jsonify({"message": "User already exists", "status": "error"}), 409

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Create user document
        user_doc = {
            "name": name,
            "age": int(age),
            "email": email,
            "password": hashed_password.decode('utf-8'),
            "profession": profession
        }

        # Insert user into database
        db.users.insert_one(user_doc)

        return jsonify({"message": "Account created successfully", "status": "success"}), 201

    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}", "status": "error"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password_provided = data.get('password')

        if not email or not password_provided:
            return jsonify({"message": "Email and password required", "status": "error"}), 400

        # Look for the user by email ONLY first
        user = db.users.find_one({"email": email})
        
        if user:
            # Get the hashed password from the database record
            hashed_password = user.get('password')

            # Verify the provided password against the stored hash
            # We encode both to bytes as required by bcrypt
            if bcrypt.checkpw(password_provided.encode('utf-8'), hashed_password.encode('utf-8')):
                # Don't return the password to the frontend for security
                user_data = {
                    "name": user.get("name"),
                    "email": user.get("email"),
                    "profession": user.get("profession")
                }
                return jsonify({
                    "message": "Login successful", 
                    "status": "success",
                    "user": user_data
                }), 200
            else:
                return jsonify({"message": "Invalid password", "status": "error"}), 401
        
        return jsonify({"message": "User not found", "status": "error"}), 404

    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}", "status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
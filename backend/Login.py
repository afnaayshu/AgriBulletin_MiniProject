# from flask import Flask, request, jsonify
# from flask_cors import CORS, cross_origin
# from pymongo import MongoClient

# app = Flask(__name__)
# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# # Connect to MongoDB
# client = MongoClient('mongodb://localhost:27017')
# db = client['Agribulletin']
# users_collection = db['login']

# @app.route("/api/login", methods=["POST"])
# @cross_origin()
# def login_route():
#     username = request.json.get("user")
#     password = request.json.get("password")
    
#     # Check if the username and password match an existing user
#     user = users_collection.find_one({"user": username, "password": password})
#     if user:
#         return jsonify({"success": True})
#     else:
#         # Check if the username exists in the database
#         existing_user = users_collection.find_one({"user": username})
#         if existing_user:
#             return jsonify({"success": False, "message": "Invalid password."})
#         else:
#             return jsonify({"success": False, "message": "Invalid username."})

# if __name__ == "__main__":
#     app.run(debug=True)
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# configure MongoDB connection
app.config['MONGO_URI'] = 'mongodb://localhost:27017/Agribulletin'
mongo = PyMongo(app)

# configure JWT
app.config['JWT_SECRET_KEY'] = 'mysecretkey123'
jwt = JWTManager(app)

# route for generating JWT token
@app.route('/api/token', methods=['POST'])
def generate_token():
    email = request.json.get('user')
    password = request.json.get('password')

    # check if user exists and password is correct
    user = mongo.db.login.find_one({'email': email})
    if user and user['password'] == password:
        access_token = create_access_token(identity=email)
        response = jsonify({'success': True, 'access_token': access_token})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 200
    else:
        response = jsonify({'success': False, 'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 401

# @app.route('/api/admin-dashboard')
# @jwt_required()
# def admin_dashboard():
#     return jsonify({'message': 'Welcome to the admin dashboard!'})

if __name__ == '__main__':
    app.run(debug=True)

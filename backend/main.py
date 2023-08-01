from bson import ObjectId

from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from automated_call import NotificationAll

from config import MONGODB_CONNECTION_STRING
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import json

import logging

# Add a logger
logger = logging.getLogger('get_complaints')
logger.setLevel(logging.DEBUG)  # Set the log level to DEBUG (you can adjust as needed)
# Create a file handler and set the log level to DEBUG
file_handler = logging.FileHandler('complaints.log')
file_handler.setLevel(logging.DEBUG)

# Create a formatter and attach it to the file handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Attach the file handler to the logger
logger.addHandler(file_handler)

#custom json class for object encoding

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)


app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'mysecretkey123'
jwt = JWTManager(app)

# Create a new client and connect to the server
client = MongoClient(MONGODB_CONNECTION_STRING, server_api=ServerApi('1'))

CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


# Connect to MongoDB
database_name = 'Agribulletin'
db = client[database_name]
notification_coll = db['notifications']
scheme_coll = db['schemes']
complaints_collection = db['complaints']
user_collection = db['users']

# Twilio account SID and auth token
account_sid = "AC7d5a5d71ed13a751651041264ed05e08"
auth_token = "a23ca706595fb7c7b5ed252cb042c1ce"
twilio_number = "+919745064634"  # Replace with your Twilio phone number

# Create a Twilio client
twilio_client = Client(account_sid, auth_token)

# route for generating JWT token
@app.route('/api/token', methods=['POST'])
def generate_token():
    email = request.json.get('email')
    password = request.json.get('password')
    # check if user exists and password is correct
    user_data = db['login'].find_one({'user': email})
    if user_data and user_data['user'] == email and user_data['password'] == password:
        access_token = create_access_token(identity=email)
        response = jsonify({'success': True, 'access_token': access_token})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
        return response, 200
    else:
        response = jsonify({'success': False, 'error': 'Invalid email or password'})
        response.headers.add('Access-Control-Allow-Origin', '*')  # Allow all origins
    return response, 401

#Save notification
# @app.route('/api/save-notification', methods=['POST'])
# def save_notification():
    # message_text = request.json.get('messageText')
    # scheme_name = request.json.get('schemeNameNotification')
    # notification_date_str = request.json.get('notificationDate')
    # notification_date = datetime.strptime(notification_date_str, '%Y-%m-%d')
# 
    # notification_coll.insert_one({'message': message_text, 'scheme_name': scheme_name,'notification_date': notification_date})
    # return jsonify({'message': 'Notification saved and SMS sent successfully'})
#Notification view Function
# @app.route('/api/notifications', methods=['GET'])
# def get_notifications():
    # try:
        # notifications = list(db.notifications.find())
        # for notification in notifications:
            # notification['_id'] = str(notification['_id'])
        # return jsonify(notifications), 200
    # except Exception as e:
from datetime import datetime
from bson import json_util

# Save notification
@app.route('/api/save-notification', methods=['POST'])
def save_notification():
    try:
        message_text = request.json.get('messageText')
        scheme_name = request.json.get('schemeNameNotification')
        notification_date_str = request.json.get('notificationDate')

        # Check if notification_date_str is not None before parsing it
        if notification_date_str is None:
            return jsonify({'error': 'notificationDate is missing or null'}), 400

        # Convert the date string to a datetime object
        notification_date = datetime.strptime(notification_date_str, '%d-%m-%Y')

        # Format the date to 'DD-MM-YYYY' before saving it
        formatted_notification_date = notification_date.strftime('%d-%m-%Y')

        notification_coll.insert_one({'message': message_text, 'scheme_name': scheme_name, 'notification_date': formatted_notification_date})
        return jsonify({'message': 'Notification saved and SMS sent successfully'}), 200

    except ValueError as ve:
        return jsonify({'error': 'Invalid date format for notificationDate'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Notification view Function
@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    try:
        notifications = list(db.notifications.find())

        # Format the notification_date field to 'DD-MM-YYYY'
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
            notification_date = notification.get('notification_date')
            if notification_date is not None:
                notification['notification_date'] = notification_date

        return json_util.dumps(notifications), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# automated call and sms
@app.route('/api/send-notification', methods=['POST'])
def send_notification():
    # Call the NotificationAll function
    NotificationAll()
    return jsonify({'message': 'Automated call and message sent successfully'})
 
# 
# scheme submit
@app.route('/api/submit-scheme', methods=['POST'])
def submit_scheme():
    scheme_Name = request.json.get('schemename')
    scheme_Description = request.json.get('description')
    scheme_Category = request.json.get('category')
    scheme_Type = request.json.get('type')
    scheme_coll.insert_one({
        'schemename': scheme_Name,
        'description': scheme_Description,
        'category': scheme_Category,
        'type': scheme_Type,
    })
    return jsonify({'message': 'Scheme submitted successfully'})

# Save complaint
@app.route('/api/save-complaint', methods=['POST'])
def save_complaint():
    try:
        complaint_data = request.get_json()
        # Adding the current date to the complaint data
        from datetime import datetime
        current_date = datetime.now().strftime('%d-%m-%Y')
        complaint_data['date'] = current_date


        result = complaints_collection.insert_one(complaint_data)
        if result.inserted_id:
            return jsonify({'message': 'Complaint saved successfully'})
        else:
            return jsonify({'error': 'Failed to save complaint'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Retrieve complaints
@app.route('/api/get-complaints', methods=['GET'])
def get_complaints():
    try:
        # Log that the function has been called
        logger.debug('get_complaints function called')

        # Retrieve all complaints sorted by the 'date' field in descending order
        complaints = db['complaints'].find().sort('date', -1)

        # Convert the MongoDB cursor to a list of dictionaries
        complaints_list = list(complaints)

        # Log the number of complaints retrieved
        logger.debug(f'Number of complaints retrieved: {len(complaints_list)}')

        # Log the complaints data including the Aadhaar Number field
        logger.debug('Complaints data:')
        for complaint in complaints_list:
            logger.debug(complaint)

        # Convert the complaints_list to JSON using the custom JSON encoder
        json_complaints = json.dumps(complaints_list, cls=CustomJSONEncoder)
        return json_complaints, 200  # Return JSON response

    except Exception as e:
        # Log the error message if an exception occurs
        logger.error(f'Error fetching complaints: {str(e)}')

        return jsonify({'error': str(e)}), 500


# Remove a complaint
@app.route('/api/complaintList/<complaint_id>', methods=['DELETE'])
def remove_complaint(complaint_id):
    try:
        result = db['complaints'].delete_one({'_id': ObjectId(complaint_id)})
        if result.deleted_count > 0:
            print(f"Complaint with id {complaint_id} removed successfully")
            return jsonify({'success': True, 'message': 'Complaint removed successfully'})
        else:
            print(f"Complaint with id {complaint_id} not found")
            return jsonify({'success': False, 'message': 'Complaint not found'})
    except Exception as e:
        print(f"Error removing complaint with id {complaint_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
# Add Members function
@app.route('/api/add_member', methods=['POST'])
def add_member():
    data = request.get_json()  # Get the JSON data directly without specifying the key
    name = data.get('name')
    phoneNumber = data.get('phoneNumber')
    email = data.get('email')
    address = data.get('address')
    aadhaar = data.get('aadhaar')  # Extract the Aadhaar number from the JSON data

    member = {
        'name': name,
        'phoneNumber': phoneNumber,
        'email': email,
        'address': address,
        'aadhaar': aadhaar  # Add the Aadhaar number to the member dictionary
    }
    user_collection.insert_one(member)

    return jsonify({'success': True}), 200

# Retrieve members
@app.route('/api/memberview', methods=['GET'])
def get_members():
    members = db.users.find()
    member_list = []
    for member in members:
        member_data = {
            '_id': str(member['_id']),
            'name': member['name'],
            'phoneNumber': member['phoneNumber'],
            'email': member['email'],
            'address': member['address'],
            'aadhaar': member.get('aadhaar', ''),  # Use .get() with a default value
        }
        member_list.append(member_data)
    return jsonify(member_list)


# Delete a member
@app.route('/api/memberDelete/<member_id>', methods=['DELETE'])
def delete_member(member_id):
    members_collection = db.users
    result = members_collection.delete_one({'_id': ObjectId(member_id)})
    if result.deleted_count == 1:
        return jsonify({'message': 'Member deleted successfully'}), 204
    else:
        return jsonify({'error': 'Member not found'}), 404

# Retrieve schemes
@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    category = request.args.get('category')
    type = request.args.get('type')
    search_term = request.args.get('schemename')

    filter_query = {}
    if category:
        if category != 'ALL':
            filter_query['category'] = category
    if type:
        if type != 'ALL':
            filter_query['type'] = type

    if search_term:
        if search_term != '':
            filter_query['schemename'] = { "$regex": "^" + search_term }

    print('________FQ' + str(filter_query))

    schemes = db['schemes'].find(filter_query)

    scheme_list = []
    for scheme in schemes:
        scheme_list.append({
            '_id': str(scheme['_id']),
            'schemeName': scheme['schemename'],
            'type': scheme['type'],
            'category': scheme['category'],
        })
    return jsonify(scheme_list)

# Retrieve scheme by ID
@app.route('/api/schemes/<id>', methods=['GET'])
def get_scheme_by_id(id):
    scheme = db['schemes'].find_one({'_id': ObjectId(id)})
    print(scheme)
    scheme_details = {
        '_id': str(scheme['_id']),
        'schemeName': scheme['schemename'],
        'description': scheme['description']
    }
    return jsonify(scheme_details)

@app.route('/api/markAsSolved/<complaint_id>', methods=['PUT'])
def mark_complaint_as_solved(complaint_id):
    try:
        # Find the complaint in the database
        complaint = complaints_collection.find_one({'_id': ObjectId(complaint_id)})
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404

        # If the complaint is already marked as solved, return an error
        if complaint.get('isSolved', False):
            return jsonify({'error': 'Complaint is already marked as solved'}), 400

        # Mark the complaint as solved
        complaints_collection.update_one({'_id': ObjectId(complaint_id)}, {'$set': {'isSolved': True}})
        
        # Return success message
        return jsonify({'message': 'Complaint marked as solved'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

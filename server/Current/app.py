from flask import Flask, request, jsonify
from flask_cors import CORS
from db import create_user, get_all_users, update_user, delete_user, get_user_by_id, get_today_attendance
from face_verification import verify_face
from werkzeug.utils import secure_filename
import os
from flask import send_from_directory

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

UPLOAD_FOLDER = 'img_refs'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif',"webp"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/img_refs/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/users", methods=["GET"])
def get_users():
    users = get_all_users()
    return jsonify(users)

@app.route("/attendance/today", methods=["GET"])
def get_today_attendance_route():
    attendance = get_today_attendance()
    return jsonify(attendance)

@app.route('/create_user', methods=['POST'])
def create_user_route():
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    img_file = request.files['img_ref']
    if img_file and allowed_file(img_file.filename):
        filename = secure_filename(img_file.filename)
        img_path = os.path.join(UPLOAD_FOLDER, filename)
        img_file.save(img_path)
        create_user(first_name, last_name, img_path)
        return jsonify({"message": "User created successfully"}), 200
    else:
        return jsonify({"error": "Invalid file format"}), 400

@app.route("/users/<int:id>", methods=["DELETE"])
def delete_user_route(id):
    delete_user(id)
    return jsonify({"message": f"User with ID {id} deleted"}), 200

@app.route("/users/<int:id>", methods=["PUT"])
def update_user_route(id):
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    img_ref = data.get("img_ref")

    if not all([first_name, last_name, img_ref]):
        return jsonify({"error": "Missing required fields"}), 400

    update_user(id, first_name, last_name, img_ref)
    return jsonify({"message": f"User with ID {id} updated"}), 200

@app.route("/verify-face", methods=["POST"])
def verify_face_route():
    if 'image' not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    file = request.files['image']
    result = verify_face(file)
    return jsonify(result)

@app.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = get_user_by_id(id)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404


if __name__ == "__main__":
    print("✅ Flask app running and connected to MySQL.")
    app.run(debug=True)

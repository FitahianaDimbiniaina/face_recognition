# Face Recognition Attendance System

A lightweight facial recognition system for **attendance tracking**, using **PyTorch** and **facenet-pytorch**. This system captures a single frame from a webcam, compares it with registered faces in the database, and verifies identity using facial embeddings.

## Overview

This project utilizes the following components:

- **MTCNN** for face detection
- **InceptionResnetV1** from FaceNet for facial embeddings
- **Flask** for the backend framework
- **MySQL** to store user data and face embeddings
- **Images** are saved in a local `img_refs/` folder with randomly generated filenames

## Tech Stack

- Python 3.9+
- Flask
- [facenet-pytorch](https://github.com/timesler/facenet-pytorch)
- PyTorch
- MySQL
- NumPy, UUID, Pillow

## Folder Structure

attendance-backend/
├── main.py               # Flask app with routes
├── utils.py              # Face embedding, similarity, and helper logic
├── img_refs/             # Folder storing reference images
├── app.db                # MySQL database with user data and embeddings
├── requirements.txt      # Dependencies for the project

## Database Schema

### `users` Table

| Column        | Type          | Description                            |
|---------------|---------------|----------------------------------------|
| `id`          | INT           | Auto-increment primary key             |
| `first_name`  | VARCHAR(255)   | User's first name                      |
| `last_name`   | VARCHAR(255)   | User's last name                       |
| `embedding`   | BLOB          | User's face embedding data (binary)    |
| `image_path`  | VARCHAR(255)   | Path to the stored reference image     |

---

## API Endpoints

### `POST /register`

Registers a new user with their name and reference image.

**Form Data:**
- `first_name`: string  
- `last_name`: string  
- `image`: file (.jpg/.png)

**Response:**
- `200 OK`: Successfully registered the user.
- `400 Bad Request`: Invalid data or face detection error.

### `POST /verify`

Captures a frame and checks it against all registered faces.

**Form Data:**
- `image`: file (.jpg/.png)

**Response:**
- `200 OK`: Matched user's name if confidence exceeds a defined threshold.
- `404 Not Found`: No matching user found.

---

## How to Run

1. Clone the repository.
2. Create a virtual environment:
   python -m venv venv
3. Activate the virtual environment:
   - On Windows:
     venv\Scripts\activate
   - On macOS/Linux:
     source venv/bin/activate
4. Install dependencies:
   pip install -r requirements.txt
5. Set up your MySQL database:
   - Create a database named `face_recognition`.
   - Create a table named `users` with the following schema:
     
     CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       first_name VARCHAR(255),
       last_name VARCHAR(255),
       embedding BLOB,
       image_path VARCHAR(255)
     );
6. Run the application:
   flask run

---

## How It Works

1. **Register Users**: Upload their name and a reference image to the system.
2. **Verify Identity**: When a user captures a frame, it’s sent to the backend.
3. **Backend Processing**:
   - MTCNN detects the face.
   - The face is then converted into an embedding using InceptionResnetV1 from FaceNet.
   - The system compares the embedding with the stored embeddings in the MySQL database to find a match.
4. If the match exceeds a similarity threshold, the system confirms the user's identity.

---

## Notes

- The system works with single-frame images, not live video.
- Use it for capturing images from webcams and then sending them for processing.
- It is optimized for small-scale usage, such as classrooms or offices.

---

## License

MIT License 

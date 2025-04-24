import os
import cv2
import torch
import requests
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
import numpy as np

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

mtcnn = MTCNN(image_size=160, margin=0, device=device)
model = InceptionResnetV1(pretrained='vggface2').eval().to(device)

def fetch_users_from_server():
    try:
        response = requests.get("http://localhost:5000/users")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user data: {e}")
        return []

def get_reference_embedding(path):
    if "localhost:5000/" in path:
        path = path.split("localhost:5000/")[-1]
    
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    
    img = Image.open(path).convert('RGB')
    face = mtcnn(img)
    if face is None:
        raise ValueError("No face detected in the reference image.")
    with torch.no_grad():
        emb = model(face.unsqueeze(0).to(device))
    return emb

def cosine_similarity(emb1, emb2):
    return torch.nn.functional.cosine_similarity(emb1, emb2).item()

users = fetch_users_from_server()
user_embeddings = {}

for user in users:
    try:
        emb = get_reference_embedding(user['img_ref'])
        full_name = user['first_name'] + " " + user['last_name']
        user_embeddings[full_name] = emb
    except Exception as e:
        print(f"Error processing {user['first_name']} {user['last_name']}: {e}")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img_pil = Image.fromarray(img_rgb)
    face = mtcnn(img_pil)

    if face is not None:
        with torch.no_grad():
            face_embedding = model(face.unsqueeze(0).to(device))

        best_match = None
        best_similarity = 0

        for name, reference_emb in user_embeddings.items():
            similarity = cosine_similarity(reference_emb, face_embedding)
            if similarity > best_similarity:
                best_similarity = similarity
                best_match = name if similarity > 0.6 else None

        if best_match:
            label = f'Match: {best_match} ({best_similarity:.2f})'
        else:
            label = f'No Match ({best_similarity:.2f})'

        cv2.putText(frame, label, (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (0, 255, 0) if best_match else (0, 0, 255), 2)

    cv2.imshow('Face Verification', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

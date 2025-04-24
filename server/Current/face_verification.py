from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
from PIL import Image
from db import get_all_users, insert_attendance
import os

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

mtcnn = MTCNN(image_size=160, margin=0, device=device)
model = InceptionResnetV1(pretrained='vggface2').eval().to(device)

def get_embedding_from_image(file_storage):
    img = Image.open(file_storage.stream).convert('RGB')
    face = mtcnn(img)
    if face is None:
        return None
    with torch.no_grad():
        emb = model(face.unsqueeze(0).to(device))
    return emb

def cosine_similarity(emb1, emb2):
    return torch.nn.functional.cosine_similarity(emb1, emb2).item()

def verify_face(file_storage):
    input_embedding = get_embedding_from_image(file_storage)
    if input_embedding is None:
        return {"match": False, "message": "No face detected"}

    users = get_all_users()
    best_match = None
    best_score = -1
    best_user_id = None

    for user in users:
        try:
            img_ref_url = user["img_ref"]
            if "localhost" in img_ref_url:
                img_path = img_ref_url.split("localhost:5000/")[-1]
            else:
                img_path = img_ref_url

            if not os.path.exists(img_path):
                print(f"Image not found: {img_path}")
                continue

            ref_img = Image.open(img_path).convert("RGB")
            ref_face = mtcnn(ref_img)

            if ref_face is None:
                print(f"No face detected for user {user['first_name']}")
                continue

            with torch.no_grad():
                ref_emb = model(ref_face.unsqueeze(0).to(device))

            score = cosine_similarity(input_embedding, ref_emb)
            print(f"Similarity with {user['first_name']}: {score:.4f}")

            if score > best_score:
                best_score = score
                best_match = user
                best_user_id = user["id"]

        except Exception as e:
            print(f"Error processing {user['first_name']}: {e}")
            continue

    if best_score > 0.6:
        date_str, time_str = insert_attendance(best_user_id)
        return {
            "match": True,
            "first_name": best_match["first_name"],
            "last_name": best_match["last_name"],
            "date": date_str,
            "time": time_str,
            "score": round(best_score, 2)
        }

    return {"match": False, "message": "No match", "score": round(best_score, 2)}
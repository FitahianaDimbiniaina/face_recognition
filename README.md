# 🧠 Real-Time Face Recognition System

A real-time face recognition system built with **PyTorch**, **facenet-pytorch**, and **Starlette**. It uses **MTCNN** for face detection and **FaceNet** for embedding generation, enabling fast and accurate identity verification.

---

## 🚀 Features

- 🔍 Real-time face detection using MTCNN
- 🧬 Face embeddings computed with InceptionResnetV1
- 🧠 Identity verification via cosine similarity
- 🗂️ User registration with face image and metadata (stored in JSON)
- 📸 Images saved with unique random filenames
- 🧾 Lightweight Starlette API backend

---

## 🧱 Tech Stack

- Python 3.9+
- [Starlette](https://www.starlette.io/) (ASGI web framework)
- [PyTorch](https://pytorch.org/)
- [facenet-pytorch](https://github.com/timesler/facenet-pytorch)
- NumPy, Pillow, UUID



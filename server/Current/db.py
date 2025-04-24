import os
import mysql.connector
from dotenv import load_dotenv
from datetime import datetime, timedelta
from flask import url_for
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")


def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )

def create_user(first_name, last_name, img_ref):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (first_name, last_name, img_ref) VALUES (%s, %s, %s)",
        (first_name, last_name, img_ref)
    )
    conn.commit()
    cursor.close()
    conn.close()

def get_all_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    for user in users:
        if user.get('img_ref'):
            user['img_ref'] = url_for('uploaded_file', filename=os.path.basename(user['img_ref']), _external=True)
    return users

def get_user_by_id(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user and user.get('img_ref'):
        user['img_ref'] = url_for('uploaded_file', filename=os.path.basename(user['img_ref']), _external=True)
    return user

def update_user(id, first_name, last_name, img_ref):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET first_name=%s, last_name=%s, img_ref=%s WHERE id=%s",
        (first_name, last_name, img_ref, id)
    )
    conn.commit()
    cursor.close()
    conn.close()

def delete_user(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

def insert_attendance(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%H:%M:%S')
    cursor.execute(
        "INSERT INTO attendance (user_id, date, time) VALUES (%s, %s, %s)",
        (user_id, date_str, time_str)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return date_str, time_str

def get_today_attendance():
    today_date = datetime.today().strftime('%Y-%m-%d')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
     SELECT u.first_name, u.last_name, a.date, a.time
     FROM attendance a
     JOIN users u ON a.user_id = u.id
     WHERE DATE(a.date) = %s
     ORDER BY a.time DESC
     """, (today_date,))

    attendance = cursor.fetchall()
    cursor.close()
    conn.close()

    for record in attendance:
        if isinstance(record['date'], datetime):
            record['date'] = record['date'].strftime('%Y-%m-%d')
        if isinstance(record['time'], timedelta):
            record['time'] = str(record['time'])

    return attendance

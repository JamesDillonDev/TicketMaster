from flask import Blueprint, request, jsonify
from db import get_db_connection
import jwt
import datetime

user_api = Blueprint("users", __name__)

# Register User
@user_api.route("/users", methods=["POST"])
def register_user():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "All fields required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
            (first_name, last_name, email, password)
        )
        conn.commit()
        user_id = cursor.lastrowid
    except Exception as e:
        conn.close()
        return jsonify({"error": str(e)}), 400
    conn.close()
    return jsonify({"message": "User registered", "user_id": user_id}), 201

# List Users
@user_api.route("/users", methods=["GET"])
def list_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, first_name, last_name, email FROM users")
    users = cursor.fetchall()
    conn.close()
    return jsonify([
        {
            "id": u[0],
            "first_name": u[1],
            "last_name": u[2],
            "email": u[3]
        } for u in users
    ])

# Login User
@user_api.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, first_name, last_name, email FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()
    if user is None:
        return jsonify({"error": "Invalid credentials"}), 401
    # Generate JWT token
    payload = {
        "user_id": user[0],
        "email": user[3],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    token = jwt.encode(payload, "secret_key", algorithm="HS256")
    return jsonify({
        "id": user[0],
        "first_name": user[1],
        "last_name": user[2],
        "email": user[3],
        "token": token
    })

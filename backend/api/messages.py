from flask import Blueprint, request, jsonify
from db import get_db_connection

message_api = Blueprint("messages", __name__)

#Post Message to Ticket
@message_api.route("/ticket/<int:ticket_id>/messages", methods=["POST"])
def post_message(ticket_id):
    data = request.json
    content = data.get("content")
    if not content:
        return jsonify({"error": "Message content required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()
    if ticket is None:
        conn.close()
        return jsonify({"error": "Ticket not found"}), 404

    cursor.execute(
        "INSERT INTO messages (ticket_id, content) VALUES (?, ?)",
        (ticket_id, content)
    )
    conn.commit()
    message_id = cursor.lastrowid
    conn.close()
    return jsonify({"message": "Message posted", "message_id": message_id}), 201

#Get Messages for Ticket
@message_api.route("/ticket/<int:ticket_id>/messages", methods=["GET"])
def get_messages(ticket_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()
    if ticket is None:
        conn.close()
        return jsonify({"error": "Ticket not found"}), 404

    cursor.execute("SELECT id, content, created_at FROM messages WHERE ticket_id = ? ORDER BY created_at ASC", (ticket_id,))
    messages = cursor.fetchall()
    conn.close()
    return jsonify([
        {
            "id": msg[0],
            "content": msg[1],
            "created_at": msg[2]
        } for msg in messages
    ])

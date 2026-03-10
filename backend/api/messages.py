from flask import Blueprint, request, jsonify
from db import get_db_connection

message_api = Blueprint("messages", __name__)

# Delete Message
@message_api.route("/messages/<int:message_id>", methods=["DELETE"])
def delete_message(message_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
        msg = cursor.fetchone()
        if msg is None:
            return jsonify({"error": "Message not found"}), 404
        cursor.execute("DELETE FROM messages WHERE id = ?", (message_id,))
        conn.commit()
        return jsonify({"message": "Message deleted"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Edit Message
@message_api.route("/messages/<int:message_id>", methods=["PUT"])
def edit_message(message_id):
    data = request.json
    content = data.get("content")
    if not content:
        return jsonify({"error": "Message content required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
        msg = cursor.fetchone()
        if msg is None:
            return jsonify({"error": "Message not found"}), 404
        cursor.execute("UPDATE messages SET content = ? WHERE id = ?", (content, message_id))
        conn.commit()
        return jsonify({"message": "Message updated"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
        
#Post Message to Ticket
@message_api.route("/ticket/<int:ticket_id>/messages", methods=["POST"])
def post_message(ticket_id):
    data = request.json
    content = data.get("content")
    user_id = data.get("user_id")
    if not content:
        return jsonify({"error": "Message content required"}), 400
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
        ticket = cursor.fetchone()
        if ticket is None:
            return jsonify({"error": "Ticket not found"}), 404

        cursor.execute(
            "INSERT INTO messages (ticket_id, user_id, content) VALUES (?, ?, ?)",
            (ticket_id, user_id, content)
        )
        conn.commit()
        message_id = cursor.lastrowid
        return jsonify({"message": "Message posted", "message_id": message_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

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

    cursor.execute(
        """
        SELECT m.id, m.content, m.created_at, u.first_name, u.last_name, u.email
        FROM messages m
        JOIN users u ON m.user_id = u.id
        WHERE m.ticket_id = ?
        ORDER BY m.created_at ASC
        """,
        (ticket_id,)
    )
    messages = cursor.fetchall()
    conn.close()
    return jsonify([
        {
            "id": msg[0],
            "content": msg[1],
            "created_at": msg[2],
            "first_name": msg[3],
            "last_name": msg[4],
            "email": msg[5]
        } for msg in messages
    ])

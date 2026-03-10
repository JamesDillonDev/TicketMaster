from flask import Blueprint, request, jsonify
from db import get_db_connection

ticket_api = Blueprint("tickets", __name__)

#Get Ticket
@ticket_api.route("/ticket/<int:ticket_id>", methods=["GET"])
def get_ticket(ticket_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()
    conn.close()

    if ticket is None:
        return jsonify({"error": "Ticket not found"}), 404

    return jsonify({
        "id": ticket[0],
        "title": ticket[1],
        "description": ticket[2]
    })

#Create Ticket
@ticket_api.route("/ticket", methods=["POST"])
def create_ticket():
    data = request.json
    title = data.get("title")
    description = data.get("description")

    if not title:
        return jsonify({"error": "Title is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tickets (title, description) VALUES (?, ?)",
        (title, description)
    )
    conn.commit()
    ticket_id = cursor.lastrowid
    conn.close()

    return jsonify({"message": "Ticket created", "ticket_id": ticket_id}), 201

#Update Ticket
@ticket_api.route("/ticket/<int:ticket_id>", methods=["PUT"])
def update_ticket(ticket_id):
    data = request.json
    title = data.get("title")
    description = data.get("description")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()

    if ticket is None:
        conn.close()
        return jsonify({"error": "Ticket not found"}), 404

    cursor.execute(
        "UPDATE tickets SET title = ?, description = ? WHERE id = ?",
        (title, description, ticket_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Ticket updated"})

#Delete Ticket
@ticket_api.route("/ticket/<int:ticket_id>", methods=["DELETE"])
def delete_ticket(ticket_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets WHERE id = ?", (ticket_id,))
    ticket = cursor.fetchone()

    if ticket is None:
        conn.close()
        return jsonify({"error": "Ticket not found"}), 404

    cursor.execute("DELETE FROM tickets WHERE id = ?", (ticket_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Ticket deleted"})

#Get Tickets
@ticket_api.route("/tickets", methods=["GET"])
def get_tickets():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tickets")
    tickets = cursor.fetchall()
    conn.close()

    return jsonify([
        {
            "id": ticket[0],
            "title": ticket[1],
            "description": ticket[2]
        } for ticket in tickets
    ])

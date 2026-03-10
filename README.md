# TicketMaster

TicketMaster is a full-stack web application for managing tickets and messages. It features a Flask backend and a React frontend, allowing users to create, edit, delete, and comment on tickets.

## Features
- Create, edit, and delete tickets
- Post and view messages on tickets
- Responsive UI with React Bootstrap
- Confirmation modal for ticket deletion
- Real-time toast notifications

## Project Structure
- `backend/`: Flask API server
  - `db.py`: Database setup and connection
  - `api/`: Ticket and message endpoints
- `frontend/`: React client app
  - `src/pages/`: Ticket and message UI components

## Setup Instructions

### Backend
1. Navigate to the backend folder:
	```
	cd backend
	```
2. Install Python dependencies:
	```
	pip install flask flask-cors
	```
3. Run the backend server:
	```
	python index.py
	```

### Frontend
1. Navigate to the frontend folder:
	```
	cd frontend
	```
2. Install Node dependencies:
	```
	npm install
	```
3. Start the frontend dev server:
	```
	npm run dev
	```

## Usage
- Access the app at `http://localhost:5173` (frontend)
- Backend runs at `http://localhost:5000`
- Create tickets, edit details, post messages, and delete tickets with confirmation

## License
GNU
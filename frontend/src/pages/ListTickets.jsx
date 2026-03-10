import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const backendUrl = 'http://localhost:5000';

export default function ListTickets() {
	const [tickets, setTickets] = useState([]);
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState('');

	const fetchTickets = async () => {
		try {
			const res = await axios.get(`${backendUrl}/tickets`);
			setTickets(res.data);
		} catch (err) {
			setError('Failed to fetch tickets');
		}
	};

	useEffect(() => {
		fetchTickets();
	}, []);

	const handleDeleteClick = (id) => {
		setDeleteId(id);
		setShowModal(true);
		setDeleteError('');
	};

	const handleDeleteConfirm = async () => {
		setDeleteLoading(true);
		setDeleteError('');
		try {
			await axios.delete(`${backendUrl}/ticket/${deleteId}`);
			setShowModal(false);
			setDeleteId(null);
			fetchTickets();
		} catch (err) {
			setDeleteError('Failed to delete ticket');
		}
		setDeleteLoading(false);
	};

	const handleDeleteCancel = () => {
		setShowModal(false);
		setDeleteId(null);
		setDeleteError('');
	};

	return (
		<Container fluid className="mt-4">
			<Row>
				<Col>
					<h2>Tickets</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					<Table striped bordered hover className="w-100">
						<thead>
							<tr>
								<th>Title</th>
								<th>Description</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{tickets.map(ticket => (
								<tr key={ticket.id}>
									<td>{ticket.title}</td>
									<td>{ticket.description}</td>
									<td>
										<Button
											as={Link}
											to={`/view/${ticket.id}`}
											variant="primary"
											size="sm"
											className="me-2"
											title="View"
										>
											<FaEdit />
										</Button>
										<Button
											variant="danger"
											size="sm"
											onClick={() => handleDeleteClick(ticket.id)}
											title="Delete"
										>
											<FaTrash />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Col>
			</Row>
			<Modal show={showModal} onHide={handleDeleteCancel} centered>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{deleteError && <Alert variant="danger">{deleteError}</Alert>}
					Are you sure you want to delete this ticket?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleDeleteCancel} disabled={deleteLoading}>Cancel</Button>
					<Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
						{deleteLoading ? 'Deleting...' : 'Delete'}
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
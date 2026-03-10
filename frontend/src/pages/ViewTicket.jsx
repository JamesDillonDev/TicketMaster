import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewTicket() {
    const backendUrl = 'http://localhost:5000';
	const { id } = useParams();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [messages, setMessages] = useState([]);
	const [newMsg, setNewMsg] = useState('');
	const [msgError, setMsgError] = useState('');
	const [msgSuccess, setMsgSuccess] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTicket = async () => {
			try {
				const res = await axios.get(`${backendUrl}/ticket/${id}`);
				setTitle(res.data.title);
				setDescription(res.data.description);
			} catch (err) {
				setError('Failed to fetch ticket');
			}
		};
		const fetchMessages = async () => {
			try {
				const res = await axios.get(`${backendUrl}/ticket/${id}/messages`);
				setMessages(res.data);
			} catch (err) {
				setMsgError('Failed to fetch messages');
			}
		};
		fetchTicket();
		fetchMessages();
	}, [id]);

	const handleUpdate = async (e) => {
		e.preventDefault();
		setError('');
		setMessage('');
		try {
			await axios.put(`${backendUrl}/ticket/${id}`, {
				title,
				description,
			});
			setMessage('Ticket updated');
			setTimeout(() => setMessage(''), 2000);
			// Stay on the page after update
		} catch (err) {
			setError('Failed to update ticket');
		}
	};

	const handlePostMessage = async (e) => {
		e.preventDefault();
		setMsgError('');
		setMsgSuccess('');
		if (!newMsg) {
			setMsgError('Message content required');
			return;
		}
		try {
			await axios.post(`${backendUrl}/ticket/${id}/messages`, { content: newMsg });
			setMsgSuccess('Message posted');
			setTimeout(() => setMsgSuccess(''), 2000);
			setNewMsg('');
			// Refresh messages
			const res = await axios.get(`${backendUrl}/ticket/${id}/messages`);
			setMessages(res.data);
		} catch (err) {
			setMsgError('Failed to post message');
		}
	};

	return (
		<Container className="mt-4">
			<Row>
				<Col md={6}>
					<h2>Edit Ticket</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					{message && <Alert variant="success">{message}</Alert>}
					<Form onSubmit={handleUpdate}>
						<Form.Group className="mb-3">
							<Form.Label>Title</Form.Label>
							<Form.Control
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Edit ticket title"
							/>
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Edit ticket description"
							/>
						</Form.Group>
						<Button type="submit" variant="success">Update</Button>{' '}
						<Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
					</Form>
				</Col>
				<Col md={6}>
					<h2>Messages</h2>
					{msgError && <Alert variant="danger">{msgError}</Alert>}
					{msgSuccess && <Alert variant="success">{msgSuccess}</Alert>}
					<ListGroup className="mb-3">
						{messages.length === 0 && <ListGroup.Item>No messages yet.</ListGroup.Item>}
						{messages.map(msg => (
							<ListGroup.Item key={msg.id}>
								<div>{msg.content}</div>
								<small className="text-muted">{new Date(msg.created_at).toLocaleString()}</small>
							</ListGroup.Item>
						))}
					</ListGroup>
					<Form onSubmit={handlePostMessage}>
						<Form.Group className="mb-3">
							<Form.Label>Post a Message</Form.Label>
							<Form.Control
								as="textarea"
								value={newMsg}
								onChange={e => setNewMsg(e.target.value)}
								placeholder="Enter your message"
							/>
						</Form.Group>
						<Button type="submit" variant="primary">Post Message</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

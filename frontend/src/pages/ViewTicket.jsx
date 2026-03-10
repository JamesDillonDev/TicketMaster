import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewTicket({ user }) {
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
			await axios.post(
				`${backendUrl}/ticket/${id}/messages`,
				{ content: newMsg, user_id: user.id },
				{ headers: { Authorization: `Bearer ${user.token}` } }
			);
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
							<ListGroup.Item key={msg.id} className="d-flex justify-content-between align-items-start">
								<div className="flex-grow-1">
									{msg.editing ? (
										<Form
											onSubmit={async e => {
												e.preventDefault();
												try {
													await axios.put(
														`${backendUrl}/messages/${msg.id}`,
														{ content: msg.editContent },
														{ headers: { Authorization: `Bearer ${user.token}` } }
													);
													setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, content: msg.editContent, editing: false } : m));
												} catch {
													setMsgError('Failed to edit message');
												}
											}}
										>
											<Form.Group className="mb-2">
												<Form.Control
													as="textarea"
													value={msg.editContent}
													onChange={e => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, editContent: e.target.value } : m))}
												/>
											</Form.Group>
											<Button type="submit" size="sm" variant="success">Save</Button>{' '}
											<Button size="sm" variant="secondary" onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, editing: false } : m))}>Cancel</Button>
										</Form>
									) : (
										<>
											<div>{msg.content}</div>
											<div>
												<small className="text-muted">
													Sent by {msg.first_name} {msg.last_name} ({msg.email})<br />
													{new Date(msg.created_at).toLocaleString()}
												</small>
											</div>
										</>
									)}
								</div>
								{user.email === msg.email && !msg.editing && (
									<div className="ms-auto d-flex align-items-center">
										<Button
											size="sm"
											variant="link"
											className="p-1 me-2"
											title="Edit"
											onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, editing: true, editContent: m.content } : m))}
										>
											<FaEdit/>
										</Button>
										<Button
											size="sm"
											variant="link"
											className="p-1"
											title="Delete"
											onClick={async () => {
												try {
													await axios.delete(
														`${backendUrl}/messages/${msg.id}`,
														{ headers: { Authorization: `Bearer ${user.token}` } }
													);
													setMessages(prev => prev.filter(m => m.id !== msg.id));
												} catch {
													setMsgError('Failed to delete message');
												}
											}}
										>
											<FaTrash />
										</Button>
									</div>
								)}
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



import { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const backendUrl = 'http://localhost:5000';

export default function CreateTicketPage({ user }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!title) {
            setError('Title required');
            return;
        }
        try {
            await axios.post(
                `${backendUrl}/ticket`,
                { title, description, user_id: user.id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMessage('Ticket created');
            setTitle('');
            setDescription('');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            setError('Failed to create ticket');
        }
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={6}>
                    <h2>Create Ticket</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter ticket title"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter ticket description"
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary">Create</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
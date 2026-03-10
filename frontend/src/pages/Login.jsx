import { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const backendUrl = 'http://localhost:5000';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    try {
      const res = await axios.post(`${backendUrl}/login`, { email, password });
      setMessage('Login successful');
      setEmail('');
      setPassword('');
      if (onLogin) onLogin(res.data);
      setTimeout(() => navigate('/'), 500);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h2>Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </Form.Group>
            <Button type="submit" variant="primary">Login</Button>
            <Button variant="link" onClick={() => navigate('/register')} className="mt-2">Don't have an account? Register</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

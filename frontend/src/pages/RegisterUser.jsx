import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const backendUrl = 'http://localhost:5000';

export default function RegisterUser() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!firstName || !lastName || !email || !password) {
      setError('All fields required');
      return;
    }
    try {
      await axios.post(`${backendUrl}/users`, {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      setMessage('User registered');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError('Failed to register user');
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h2>Register User</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </Form.Group>
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
            <Button type="submit" variant="primary">Register</Button>
            <Button variant="link" onClick={() => navigate('/login')} className="mt-2">Already have an account? Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
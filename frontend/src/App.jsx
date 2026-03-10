import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation  } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useState } from 'react';
import ListTickets from './pages/ListTickets.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import ViewTicket from './pages/ViewTicket.jsx';
import RegisterUser from './pages/RegisterUser.jsx';
import Login from './pages/Login.jsx';

function ProtectedRoute({ user, children }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ticketmaster_user');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('ticketmaster_user', JSON.stringify(userData));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ticketmaster_user');
  };

  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand as={Link} to="/">TicketMaster</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user && <Nav.Link as={Link} to="/">Home</Nav.Link>}
            {user && <Nav.Link as={Link} to="/create">Create Ticket</Nav.Link>}
          </Nav>
          {user && (
            <span className="ms-auto me-2">Logged in as {user.first_name} {user.last_name}</span>
          )}
          {user && (
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Logout</Button>
          )}
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<ProtectedRoute user={user}><ListTickets user={user} /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute user={user}><CreateTicket user={user} /></ProtectedRoute>} />
        <Route path="/view/:id" element={<ProtectedRoute user={user}><ViewTicket user={user} /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;

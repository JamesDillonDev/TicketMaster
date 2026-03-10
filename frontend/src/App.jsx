import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import ListTickets from './pages/ListTickets.jsx';
import CreateTicket from './pages/CreateTicket.jsx';
import ViewTicket from './pages/ViewTicket.jsx';

function App() {
  return (
    <Router>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand as={Link} to="/">TicketMaster</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/create">Create Ticket</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Routes>
        <Route path="/" element={<ListTickets />} />
        <Route path="/create" element={<CreateTicket />} />
        <Route path="/view/:id" element={<ViewTicket />} />
      </Routes>
    </Router>
  );
}

export default App;

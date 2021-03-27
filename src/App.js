import 'bootstrap/dist/css/bootstrap.min.css';
import {
   Navbar, Nav, 
 } from 'react-bootstrap';
import {
  // BrowserRouter as Router,
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Journal from './Journal'
import Category from './Category'

function App() {
  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Money Journey</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Link to="/journal">Journal&nbsp;&nbsp;</Link>
            <Link to="/category">Category</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/journal">
          <Journal />
        </Route>
        <Route path="/category">
          <Category />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

// function CategoryManagement() {
//   return (
//     <h1>Category Management</h1>
//   )
// }



function Home() {
  return (
    <h1>Home Page</h1>
  )
}
export default App;

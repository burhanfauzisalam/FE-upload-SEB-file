// components/Navbar.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";

const MyNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const logout = () => {
    Cookies.remove("id-teacher");
    window.location.reload;
  };
  return (
    <Navbar className="navbar-custom" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} href="/">
          <img src="./logo.png" width={60} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">
              Home
            </Nav.Link>
            {/* <Nav.Link as={Link} href="/about">
              About
            </Nav.Link> */}
            <NavDropdown title="Assessment" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="/action1">
                Quiz
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/action2">
                Mid-term
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/action3">
                Final assessment
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <hr></hr>
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="#" onClick={logout}>
              <MdLogout />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

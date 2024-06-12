// components/Navbar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { MdLogout } from "react-icons/md";
import Cookies from "js-cookie";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";

const MyNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState("");

  const token = Cookies.get("token");
  // console.log(token);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.post(
          `https://api-seb-file.vercel.app/api/decode`,
          // `http://192.168.0.116:5000/api/decode`,
          {},
          { headers: { token: token } }
          // { token }
        );
        setUser(res.data.name);
        // console.log(res.status);
      } catch (error) {
        // console.log("Error fetching data:", error);
        Cookies.remove("token");
        window.location.reload();
      }
    };
    getUser();
  }, []);

  const logout = () => {
    Cookies.remove("token");
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
            {/* <Nav.Link as={Link} href="/">
              Home
            </Nav.Link> */}
            <Nav.Link as={Link} href="/teacher/upload">
              Upload
            </Nav.Link>
            <NavDropdown title="Assessment" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} href="/">
                Quiz
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/">
                Mid-term
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/">
                Final assessment
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <hr></hr>
          <Nav className="ms-auto">
            <Nav.Link as={Link} href="#" className="d-flex align-items-center">
              <FaUserAlt />
              <span className="ml-2">{user}</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              href="#"
              onClick={logout}
              className="d-flex align-items-center"
            >
              <span className="mr-2">Logout</span> <MdLogout />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;

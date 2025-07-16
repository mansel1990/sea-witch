import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import redIcon from "../images/SeaWitchRed.svg";

const Header = () => {
  const [floating, setFloating] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setFloating(true);
      } else {
        setFloating(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <Navbar
        className={classNames("navbar navbar-expand-lg navbar-dark header", {
          "header--float": floating,
        })}
        expand="lg"
        collapseOnSelect
        fixed="top"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={redIcon} alt="sea" className="header__logo" />
              <span className="header__name">Sea Witch</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/admin">
                <Nav.Link>
                  <i className="fa fa-list px-1" aria-hidden="true" />
                  Watchlist
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/admin">
                <Nav.Link>
                  <i className="fa fa-film px-1" aria-hidden="true" />
                  My Reviews
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fa fa-user px-1" aria-hidden="true" />
                    Log in
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

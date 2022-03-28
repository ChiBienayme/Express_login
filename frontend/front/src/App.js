//react
import React from "react";

//  React router dom
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

//pages
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";

// CSS
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link className="text-link" to="/singup">
          Signup
        </Link>
        <Link className="text-link" to="/login">
          Login
        </Link>
        <Link className="text-link" to="/admin">
          Admin
        </Link>
      </nav>

      <Routes>
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/admin" component={Admin} />
      </Routes>
    </BrowserRouter>
  );
}

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";

function App() {
    return (
        <Router>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>Choose a Login</h1>
                <Link to="/login/student">
                    <button>Öğrenci</button>
                </Link>
                <Link to="/login/teacher">
                    <button>Öğretmen</button>
                </Link>
                <Link to="/login/admin">
                    <button>Koç</button>
                </Link>

                <Routes>
                    <Route path="/login/:id" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

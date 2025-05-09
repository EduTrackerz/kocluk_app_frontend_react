import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterStudent from "./registerPages/RegisterStudent";
import RegisterTeacher from "./registerPages/RegisterTeacher";
import RegisterAdmin from "./registerPages/RegisterAdmin";
import StudentMainPage from "./StudentMainPage";
import AdminMainPage from './AdminMainPage';
import CreateExamForm from './CreateExamForm';
import Header from './theme/Header';

const testAdmin = {
    id: "test-admin-123",
    role: "admin"
};

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <Routes>
                    <Route path="/" element={
                        <div style={{ textAlign: "center", marginTop: "50px" }}>
                            <h1>Giriş Türünü Seçin</h1>
                            <Link to="/login/student">
                                <button>Öğrenci</button>
                            </Link>
                            <Link to="/login/teacher">
                                <button>Öğretmen</button>
                            </Link>
                            <Link to="/login/admin">
                                <button>Yönetici</button>
                            </Link>
                        </div>
                    } />

                    <Route path="/login/:role" element={<LoginPage />} />
                    <Route path="/register/student" element={<RegisterStudent />} />
                    <Route path="/register/admin" element={<RegisterAdmin />} />
                    <Route path="/register/teacher" element={<RegisterTeacher />} />

                    <Route path="/mainpage/student/:id" element={<StudentMainPage />} />
                </Routes>
            </div>

            <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />

        </Router>
    );
}

export default App;
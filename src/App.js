import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterStudent from "./registerPages/RegisterStudent";
import RegisterTeacher from "./registerPages/RegisterTeacher";
import RegisterAdmin from "./registerPages/RegisterAdmin";
import StudentMainPage from "./StudentMainPage";
import AdminMainPage from './AdminMainPage';
import CreateExamForm from './CreateExamForm';

function App() {
    return (
        <Router>
            <div className="app-container">
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

                    <Route path="/mainPage/admin/:id" element={<AdminMainPage />}>
                        <Route path="exam-create" element={<CreateExamForm />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterStudent from "./RegisterStudent";
import StudentMainPage from "./StudentMainPage";

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
                    <Route path="/login/:role" element={<LoginPage />} />
                    <Route path="/mainpage/student/:id" element={<StudentMainPage />} />
                    <Route path="/register/student" element={<RegisterStudent />} />
                    {/* <Route path="/teacher/mainPage/:username" element={<TeacherMainPage />} /> */}
                    {/* <Route path="/admin/mainPage/:username" element={<AdminMainPage />} /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

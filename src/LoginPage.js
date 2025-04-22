import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Student from "./entities/Student";  // Import the Student class

function LoginPage() {
    const { role } = useParams(); // Get login role from URL
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const roleNames = {
        student: "Öğrenci",
        teacher: "Öğretmen",
        admin: "Koç",
    };
    const roleName = roleNames[role] || "Bilinmeyen Rol";

    const handleLogin = async () => {
        switch (role) {
            case "student":
                try {
                    // Use Student.getById to fetch the student data
                    const student = await Student.getByUsername(username);  // This uses the static method from Student.js
        
                    if (student) {
                        // Navigate to student's main page
                        navigate(`/student/mainPage/${student.id}`);
                    } else {
                        // Handle case where student is not found or an error occurred
                        alert("Öğrenci bulunamadı.");
                    }
                    
                } catch (error) {
                    console.error("Login error:", error);
                    alert("Giriş işlemi sırasında bir hata oluştu.");
                }
                break;
            case "teacher":
                alert("Not implemented yet.");
                return;
            case "admin":
                alert("Not implemented yet.");
                return;
            default:
                alert("Geçersiz bir rol ile giriş yapmaya çalışıyorsunuz.");
                return;
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{roleName} olarak giriş yap</h2>
            <input 
                type="text" 
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            {/* Login button */}
            <button 
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleLogin}
            >
                Giriş Yap
            </button>

            {/* Register Button */}
            <p className="mt-4">
                Hesabınız yok mu?{" "}
                <Link to="/register/student" className="text-blue-500 underline">
                    Kayıt Ol
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;

import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Student from "./entities/Student";  // Import the Student class
import Admin from "./entities/Admin";  // Import the Student class
import Teacher from "./entities/Teacher";  // Import the Student class

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
                        navigate(`/mainpage/student/${student.id}`);
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
                try {
                    // Use Student.getById to fetch the student data
                    const teacher = await Teacher.getByUsername(username);  // This uses the static method from Student.js
        
                    if (teacher) {
                        // Navigate to teachers's main page
                        navigate(`/teacher/mainPage/${teacher.id}`);
                    } else {
                        // Handle case where student is not found or an error occurred
                        alert("Yönetici bilgileri bulunamadı.");
                    }
                    
                } catch (error) {
                    console.error("Login error:", error);
                    alert("Giriş işlemi sırasında bir hata oluştu.");
                }
                break;
            case "admin":
                try {
                    // Use Student.getById to fetch the student data
                    const admin = await Admin.getByUsername(username);  // This uses the static method from Student.js
        
                    if (admin) {
                        localStorage.setItem('role', 'admin'); // Rolü kaydet
                        localStorage.setItem('userId', admin.id); // ID'yi kaydet
                        navigate(`/admin/mainPage/${admin.id}`);
                    } else {
                        // Handle case where student is not found or an error occurred
                        alert("Yönetici bilgileri bulunamadı.");
                    }
                    
                } catch (error) {
                    console.error("Login error:", error);
                    alert("Giriş işlemi sırasında bir hata oluştu.");
                }
                break;
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
                <Link to={`/register/${role}`} className="text-blue-500 underline">
                    Kayıt Ol
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "./config";

function LoginPage() {
    const { id } = useParams(); // Get login role from URL
    const [username, setUsername] = useState("");

    // Türkçe çeviri için bir nesne oluşturuyoruz
    const roleNames = {
        student: "Öğrenci",
        teacher: "Öğretmen",
        admin: "Koç",
    };

    const role = roleNames[id] || "Bilinmeyen Rol"; // Geçerli rol varsa al, yoksa default yaz

    const handleLogin = async () => {
        try {
            // Send username to the backend for authentication
            // FIX: not id but username should be sent
            const response = await axios.get(`${config.backendUrl}students/getbyid`, {
                params: {
                    id: 0 // Replace 0 with the actual student ID
                }
            });

            if (response.status === 200) {
                alert(`${role} olarak giriş başarılı`);
                // Optionally save the authentication token (e.g., JWT)
                // localStorage.setItem("authToken", response.data.token);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Giriş işlemi sırasında bir hata oluştu.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>{role} olarak giriş yap</h2>
            <input 
                type="text" 
                placeholder="Kullanıcı adınızı girin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleLogin}>Giriş Yap</button>
        </div>
    );
}

export default LoginPage;

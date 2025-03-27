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

    // FIX: needs username
    const handleLogin = async () => {
        try {
            const response = await axios.get(`${config.backendUrl}students/getbyid`, {
                params: {
                    id: username,
                }
            });
    
            if (response.status === 200) {
                // Check if the response body is empty
                if (Object.keys(response.data).length === 0) {
                    alert("Başarılı giriş, ancak öğrenci verisi boş.");
                } else {
                    // setStudent(response.data); // Save student data to state
                    alert(`${role} olarak giriş başarılı`);
                }
            } else {
                // If response status is not 200
                alert("Giriş işlemi sırasında bir hata oluştu.");
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

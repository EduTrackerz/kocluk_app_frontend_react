import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Student from "../entities/Student";

function RegisterStudent() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const newStudent = await Student.register({ username, name });
            if (newStudent && newStudent.id) {
                alert("Kayıt başarılı!");
                navigate(`/mainPage/student/${newStudent.id}`);
            } else {
                alert("Kayıt sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Kayıt sırasında bir hata oluştu.");
        }
    };

    return (
        // <div className="text-center mt-20">
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2 className="text-2xl font-bold mb-4">Öğrenci Kayıt</h2>
            <input
                className="border rounded px-3 py-2 mb-2"
                type="text"
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
            /><br/>
            <input
                className="border rounded px-3 py-2 mb-2"
                type="text"
                placeholder="Kullanıcı adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br/>
            <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleRegister}
            >
                Kaydol
            </button>
        </div>
    );
}

export default RegisterStudent;

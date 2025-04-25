import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Admin from "../entities/Admin";

function RegisterAdmin() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const newAdmin = await Admin.register({ username, name });
            if (newAdmin && newAdmin.id) {
                alert("Kayıt başarılı!");
                navigate(`/admin/mainPage/${newAdmin.id}`);
            } else {
                alert("Kayıt sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Kayıt sırasında bir hata oluştu.");
        }
    };

    return (
        <div className="text-center mt-20">
            <h2 className="text-2xl font-bold mb-4">Yönetici Kayıt</h2>
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

export default RegisterAdmin;

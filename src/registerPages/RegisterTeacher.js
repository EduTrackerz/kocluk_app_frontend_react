import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Teacher from "../entities/Teacher";

const branches = [
    "TURKCE",
    "MATEMATIK",
    "INKILAP_TARIHI",
    "DIN_KULTURU_VE_AHLAK_BILGISI",
    "FEN_BILIMLERI",
    "INGILIZCE"
];

function RegisterTeacher() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [branch, setBranch] = useState(branches[0]); // default: TURKCE
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const newTeacher = await Teacher.register({ username, name, branch });
            if (newTeacher && newTeacher.id) {
                alert("Kayıt başarılı!");
                navigate(`/mainpage/teacher/${newTeacher.id}`);
            } else {
                alert("Kayıt sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Kayıt sırasında bir hata oluştu.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2 className="text-2xl font-bold mb-4">Öğretmen Kayıt</h2>

            <input
                className="border rounded px-3 py-2 mb-2"
                type="text"
                placeholder="Adınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
            /><br />

            <input
                className="border rounded px-3 py-2 mb-2"
                type="text"
                placeholder="Kullanıcı adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /><br />

            <select
                className="border rounded px-3 py-2 mb-4"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
            >
                {branches.map((b) => (
                    <option key={b} value={b}>
                        {b.replaceAll("_", " ")}
                    </option>
                ))}
            </select><br />

            <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleRegister}
            >
                Kaydol
            </button>
        </div>
    );
}

export default RegisterTeacher;

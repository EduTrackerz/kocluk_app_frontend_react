import React, { useState, useEffect } from 'react';
import config from './config';

const AssignExamToStudent = ({ examId }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [success, setSuccess] = useState(false); // Başarı durumunu takip etmek için state

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/api/students`);
                if (!response.ok) throw new Error("Öğrenci listesi yüklenemedi");
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Öğrenci listesi hatası:", error);
            }
        };

        fetchStudents();
    }, []);

    const handleAssign = async () => {
        if (selectedStudents.length === 0) {
            alert("Lütfen en az bir öğrenci seçin.");
            return;
        }

        try {
            const response = await fetch(`${config.backendUrl}/api/exams/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ examId, studentIds: selectedStudents })
            });

            if (!response.ok) throw new Error("Sınav atama başarısız");
            setStatusMessage("✅ Sınav başarıyla atandı!");
            setSuccess(true); // Başarı durumunu güncelle
        } catch (error) {
            console.error("Sınav atama hatası:", error);
            setStatusMessage("❌ Sınav atama başarısız.");
            setSuccess(false); // Başarısız durumunu güncelle
        }
    };

    const handleStudentSelection = (studentId) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    return (
        <div className="assign-exam">
            <h3>👩‍🎓 Öğrencilere Sınav Ata</h3>
            <ul className="student-list">
                {students.map((student) => (
                    <li key={student.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={student.id}
                                onChange={() => handleStudentSelection(student.id)}
                            />
                            {student.name} ({student.username})
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleAssign} className="assign-button">
                Ata
            </button>
            {statusMessage && (
                <p
                    style={{
                        color: success ? "green" : "red",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginTop: "10px",
                        textAlign: "center",
                    }}
                >
                    {statusMessage}
                </p>
            )}
        </div>
    );
};

export default AssignExamToStudent;
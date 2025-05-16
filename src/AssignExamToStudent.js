import React, { useState, useEffect } from 'react';

// Mock veriler
const mockStudents = [
    { id: "student1", name: "Ali Veli", username: "aliv" },
    { id: "student2", name: "Fatma Çelik", username: "fatmac" },
    { id: "student3", name: "Canan Öz", username: "canano" },
];

const mockExams = [
    { id: "exam1", name: "Matematik Sınavı", username: "math101" },
    { id: "exam2", name: "Fizik Sınavı", username: "physics101" },
    { id: "exam3", name: "Kimya Sınavı", username: "chemistry101" },
];

const AssignExamToStudent = () => {
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Mock verileri yükle
        setStudents(mockStudents);
        setExams(mockExams);
    }, []);

    const handleAssign = () => {
        if (selectedStudents.length === 0) {
            alert("Lütfen en az bir öğrenci seçin.");
            return;
        }

        if (!selectedExam) {
            alert("Lütfen bir sınav seçin.");
            return;
        }

        // Mock atama işlemi
        setStatusMessage("✅ Sınav başarıyla atandı!");
        setSuccess(true);
    };

    return (
        <div className="assign-exam">
            <h3>👩‍🎓 Öğrencilere Sınav Ata</h3>
            
            {/* Öğrenci Listesi */}
            <h3>Öğrenciler</h3>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <label>
                            <input
                                type="radio"
                                name="student"
                                value={student.id}
                                onChange={() => setSelectedStudents([student.id])}
                            />
                            {student.name} ({student.username})
                        </label>
                    </li>
                ))}
            </ul>

            {/* Sınav Seçimi */}
            <h3>Sınavlar</h3>
            <ul>
                {exams.map((exam) => (
                    <li key={exam.id}>
                        <label>
                            <input
                                type="radio"
                                name="exam"
                                value={exam.id}
                                onChange={() => setSelectedExam(exam.id)}
                            />
                            {exam.name} ({exam.username})
                        </label>
                    </li>
                ))}
            </ul>

            {/* Atama Butonu */}
            <button onClick={handleAssign} className="assign-button">
                Ata
            </button>

            {/* Durum Mesajı */}
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

            {/* Atama Sonrası Listeleme */}
            {success && (
                <div className="assigned-info">
                    <h3>Atanan Öğrenciler</h3>
                    <ul>
                        {selectedStudents.map((studentId) => {
                            const student = students.find((s) => s.id === studentId);
                            return (
                                <li key={studentId}>
                                    {student?.name} ({student?.username})
                                </li>
                            );
                        })}
                    </ul>

                    <h3>Atanan Sınav</h3>
                    <p>
                        {exams.find((exam) => exam.id === selectedExam)?.name}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AssignExamToStudent;
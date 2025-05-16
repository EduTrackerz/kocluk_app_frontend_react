import React, { useState, useEffect } from 'react';
import config from './config';

const AssignExamToStudent = ({ teacherId }) => {
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [success, setSuccess] = useState(false);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Öğrenci listesini getir
                const studentResponse = await fetch(`${config.backendUrl}/teachers/${teacherId}/students`);
                if (!studentResponse.ok) throw new Error("Öğrenci listesi yüklenemedi");
                const studentData = await studentResponse.json();
                setStudents(studentData);

                // Sınav listesini getir
                const examResponse = await fetch(`${config.backendUrl}/api/exams/all`);
                if (!examResponse.ok) throw new Error("Sınav listesi yüklenemedi");
                const examData = await examResponse.json();
                setExams(examData);
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
            }
        };

        fetchData();
    }, [teacherId]);

    const handleAssign = async () => {
        if (selectedStudents.length === 0) {
            alert("Lütfen en az bir öğrenci seçin.");
            return;
        }

        if (!selectedExam) {
            alert("Lütfen bir sınav seçin.");
            return;
        }

        try {
            // const response = await fetch(`${config.backendUrl}/teacher/assign-exam?studentIds=${selectedStudents}&examId=${selectedExam}`, {
            const response = await fetch(`${config.backendUrl}/teachers/${teacherId}/assign-exam?studentIdList=${selectedStudents}&examId=${selectedExam}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error("Sınav atama başarısız");
            setStatusMessage("✅ Sınav başarıyla atandı!");
            setSuccess(true);
        } catch (error) {
            console.error("Sınav atama hatası:", error);
            setStatusMessage("❌ Sınav atama başarısız.");
            setSuccess(false);
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
            
            {/* Öğrenci Listesi */}
            <h3>Öğrenciler</h3>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <label>
                            <input
                                type="radio" // Radio input kullanılıyor
                                name="student" // Aynı grupta yalnızca bir seçim yapılabilir
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
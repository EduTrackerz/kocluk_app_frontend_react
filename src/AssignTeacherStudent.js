import React, { useEffect, useState } from 'react';
import config from './config';

const AssignTeacherStudent = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/teachers/getall`);
                if (!response.ok) throw new Error("Öğretmen listesi yüklenemedi");
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error("Öğretmen listesi hatası:", error);
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/students/getall`);
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
        if (!selectedTeacher || !selectedStudent) {
            alert("Lütfen bir öğretmen ve bir öğrenci seçin.");
            return;
        }

        try {
            const response = await fetch(
                `${config.backendUrl}/admins/assign-student-to-teacher?studentId=${selectedStudent}&teacherId=${selectedTeacher}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage =
                    response.status === 409
                        ? errorData.message || "Bu öğrenci zaten bu öğretmene atanmış."
                        : errorData.message || "Atama işlemi başarısız.";
                throw new Error(errorMessage);
            }

            setStatusMessage("✅ Öğrenci atama işlemi başarıyla tamamlandı!");
        } catch (error) {
            setStatusMessage("❌ " + error.message);
        }
    };

    return (
        <div className="assign-teacher-student">
            <h2>👩‍🏫 Öğretmen-Öğrenci Atama</h2>

            <h3>Öğretmenler</h3>
            <ul>
                {teachers.map((teacher) => (
                    <li key={teacher.id}>
                        <label>
                            <input
                                type="radio"
                                name="teacher"
                                value={teacher.id}
                                onChange={() => setSelectedTeacher(teacher.id)}
                            />
                            {teacher.name} ({teacher.username})
                        </label>
                    </li>
                ))}
            </ul>

            <h3>Öğrenciler</h3>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <label>
                            <input
                                type="radio"
                                name="student"
                                value={student.id}
                                onChange={() => setSelectedStudent(student.id)}
                            />
                            {student.name} ({student.username})
                        </label>
                    </li>
                ))}
            </ul>

            <button onClick={handleAssign} className="assign-button">
                Atama Yap
            </button>

            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AssignTeacherStudent;

import React, { useEffect, useState } from 'react';
import config from './config';

const mockTeachers = [
    { id: "teacher1", name: "Ahmet Yılmaz", username: "ahmety" },
    { id: "teacher2", name: "Ayşe Demir", username: "aysed" },
    { id: "teacher3", name: "Mehmet Kaya", username: "mehmetk" },
];

const mockStudents = [
    { id: "student1", name: "Ali Veli", username: "aliv" },
    { id: "student2", name: "Fatma Çelik", username: "fatmac" },
    { id: "student3", name: "Canan Öz", username: "canano" },
];

const AssignTeacherStudent = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    // Öğretmenleri getir
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/api/teachers`);
                if (!response.ok) throw new Error("Öğretmen listesi yüklenemedi");
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error("Öğretmen listesi hatası:", error);
            }
        };

        fetchTeachers();
    }, []);

    // Öğrencileri getir
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

    // Atama işlemi
    const handleAssign = async () => {
        if (!selectedTeacher) {
            alert("Lütfen bir öğretmen seçin.");
            return;
        }

        if (selectedStudents.length === 0) {
            alert("Lütfen en az bir öğrenci seçin.");
            return;
        }

        try {
            const response = await fetch(`${config.backendUrl}/api/assign-teacher-student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId: selectedTeacher,
                    studentIds: selectedStudents,
                }),
            });

            if (!response.ok) throw new Error("Atama işlemi başarısız");
            setStatusMessage("✅ Öğrenci atama işlemi başarıyla tamamlandı!");
        } catch (error) {
            console.error("Atama hatası:", error);
            setStatusMessage("❌ Öğrenci atama işlemi başarısız.");
        }
    };

    return (
        <div className="assign-teacher-student">
            <h2>👩‍🏫 Öğretmen-Öğrenci Atama</h2>

            {/* Öğretmen Listesi */}
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

            {/* Öğrenci Listesi */}
            <h3>Öğrenciler</h3>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <label>
                            <input
                                type="checkbox"
                                value={student.id}
                                onChange={(e) => {
                                    const studentId = e.target.value;
                                    setSelectedStudents((prev) =>
                                        prev.includes(studentId)
                                            ? prev.filter((id) => id !== studentId)
                                            : [...prev, studentId]
                                    );
                                }}
                            />
                            {student.name} ({student.username})
                        </label>
                    </li>
                ))}
            </ul>

            {/* Atama Butonu */}
            <button onClick={handleAssign} className="assign-button">
                Atama Yap
            </button>

            {/* Durum Mesajı */}
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default AssignTeacherStudent;
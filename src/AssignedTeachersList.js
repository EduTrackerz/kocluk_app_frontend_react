// src/AssignedTeachersList.js
import React, { useEffect, useState } from 'react';
import config from './config';

const AssignedTeachersList = ({ studentId }) => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/students/${studentId}/teachers`);
                if (!response.ok) throw new Error("Öğretmen bilgileri getirilemedi");
                const data = await response.json();
                setTeachers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [studentId]);

    if (loading) return <p>⏳ Yükleniyor...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

    return (
        <div>
            <h3>👨‍🏫 Atanan Öğretmenler</h3>
            {teachers.length === 0 ? (
                <p>Bu öğrenciye henüz öğretmen atanmadı.</p>
            ) : (
                <ul>
                    {teachers.map((teacher) => (
                        <li key={teacher.id}>
                            {teacher.name} ({teacher.username})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AssignedTeachersList;

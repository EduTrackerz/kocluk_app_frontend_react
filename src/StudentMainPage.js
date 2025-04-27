// StudentMainPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Exam from './entities/Exam';

function StudentMainPage() {
    const { id } = useParams();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await Exam.getAllExams();
                setExams(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExams();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="student-container">
            <h2>Katılabileceğin Sınavlar</h2>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : (
                <div className="exam-list">
                    {exams.map(exam => (
                        <div key={exam.id} className="exam-card">
                            <h3>{exam.name}</h3>
                            <p>Tarih: {new Date(exam.examDate).toLocaleString()}</p>
                            <button className="join-button">Sınava Katıl</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentMainPage;
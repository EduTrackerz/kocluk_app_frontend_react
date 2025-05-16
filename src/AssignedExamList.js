import React, { useEffect, useState } from 'react';
import config from './config';

const MOCK_MODE = false;

const EnterableExamList = ({ studentId }) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssignedExams = async () => {
        try {
            const response = await fetch(`${config.backendUrl}/students/${studentId}/assigned-exams`);
            if (!response.ok) throw new Error("Atanan sınavlar yüklenemedi");

            const data = await response.json();
            setExams(data);
        } catch (error) {
            console.error("Atanan sınavları alma hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedExams();
    }, [studentId]);

    return (
        <div className="enterable-exam-list">
            <h2>📋 Atanan Sınavlar</h2>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : exams.length === 0 ? (
                <p>🎉 Size atanmış sınav bulunmamaktadır.</p>
            ) : (
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Sınav Adı</th>
                            <th>Tarih</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={exam.id}>
                                <td>{exam.name}</td>
                                <td>{new Date(exam.examDate).toLocaleString("tr-TR")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EnterableExamList;

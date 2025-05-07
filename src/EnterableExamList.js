import React, { useEffect, useState } from 'react';
import ExamResultForm from './ExamResultForm';
import config from './config';

const MOCK_MODE = true;

const EnterableExamList = ({ studentId }) => {
    const [exams, setExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEnterableExams = async () => {
        try {
            if (MOCK_MODE) {
                const mockExams = [
                    {
                        id: 2,
                        name: "Mayıs Ayı Denemesi",
                        examDate: "2025-05-07T10:00:00",
                        turkceCount: 40,
                        matematikCount: 40,
                        fenCount: 20,
                        sosyalCount: 20,
                        dinCount: 10,
                        yabanciCount: 10
                    }
                ];
                setExams(mockExams);
            } else {
                const response = await fetch(`${config.backendUrl}/api/exams/enterable/${studentId}`);
                if (!response.ok) throw new Error("Sınavlar yüklenemedi");

                const data = await response.json();
                setExams(data);
            }
        } catch (error) {
            console.error("Sınavları alma hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnterableExams();
    }, [studentId]);

    if (selectedExam) {
        return (
            <ExamResultForm
                exam={selectedExam}
                studentId={studentId}
                onBack={() => {
                    setSelectedExam(null);
                    fetchEnterableExams(); // Listeyi güncelle
                }}
            />
        );
    }

    return (
        <div className="enterable-exam-list">
            <h2>📝 Katılabileceğiniz Sınavlar</h2>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : exams.length === 0 ? (
                <p>🎉 Girebileceğiniz sınav bulunmamaktadır.</p>
            ) : (
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Sınav Adı</th>
                            <th>Tarih</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => {
                            const isPastExam = new Date(exam.examDate) < new Date();
                            return (
                                <tr key={exam.id}>
                                    <td>{exam.name}</td>
                                    <td>{new Date(exam.examDate).toLocaleString("tr-TR")}</td>
                                    <td>
                                        {isPastExam ? (
                                            <button onClick={() => setSelectedExam(exam)}>
                                                Sınava Gir
                                            </button>
                                        ) : (
                                            <span>Henüz zamanı gelmedi</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EnterableExamList;

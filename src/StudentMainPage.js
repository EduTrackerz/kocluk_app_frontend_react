// StudentMainPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Exam from './entities/Exam';

function StudentMainPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthAndLoadExams = async () => {
            try {
                const role = localStorage.getItem('role');

                // Sadece student veya admin rolüne izin ver
                if (role !== 'student' && role !== 'admin') {
                    navigate('/login');
                    return;
                }

                const examsData = await Exam.getAllExams();
                setExams(examsData);
            } catch (err) {
                console.error('Hata:', err);
                setError(err.message);

                // 401 Unauthorized hatası durumunda login sayfasına yönlendir
                if (err.message.includes('401')) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndLoadExams();
    }, [id, navigate]);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div className="error-message">Hata: {error}</div>;

    return (
        <div className="student-container">
            <h2 className="page-title">Sinavlarin</h2>

            <div className="table-container">
                {exams.length > 0 ? (
                    <table className="exam-table">
                        <thead>
                            <tr>
                                <th>Sınav Adı</th>
                                <th>Tarih & Saat</th>
                                <th>Türkçe</th>
                                <th>Matematik</th>
                                <th>Fen</th>
                                <th>Sosyal</th>
                                <th>Din K.</th>
                                <th>Yabancı Dil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map(exam => (
                                <tr key={exam.id} className="exam-row">
                                    <td className="exam-name">{exam.name}</td>
                                    <td className="exam-date">
                                        {new Date(exam.examDate).toLocaleDateString('tr-TR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="subject-count turkce">{exam.turkceCount}</td>
                                    <td className="subject-count matematik">{exam.matematikCount}</td>
                                    <td className="subject-count fen">{exam.fenCount}</td>
                                    <td className="subject-count sosyal">{exam.sosyalCount}</td>
                                    <td className="subject-count din">{exam.dinCount}</td>
                                    <td className="subject-count yabanci">{exam.yabanciCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        📭 Henüz planlanmış sınav bulunmamaktadır
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentMainPage;
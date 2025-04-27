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
            <h2>Sınav Listesi</h2>

            <div className="exam-list">
                {exams.length > 0 ? (
                    exams.map(exam => (
                        <div key={exam.id} className="exam-card">
                            <h3>{exam.name}</h3>
                            <p>Tarih: {new Date(exam.examDate).toLocaleString('tr-TR')}</p>
                            <div className="subject-counts">
                                <span>Turkce: {exam.turkceCount}</span>
                                <span>Matematik: {exam.matematikCount}</span>
                                <span>Fen Bilimleri: {exam.fenCount}</span>
                                <span>Sosyal Bilgiler: {exam.sosyalCount}</span>
                                <span>Din Kulturu: {exam.dinCount}</span>
                                <span>Yabancı Dil: {exam.yabanciCount}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Görüntülenecek sınav bulunamadı</p>
                )}
            </div>
        </div>
    );
}

export default StudentMainPage;
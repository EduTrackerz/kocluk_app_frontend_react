// AdminMainPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Exam from './entities/Exam';

const AdminMainPage = () => {
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

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <h2>Yonetici Paneli</h2>
                <Link to="/admin/main/exam-create" className="nav-link">
                    Yeni Sinav Olustur
                </Link>

                <h3 style={{ marginTop: '2rem' }}>Mevcut Sinavlar</h3>
                {loading ? (
                    <p>Yukleniyor...</p>
                ) : (
                    <div className="exam-list">
                        {exams.map(exam => (
                            <div key={exam.id} className="exam-card">
                                <h4>{exam.name}</h4>
                                <p>Tarih: {new Date(exam.examDate).toLocaleDateString()}</p>
                                <div className="subject-stats">
                                    <span>Turkce: {exam.turkceCount}</span>
                                    <span>Matematik: {exam.matematikCount}</span>
                                    <span>Fen Bilimleri: {exam.fenCount}</span>
                                    <span>Sosyal Bilgiler: {exam.sosyalCount}</span>
                                    <span>Din Kulturu: {exam.dinCount}</span>
                                    <span>Yabancý Dil: {exam.yabanciCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </nav>

            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminMainPage;
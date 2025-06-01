import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Exam from './entities/Exam';
import CreateExamForm from './CreateExamForm';

const AdminMainPage = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        loadExams();
    }, []);

    const handleExamAdded = (newExam) => {
        setExams(prevExams =>
            [...prevExams, newExam].sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
        );
        //setShowForm(false);
    };

    return (
        <div className="admin-container">
            <nav className="admin-nav">
                <div className="admin-header">
                    <h2 className="admin-title">📊 Yönetim Paneli</h2>
                    <p className="admin-subtitle">Toplam Sınav: {exams.length}</p>
                </div>

                <button
                    className="nav-link"
                    onClick={() => setShowForm(!showForm)}
                    style={{ marginBottom: '1rem' }}
                >
                    {showForm ? 'Formu Kapat' : 'Yeni Sınav Oluştur'}
                </button>

                {showForm && (
                    <div className="form-container">
                        <CreateExamForm
                            onExamAdded={handleExamAdded}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}

                <h3 className="section-title">📅 Mevcut Sınavlar</h3>

                {loading ? (
                    <div className="loading-spinner">⏳ Yükleniyor...</div>
                ) : (
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
                )}

                <button
                    className="assign-button"
                    onClick={() => navigate('/assign-teacher-student')}
                    style={{
                        margin: '20px 0',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Öğretmen-Öğrenci Ataması Yap
                </button>
            </nav>
        </div>
    );
};

export default AdminMainPage;

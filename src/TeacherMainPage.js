import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssignExamToStudent from './AssignExamToStudent';

function TeacherMainPage() {
    const navigate = useNavigate(); // Yönlendirme fonksiyonu
    const { id: teacherId } = useParams();

    return (
        <div className="teacher-container">
            {/* Öğrenciye Sınav Atama Butonu */}
            <button
                className="assign-button"
                onClick={() => navigate('/assign-exam-to-student')}
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
                Öğrenciye Sınav Ataması Yap
            </button>

            <AssignExamToStudent teacherId={teacherId} />
        </div>
    );
}

export default TeacherMainPage;
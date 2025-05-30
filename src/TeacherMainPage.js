import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssignExamToStudent from './AssignExamToStudent';
import AssignedStudentsList from './AssignedStudentsList';
import AssignGoalToStudent from './AssignGoalToStudent';
import config from './config';

function TeacherMainPage() {
    const navigate = useNavigate();
    const { id: teacherId } = useParams();
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [showAssignedStudents, setShowAssignedStudents] = useState(false);
    const [showAssignExam, setShowAssignExam] = useState(false);
    const [showAssignGoal, setShowAssignGoal] = useState(false);
    
    useEffect(() => {
        const fetchAssignedStudents = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/teachers/${teacherId}/students`);
                if (!response.ok) throw new Error("Atanan öğrenciler yüklenemedi");
                const data = await response.json();
                setAssignedStudents(data);
            } catch (error) {
                console.error("Atanan öğrenciler hatası:", error);
            }
        };

        if (showAssignedStudents) {
            fetchAssignedStudents();
        }
    }, [teacherId, showAssignedStudents]);

    return (
        <div className="teacher-container">
            {/* Öğrenciye Sınav Atama Butonu */}
            <button
                className="assign-button"
                onClick={() => setShowAssignExam(!showAssignExam)}
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
                {showAssignExam ? "Sınav Atamasını Gizle" : "Öğrenciye Sınav Ataması Yap"}
            </button>

            {/* Atama Bileşeni */}
            {showAssignExam && <AssignExamToStudent teacherId={teacherId} />}

            {/* Atanan Öğrencileri Gör Butonu */}
            <button
                className="view-assigned-students-button"
                onClick={() => setShowAssignedStudents(!showAssignedStudents)}
                style={{
                    margin: '20px 0',
                    padding: '10px 20px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {showAssignedStudents ? "Atanan Öğrencileri Gizle" : "Atanan Öğrencileri Gör"}
            </button>

            {/* Atanan Öğrenciler Listesi */}
            {showAssignedStudents && <AssignedStudentsList assignedStudents={assignedStudents} />}

            {/* Hedef Atama Butonu */}
            <button
                onClick={() => setShowAssignGoal(!showAssignGoal)}
                style={{
                    margin: '20px 0',
                    padding: '10px 20px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {showAssignGoal ? "Hedef Atamasını Gizle" : "Öğrenciye Hedef Ata"}
            </button>

            {/* Hedef Atama Formu */}
            {showAssignGoal && <AssignGoalToStudent teacherId={teacherId} />}
        </div>
    );
}

export default TeacherMainPage;

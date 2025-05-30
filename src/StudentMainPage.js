import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EnterableExamList from './EnterableExamList';
import AssignedExamList from './AssignedExamList';
import PastExamResults from './PastExamResults';
import StudentStatisticsPage from './StudentStatisticsPage';
import AssignedGoalsList from './AssignedGoalsList';
import './App.css';
import AssignedTeachersList from './AssignedTeachersList';

function StudentMainPage() {
    const { id: studentId } = useParams();
    const [activeTab, setActiveTab] = useState("assigned");

    return (
        <div className="page-wrapper slide-fade-in">
            <h2 className="page-title">📚 Öğrenci Paneli</h2>

            <div className="tab-buttons">
                <button
                    className={activeTab === "enterable" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("enterable")}
                >
                    Sınava Gir
                </button>
                <button
                    className={activeTab === "assigned" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("assigned")}
                >
                    Atanan Sınavlar
                </button>
                <button
                    className={activeTab === "past" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("past")}
                >
                    Geçmiş Sonuçlar
                </button>
                <button
                    className={activeTab === "analysis" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("analysis")}
                >
                    İstatistik (Yakında)
                </button>

                <button
                    className={activeTab === "teachers" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("teachers")}
                >
                    Atanan Öğretmenler
                </button>

                <button
                    className={activeTab === "goals" ? "tab-button active-tab" : "tab-button"}
                    onClick={() => setActiveTab("goals")}
                >
                    Hedeflerim
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "enterable" && <EnterableExamList studentId={studentId} />}
                {activeTab === "past" && <PastExamResults studentId={studentId} />}
                {activeTab === "analysis" && (
                    // <p>📊 Gelişim grafikleri ve takvimli görünüm yakında burada olacak.</p>
                    <StudentStatisticsPage studentId={studentId} />
                )}
                
                {activeTab === "teachers" && <AssignedTeachersList studentId={studentId} />}
                {activeTab === "assigned" && <AssignedExamList studentId={studentId} />}
                {activeTab === "goals" && <AssignedGoalsList studentId={studentId} />}
            </div>
        </div>
    );
}

export default StudentMainPage;

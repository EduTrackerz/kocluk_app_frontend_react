import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EnterableExamList from './EnterableExamList';
import PastExamResults from './PastExamResults';
import './App.css';

function StudentMainPage() {
    const { id: studentId } = useParams();
    const [activeTab, setActiveTab] = useState("enterable");

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
            </div>

            <div className="tab-content">
                {activeTab === "enterable" && <EnterableExamList studentId={studentId} />}
                {activeTab === "past" && <PastExamResults studentId={studentId} />}
                {activeTab === "analysis" && (
                    <p>📊 Gelişim grafikleri ve takvimli görünüm yakında burada olacak.</p>
                )}
            </div>
        </div>
    );
}

export default StudentMainPage;

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EnterableExamList from './EnterableExamList';
import './App.css';

function StudentMainPage() {
    const { id: studentId } = useParams();
    const [activeTab, setActiveTab] = useState("assigned");

    return (
        <div className="page-wrapper">
            <h2 className="page-title">📚 Öğrenci Paneli</h2>

            <div className="tab-buttons">
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
            </div>

            <div className="tab-content">
                {activeTab === "assigned" && <EnterableExamList studentId={studentId} />}
                {activeTab === "past" && <p>📊 Geçmiş sınav sonuçlarınız burada görünecek.</p>}
            </div>
        </div>
    );
}

export default StudentMainPage;

import React, { useEffect, useState } from 'react';
import config from './config';

function AssignedGoalsList({ studentId }) {
    const [goals, setGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await fetch(`${config.backendUrl}/api/goals/student/${studentId}`);

                if (!res.ok) {
                    // Print error text for debugging
                    const errorText = await res.text();
                    console.error("Backend Hatası:", res.status, errorText);
                    return;
                }

                const data = await res.json();

                setGoals(Array.isArray(data) ? data : []);

                setGoals(data);
            } catch (err) {
                console.error("Hedefler alınırken hata:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, [studentId]);

    const handleComplete = async (goalId) => {
        try {
            const res = await fetch(`${config.backendUrl}/api/goals/${goalId}/complete`, {
                method: "POST"
            });

            if (res.ok) {
                setCompletedGoals(new Set([...completedGoals, goalId]));
            } else {
                console.error("Tamamlama isteği başarısız.");
            }
        } catch (err) {
            console.error("Hedef tamamlama hatası:", err);
        }
    };


    return (
        <div>
            <h3>🎯 Atanan Hedefler</h3>
            <ul>
                {
                    loading ? (
                        <p>Yükleniyor...</p>
                    ) : !Array.isArray(goals) ? (
                        <p>❌ Hedefler yüklenirken bir hata oluştu.</p>
                    ) : goals.length === 0 ? (
                        <p>🎉 Tanımlanmış hedefiniz bulunmamaktadır.</p>
                    ) : (
                        goals.map((goal) => (
                        <li key={goal.id} style={{ marginBottom: "10px" }}>
                            <strong>Ders:</strong> {goal.subjectName} | 
                            <strong> Soru:</strong> {goal.questionCount} |
                            <strong> Süre:</strong> {new Date(goal.deadline).toLocaleDateString()} |
                            <strong> Öğretmen:</strong> {goal.teacherName}
                            <br />
                            {completedGoals.has(goal.id) ? (
                                <span style={{ color: "green" }}>✅ Tamamlandı</span>
                            ) : (
                                <button
                                    style={{ marginTop: "5px" }}
                                    onClick={() => handleComplete(goal.id)}
                                >
                                    Hedefi Tamamla
                                </button>
                            )}
                        </li>
                    ))
                    )
                }
            </ul>
        </div>
    );
}

export default AssignedGoalsList;

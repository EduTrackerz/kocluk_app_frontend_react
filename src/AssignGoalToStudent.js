import React, { useState, useEffect } from 'react';
import config from './config';

function AssignGoalToStudent({ teacherId }) {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [goals, setGoals] = useState([
        { subjectId: '', questionCount: '', deadline: '' }
    ]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentRes = await fetch(`${config.backendUrl}/teachers/${teacherId}/students`);
                const subjectRes = await fetch(`${config.backendUrl}/subjects/all`);

                const studentData = await studentRes.json();
                const subjectData = await subjectRes.json();

                console.log("Subject API response:", subjectData);

                setStudents(studentData);
                setSubjects(subjectData);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchData();
    }, [teacherId]);

    const handleGoalChange = (index, field, value) => {
        const updatedGoals = [...goals];
        updatedGoals[index][field] = value;
        setGoals(updatedGoals);
    };

    const addGoalField = () => {
        setGoals([...goals, { subjectId: '', questionCount: '', deadline: '' }]);
    };

    const removeGoalField = (index) => {
        const updatedGoals = [...goals];
        updatedGoals.splice(index, 1);
        setGoals(updatedGoals);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedGoals = goals.map(g => ({
            subjectId: parseInt(g.subjectId),
            questionCount: parseInt(g.questionCount),
            deadline: `${g.deadline}T23:59:59`
        }));

        const payload = {
            teacherId: parseInt(teacherId),
            studentId: parseInt(selectedStudentId),
            goals: formattedGoals
        };

        try {
            const response = await fetch(`${config.backendUrl}/api/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error("Gönderim hatası:", error);
            setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
            <h3>Öğrenciye Hedef Ata</h3>
            <form onSubmit={handleSubmit}>
                <label>Öğrenci:
                    <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} required>
                        <option value="">Seçiniz</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </label>

                {goals.map((goal, index) => (
                    <div key={index} style={{ border: '1px dashed #ccc', padding: '10px', marginTop: '10px' }}>
                        <label>Ders:
                            <select
                                value={goal.subjectId}
                                onChange={e => handleGoalChange(index, 'subjectId', e.target.value)}
                                required
                            >
                                <option value="">Seçiniz</option>
                                {Array.isArray(subjects) && subjects.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <label>Soru Sayısı:
                            <input
                                type="number"
                                value={goal.questionCount}
                                onChange={e => handleGoalChange(index, 'questionCount', e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        <label>Tarih:
                            <input
                                type="date"
                                value={goal.deadline}
                                onChange={e => handleGoalChange(index, 'deadline', e.target.value)}
                                required
                            />
                        </label>
                        <br />
                        {goals.length > 1 && (
                            <button type="button" onClick={() => removeGoalField(index)}>Bu Hedefi Sil</button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addGoalField}>Yeni Hedef Ekle</button>
                <br /><br />
                <button type="submit">Hedefleri Gönder</button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
}

export default AssignGoalToStudent;

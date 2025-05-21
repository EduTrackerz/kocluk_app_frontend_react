import React, { useState, useEffect } from 'react';
import './TopicResultForm.css';
import config from './config';

const TopicResultForm = ({ subjectName, subjectKey, lessonId, max, onSubmit, onCancel }) => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/subjects/${lessonId}/topics`);
                if (!response.ok) throw new Error("Sunucu hatası");
                const data = await response.json();

                const initialData = data.map(t => ({
                    topicId: t.id,
                    topicName: t.name,
                    correct: 0,
                    wrong: 0
                }));

                setTopics(initialData);
            } catch (error) {
                console.error("Konu listesi alınamadı:", error);
                setTopics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [lessonId]);

    const handleChange = (index, field, value) => {
        const numeric = Math.max(0, parseInt(value) || 0);
        setTopics(prev => {
            const updated = [...prev];
            updated[index][field] = numeric;
            return updated;
        });
    };

    const totalCorrect = topics.reduce((acc, t) => acc + t.correct, 0);
    const totalWrong = topics.reduce((acc, t) => acc + t.wrong, 0);
    const totalBlank = Math.max(0, max - (totalCorrect + totalWrong));

    const handleSubmit = () => {
        const topicPayloads = topics.map(t => ({
            topicId: String(t.topicId),
            correctAnswers: t.correct,
            incorrectAnswers: t.wrong,
            blankAnswers: Math.max(0, max - (t.correct + t.wrong))
        }));

        onSubmit({
            subjectKey,
            correct: totalCorrect,
            wrong: totalWrong,
            empty: totalBlank,
            topics: topicPayloads
        });
    };

    if (loading) return <p>Konular yükleniyor...</p>;

    return (
        <div className="topic-result-form form-container">
            <h3>{subjectName} Konu Bazlı Sonuç Girişi</h3>
            <table className="exam-table">
                <thead>
                    <tr>
                        <th>Konu</th>
                        <th>Doğru</th>
                        <th>Yanlış</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((topic, index) => (
                        <tr key={topic.topicId}>
                            <td>{topic.topicName}</td>
                            <td>
                                <input
                                    type="number"
                                    value={topic.correct}
                                    onChange={(e) => handleChange(index, 'correct', e.target.value)}
                                    min="0"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={topic.wrong}
                                    onChange={(e) => handleChange(index, 'wrong', e.target.value)}
                                    min="0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "1rem" }}>
                <p><b>Toplam:</b> {totalCorrect} Doğru, {totalWrong} Yanlış, {totalBlank} Boş</p>
            </div>

            <div className="form-actions">
                <button onClick={handleSubmit}>Kaydet</button>
                <button className="cancel-button" onClick={onCancel}>İptal</button>
            </div>
        </div>
    );
};

export default TopicResultForm;

import React, { useState } from 'react';
import './TopicResultForm.css';

const TopicResultForm = ({ subjectName, subjectKey, topics, max, onSubmit, onCancel }) => {
    const [topicData, setTopicData] = useState(() =>
        topics.map(topic => ({
            topicId: topic.id,
            name: topic.name,
            correct: 0,
            wrong: 0
        }))
    );

    const handleChange = (index, field, value) => {
        const numeric = Math.max(0, parseInt(value) || 0);
        const updated = [...topicData];
        updated[index][field] = numeric;
        setTopicData(updated);
    };

    const totalCorrect = topicData.reduce((acc, t) => acc + t.correct, 0);
    const totalWrong = topicData.reduce((acc, t) => acc + t.wrong, 0);
    const total = totalCorrect + totalWrong;
    const overLimit = total > max;

    const handleSubmit = () => {
        if (overLimit) return;
        onSubmit({
            subjectKey,
            correct: totalCorrect,
            wrong: totalWrong,
            topics: topicData
        });
    };

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
                    {topicData.map((topic, index) => (
                        <tr key={index}>
                            <td>{topic.name}</td>
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
                <p><b>Toplam:</b> {totalCorrect} Doğru, {totalWrong} Yanlış</p>
                {overLimit && (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                        Toplam doğru + yanlış sayısı bu derste {max} soruyu geçemez! (Şu an: {total}/{max})
                    </p>
                )}
            </div>

            <div className="form-actions">
                <button onClick={handleSubmit} disabled={overLimit}>Kaydet</button>
                <button className="cancel-button" onClick={onCancel}>İptal</button>
            </div>
        </div>
    );
};

export default TopicResultForm;

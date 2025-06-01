import React, { useState, useEffect } from 'react';
import './TopicResultForm.css';
import config from './config';

const TopicResultForm = ({ subjectName, subjectKey, lessonId, max, onSubmit, onCancel, expectedWrong, existingData }) => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/subjects/${lessonId}/topics`);
                if (!response.ok) throw new Error("Sunucu hatası");
                const data = await response.json();

                const initialData = data.map(t => {
                    const existing = existingData?.find(e => parseInt(e.topicId) === t.id);
                    return {
                        topicId: t.id,
                        topicName: t.name,
                        wrong: existing ? String(existing.incorrectAnswers) : '' // 👈 eğer daha önce girildiyse yaz
                    };
                });

                setTopics(initialData);
            } catch (error) {
                console.error("Konu listesi alınamadı:", error);
                setTopics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [lessonId, existingData]);

    const handleChange = (index, value) => {
        const numeric = Math.max(0, parseInt(value) || 0);
        setTopics(prev => {
            const updated = [...prev];
            updated[index].wrong = value;
            return updated;
        });
        setError('');
    };

    const totalWrong = topics.reduce((acc, t) => acc + (parseInt(t.wrong) || 0), 0);

    const handleSubmit = () => {
        if (totalWrong !== expectedWrong) {
            setError(`❌ Toplam yanlış sayısı uyuşmuyor. Genel giriş: ${expectedWrong}, konu konu giriş: ${totalWrong}`);
            return;
        }

        const topicPayloads = topics.map((t) => ({
            topicId: String(t.topicId),
            incorrectAnswers: parseInt(t.wrong) || 0,
        }));

        onSubmit({
            subjectKey,
            wrong: totalWrong,
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
                                    value={topic.wrong}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    min="0"
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "1rem" }}>
                <p><b>Toplam Girilen Yanlış:</b> {totalWrong} / {expectedWrong}</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            <div className="form-actions">
                <button onClick={handleSubmit}>Kaydet</button>
                <button className="cancel-button" onClick={onCancel}>İptal</button>
            </div>
        </div>
    );
};

export default TopicResultForm;

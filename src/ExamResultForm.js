import React, { useState } from 'react';
import config from './config';
import TopicResultForm from './TopicResultForm';

const MOCK_MODE = false;

const ExamResultForm = ({ exam, studentId, onBack }) => {
    const subjects = [
        { key: 'turkce', name: 'Türkçe', max: exam.turkceCount },
        { key: 'matematik', name: 'Matematik', max: exam.matematikCount },
        { key: 'fen', name: 'Fen', max: exam.fenCount },
        { key: 'sosyal', name: 'Sosyal', max: exam.sosyalCount },
        { key: 'din', name: 'Din Kültürü', max: exam.dinCount },
        { key: 'yabanci', name: 'Yabancı Dil', max: exam.yabanciCount }
    ];

    const [formData, setFormData] = useState(() =>
        Object.fromEntries(subjects.flatMap(({ key }) => [
            [`${key}Correct`, 0],
            [`${key}Wrong`, 0]
        ]))
    );
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topicEntrySubject, setTopicEntrySubject] = useState(null);
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [topicResults, setTopicResults] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Math.max(0, parseInt(value) || 0);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
    };

    const isInvalid = subjects.some(({ key, max }) => {
        const total = formData[`${key}Correct`] + formData[`${key}Wrong`];
        return total > max;
    });

    const getMissingTopicEntries = () => {
        return subjects
            .filter(({ key }) => {
                const total = formData[`${key}Correct`] + formData[`${key}Wrong`];
                const topicData = topicResults[key];
                return total > 0 && (!topicData || topicData.topics.length === 0);
            })
            .map(({ name }) => name);
    };

    const handleTopicSubmit = ({ subjectKey, correct, wrong, topics }) => {
        setFormData((prev) => ({
            ...prev,
            [`${subjectKey}Correct`]: correct,
            [`${subjectKey}Wrong`]: wrong
        }));

        setTopicResults((prev) => ({
            ...prev,
            [subjectKey]: { topics, correct, wrong }
        }));

        setTopicFormVisible(false);
        setTopicEntrySubject(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isInvalid) return;

        const missingSubjects = getMissingTopicEntries();
        if (missingSubjects.length > 0) {
            setStatusMessage(`❌ Konu bazlı giriş eksik: ${missingSubjects.join(', ')}`);
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: {
                studentId: parseInt(studentId),
                examId: exam.id
            },
            student: { id: parseInt(studentId) },
            exam: { id: exam.id }
        };

        subjects.forEach(({ key }) => {
            payload[`${key}Correct`] = formData[`${key}Correct`];
            payload[`${key}Wrong`] = formData[`${key}Wrong`];
        });

        try {
            if (MOCK_MODE) {
                console.log("📦 [MOCK] Payload gönderiliyor:", payload);
                console.log("📦 [MOCK] Detaylı konu sonuçları:", topicResults);
                await new Promise((res) => setTimeout(res, 1000));
                setStatusMessage("✅ Sınav sonucu ve detaylar başarıyla kaydedildi (mock).");
            } else {
                const [res1, res2] = await Promise.all([
                    fetch(`${config.backendUrl}/api/exam-results/add`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }),
                    fetch(`${config.backendUrl}/api/topic-results/add-all`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: parseInt(studentId),
                            examId: exam.id,
                            results: topicResults
                        })
                    })
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Kayıt başarısız");

                const result = await res1.json();
                setStatusMessage(result.message || "Başarıyla kaydedildi.");
            }

            setTimeout(() => {
                setStatusMessage('');
                onBack();
            }, 2000);
        } catch (error) {
            setStatusMessage("❌ Hata oluştu: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="exam-result-form fade-in">
            <h2>{exam.name} - Sonuç Girişi</h2>

            {topicFormVisible && topicEntrySubject && (
                <TopicResultForm
                    subjectKey={topicEntrySubject.key}
                    subjectName={topicEntrySubject.name}
                    topics={[
                        { name: "Konu 1" },
                        { name: "Konu 2" },
                        { name: "Konu 3" },
                        { name: "Konu 4" },
                        { name: "Konu 5" }
                    ]}
                    onSubmit={handleTopicSubmit}
                    onCancel={() => {
                        setTopicFormVisible(false);
                        setTopicEntrySubject(null);
                    }}
                />
            )}

            {!topicFormVisible && (
                <form onSubmit={handleSubmit}>
                    {subjects.map(({ key, name, max }) => {
                        const correct = formData[`${key}Correct`];
                        const wrong = formData[`${key}Wrong`];
                        const total = correct + wrong;
                        const overLimit = total > max;
                        const topicData = topicResults[key];
                        const missingTopic = total > 0 && (!topicData || topicData.topics.length === 0);

                        return (
                            <div
                                key={key}
                                className="form-row"
                                style={missingTopic ? { border: '1px solid red', borderRadius: '4px', padding: '0.5rem' } : {}}
                            >
                                <label className="form-label">{name} ({max} soru):</label>
                                <div className="input-pair">
                                    <input
                                        type="number"
                                        name={`${key}Correct`}
                                        value={correct}
                                        onChange={handleChange}
                                        min="0"
                                        className="form-input"
                                    />
                                    <span>Doğru</span>
                                    <input
                                        type="number"
                                        name={`${key}Wrong`}
                                        value={wrong}
                                        onChange={handleChange}
                                        min="0"
                                        className="form-input"
                                    />
                                    <span>Yanlış</span>
                                </div>

                                {overLimit && (
                                    <span className="total-error">
                                        Toplam {total}/{max}
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className="topic-entry-button"
                                    onClick={() => {
                                        setTopicEntrySubject({ key, name });
                                        setTopicFormVisible(true);
                                    }}
                                >
                                    Konu Bazlı Giriş
                                </button>

                                {topicData ? (
                                    <div style={{ fontSize: '0.9rem', marginLeft: '1rem', color: 'green' }}>
                                        ✅ {topicData.topics.length} konu girildi ({topicData.correct}D / {topicData.wrong}Y)
                                    </div>
                                ) : missingTopic ? (
                                    <div style={{ fontSize: '0.9rem', marginLeft: '1rem', color: 'red' }}>
                                        ⚠️ Konu detayları girilmedi
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}

                    <div className="form-actions">
                        <button type="submit" disabled={isSubmitting || isInvalid}>
                            {isSubmitting ? "Gönderiliyor..." : "Kaydet"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onBack}>
                            Geri Dön
                        </button>
                    </div>
                </form>
            )}

            {statusMessage && <p className="form-message">{statusMessage}</p>}
        </div>
    );
};

export default ExamResultForm;

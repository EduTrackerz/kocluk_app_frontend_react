import React, { useState } from 'react';
import config from './config';
import TopicResultForm from './TopicResultForm';

const MOCK_MODE = false;

const ExamResultForm = ({ exam, studentId, onBack }) => {
    const subjects = [
        { key: 'turkce', name: 'Türkçe', max: exam.turkceCount, id: 1 },
        { key: 'matematik', name: 'Matematik', max: exam.matematikCount, id: 2 },
        { key: 'fen', name: 'Fen', max: exam.fenCount, id: 3 },
        { key: 'sosyal', name: 'Sosyal', max: exam.sosyalCount, id: 4 },
        { key: 'din', name: 'Din Kültürü', max: exam.dinCount, id: 5 },
        { key: 'yabanci', name: 'Yabancı Dil', max: exam.yabanciCount, id: 6 }
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

    const handleTopicSubmit = ({ subjectKey, correct, wrong, empty, topics }) => {
        const updatedTopics = topics.map(t => ({
            topicId: String(t.topicId),
            correctAnswers: t.correctAnswers,
            incorrectAnswers: t.incorrectAnswers,
            blankAnswers: t.blankAnswers
        }));

        setFormData((prev) => ({
            ...prev,
            [`${subjectKey}Correct`]: correct,
            [`${subjectKey}Wrong`]: wrong
        }));

        setTopicResults((prev) => ({
            ...prev,
            [subjectKey]: {
                correct,
                wrong,
                empty,
                topics: updatedTopics
            }
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

        if (Object.keys(topicResults).length === 0) {
            setStatusMessage("❌ En az bir ders için konu bazlı veri girilmelidir.");
            return;
        }

        setIsSubmitting(true);

        const detailedScores = {};
        for (const { key, max } of subjects) {
            const result = topicResults[key];
            if (!result) continue;

            const topicMap = {};
            let sum = 0;

            result.topics.forEach(t => {
                topicMap[String(t.topicId)] = {
                    correctAnswers: t.correctAnswers,
                    incorrectAnswers: t.incorrectAnswers,
                    blankAnswers: t.blankAnswers
                };
                sum += t.correctAnswers + t.incorrectAnswers + t.blankAnswers;
            });

            if (sum !== max) {
                setStatusMessage(`❌ ${key} dersi için toplam cevap sayısı ${sum}, olması gereken: ${max}`);
                setIsSubmitting(false);
                return;
            }

            detailedScores[key] = topicMap;
        }

        if (Object.keys(detailedScores).length === 0) {
            setStatusMessage("❌ Gönderilecek veri bulunamadı.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (MOCK_MODE) {
                console.log("📦 MOCK POST:", detailedScores);
                await new Promise(r => setTimeout(r, 1000));
                setStatusMessage("✅ Başarıyla kaydedildi (mock).");
            } else {
                const res = await fetch(`${config.backendUrl}/api/exam-results/add?studentId=${studentId}&examId=${exam.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ detailedScores })
                });

                if (!res.ok) throw new Error(await res.text());
                setStatusMessage("✅ Başarıyla kaydedildi.");
            }

            setTimeout(() => {
                setStatusMessage('');
                onBack();
            }, 2000);
        } catch (err) {
            setStatusMessage("❌ Hata oluştu: " + err.message);
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
                    lessonId={topicEntrySubject.id}
                    max={topicEntrySubject.max}
                    onSubmit={handleTopicSubmit}
                    onCancel={() => {
                        setTopicFormVisible(false);
                        setTopicEntrySubject(null);
                    }}
                />
            )}

            {!topicFormVisible && (
                <form onSubmit={handleSubmit}>
                    {subjects.map(({ key, name, max, id }) => {
                        const correct = formData[`${key}Correct`];
                        const wrong = formData[`${key}Wrong`];
                        const total = correct + wrong;
                        const overLimit = total > max;

                        return (
                            <div key={key} className="form-row">
                                <label className="form-label">{name} ({max} soru):</label>
                                <div className="input-pair">
                                    <input type="number" name={`${key}Correct`} value={correct} onChange={handleChange} min="0" className="form-input" />
                                    <span>Doğru</span>
                                    <input type="number" name={`${key}Wrong`} value={wrong} onChange={handleChange} min="0" className="form-input" />
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
                                        setTopicEntrySubject({ key, name, id, max });
                                        setTopicFormVisible(true);
                                    }}
                                >
                                    Konu Bazlı Giriş
                                </button>
                                {topicResults[key] && (
                                    <div style={{ fontSize: '0.9rem', marginLeft: '1rem', color: 'green' }}>
                                        ✅ {topicResults[key].topics.length} konu girildi ({topicResults[key].correct}D / {topicResults[key].wrong}Y / {topicResults[key].empty}B)
                                    </div>
                                )}
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
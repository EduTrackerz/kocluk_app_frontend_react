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

    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topicEntrySubject, setTopicEntrySubject] = useState(null);
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [topicResults, setTopicResults] = useState({});

    const isInvalid = subjects.some(({ key, max }) => {
        const result = topicResults[key];
        return result && result.total > max;
    });

    const getMissingTopicEntries = () => {
        return subjects
            .filter(({ key }) => {
                const topicData = topicResults[key];
                return !topicData || topicData.topics.length === 0;
            })
            .map(({ name }) => name);
    };

    const handleTopicSubmit = ({ subjectKey, correct, wrong, empty, topics }) => {
        const totalCount = correct + wrong + empty;

        const updatedTopics = topics.map(t => ({
            topicId: String(t.topicId),
            correctAnswers: t.correctAnswers,
            incorrectAnswers: t.incorrectAnswers,
            blankAnswers: t.blankAnswers
        }));

        setTopicResults((prev) => ({
            ...prev,
            [subjectKey]: {
                correct,
                wrong,
                empty,
                total: totalCount,
                topics: updatedTopics
            }
        }));

        setTopicFormVisible(false);
        setTopicEntrySubject(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isInvalid) {
            setStatusMessage("❌ Bazı derslerde toplam cevap sayısı maksimumu aşıyor.");
            return;
        }

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
            result.topics.forEach(t => {
                topicMap[t.topicId] = {
                    correctAnswers: t.correctAnswers,
                    incorrectAnswers: t.incorrectAnswers,
                    blankAnswers: t.blankAnswers
                };
            });

            const totalCount = result.correct + result.wrong + result.empty;
            if (totalCount !== max) {
                setStatusMessage(`❌ ${key} dersi için toplam cevap sayısı ${totalCount}, olması gereken: ${max}`);
                setIsSubmitting(false);
                return;
            }

            detailedScores[key] = topicMap;
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
                        const result = topicResults[key];
                        const correct = result?.correct ?? 0;
                        const wrong = result?.wrong ?? 0;
                        const empty = result?.empty ?? 0;
                        const total = correct + wrong;
                        const overLimit = total > max;

                        return (
                            <div key={key} className="form-row">
                                <label className="form-label">{name} ({max} soru):</label>
                                <div className="input-pair">
                                    <input type="number" value={correct} readOnly className="form-input" />
                                    <span>Doğru</span>
                                    <input type="number" value={wrong} readOnly className="form-input" />
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
                                {result && (
                                    <div style={{ fontSize: '0.9rem', marginLeft: '1rem', color: 'green' }}>
                                        ✅ {result.topics.length} konu girildi ({correct}D / {wrong}Y / {empty}B)
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

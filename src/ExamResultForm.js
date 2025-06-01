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
    const [currentSubject, setCurrentSubject] = useState(null);
    const [topicFormVisible, setTopicFormVisible] = useState(false);
    const [subjectResults, setSubjectResults] = useState({});
    const [topicResults, setTopicResults] = useState({});
    const [submittedGeneral, setSubmittedGeneral] = useState(false);

    const handleGeneralSubmit = (e) => {
        e.preventDefault();

        let valid = true;
        const temp = {};

        for (const { key, max } of subjects) {
            const correct = parseInt(document.getElementById(`${key}-correct`).value || 0);
            const wrong = parseInt(document.getElementById(`${key}-wrong`).value || 0);
            const empty = parseInt(document.getElementById(`${key}-empty`).value || 0);
            const total = correct + wrong + empty;

            if (total !== max) {
                setStatusMessage(`❌ ${key} dersi için toplam soru sayısı ${total}/${max}`);
                valid = false;
                break;
            }

            temp[key] = { correct, wrong, empty };
        }

        if (valid) {
            setSubjectResults(temp);
            setSubmittedGeneral(true);
            setStatusMessage('✅ Genel sonuçlar kaydedildi. Şimdi konu bazlı yanlışları girin.');
        }
    };

    const handleTopicSubmit = ({ subjectKey, topics }) => {
        const wrongTotal = subjectResults[subjectKey].wrong;
        const topicWrongSum = topics.reduce((acc, t) => acc + t.incorrectAnswers, 0);

        if (topicWrongSum !== wrongTotal) {
            setStatusMessage(`❌ ${subjectKey} için girilen yanlış toplamı ${topicWrongSum}, genel girişteki ${wrongTotal} ile uyuşmuyor.`);
            return;
        }

        setTopicResults(prev => ({
            ...prev,
            [subjectKey]: topics
        }));

        setTopicFormVisible(false);
        setCurrentSubject(null);
        setStatusMessage(`✅ ${subjectKey} için konu bazlı yanlışlar kaydedildi.`);
    };

    const handleFinalSubmit = async () => {
        const incomplete = subjects.filter(s => !topicResults[s.key]);

        if (incomplete.length > 0) {
            setStatusMessage(`❌ Konu bazlı veri eksik: ${incomplete.map(s => s.name).join(', ')}`);
            return;
        }

        const detailedScores = {};
        for (const { key } of subjects) {
            const topics = topicResults[key];
            detailedScores[key] = {};
            topics.forEach(t => {
                detailedScores[key][t.topicId] = {
                    incorrectAnswers: t.incorrectAnswers
                };
            });
        }

        const payload = {
            generalResults: subjectResults,
            detailedScores: detailedScores
        };

        try {
            if (MOCK_MODE) {
                console.log("📦 MOCK POST:", payload);
                await new Promise(r => setTimeout(r, 1000));
                setStatusMessage("✅ Başarıyla kaydedildi (mock)");
            } else {
                const res = await fetch(`${config.backendUrl}/api/exam-results/add?studentId=${studentId}&examId=${exam.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
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
        }
    };

    return (
        <div className="exam-result-form fade-in">
            <h2>{exam.name} - Sonuç Girişi</h2>

            {!submittedGeneral && (
                <form onSubmit={handleGeneralSubmit}>
                    {subjects.map(({ key, name, max }) => (
                        <div key={key}>
                            <label>{name} ({max} soru):</label>
                            <input id={`${key}-correct`} type="number" placeholder="Doğru" />
                            <input id={`${key}-wrong`} type="number" placeholder="Yanlış" />
                            <input id={`${key}-empty`} type="number" placeholder="Boş" />
                        </div>
                    ))}
                    <button type="submit">Genel Sonuçları Kaydet</button>
                </form>
            )}

            {submittedGeneral && !topicFormVisible && (
                <>
                    {subjects.map(({ key, name }) => (
                        <div key={key}>
                            <button onClick={() => {
                                setCurrentSubject({ key, name });
                                setTopicFormVisible(true);
                            }}>
                                {name} için Konu Bazlı Giriş Yap
                            </button>
                            {topicResults[key] && (
                                <p style={{ color: 'green' }}>✅ Giriş Yapıldı: {topicResults[key].length} konu</p>
                            )}
                        </div>
                    ))}
                    <button onClick={handleFinalSubmit}>Tüm Verileri Gönder</button>
                </>
            )}

            {topicFormVisible && currentSubject && (
                <TopicResultForm
                    subjectKey={currentSubject.key}
                    subjectName={currentSubject.name}
                    lessonId={subjects.find(s => s.key === currentSubject.key).id}
                    max={subjectResults[currentSubject.key].wrong}
                    expectedWrong={subjectResults[currentSubject.key].wrong}
                    existingData={topicResults[currentSubject.key] || null} // 👈 burada veri tutulur
                    onSubmit={handleTopicSubmit}
                    onCancel={() => {
                        setTopicFormVisible(false);
                        setCurrentSubject(null);
                    }}
                />
            )}

            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default ExamResultForm;

import React, { useState } from 'react';
import config from './config';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Math.max(0, parseInt(value) || 0);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
    };

    const isInvalid = subjects.some(({ key, max }) => {
        const total = formData[`${key}Correct`] + formData[`${key}Wrong`];
        return total > max;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isInvalid) return;

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
                await new Promise((res) => setTimeout(res, 1000));
                setStatusMessage("✅ Sınav sonucu başarıyla kaydedildi (mock).");
            } else {
                const response = await fetch(`${config.backendUrl}/api/exam-results/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error('Kayıt başarısız');
                const result = await response.json();
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
            <form onSubmit={handleSubmit}>
                {subjects.map(({ key, name, max }) => {
                    const correct = formData[`${key}Correct`];
                    const wrong = formData[`${key}Wrong`];
                    const total = correct + wrong;
                    const overLimit = total > max;

                    return (
                        <div key={key} className="form-row">
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
            {statusMessage && <p className="form-message">{statusMessage}</p>}
        </div>
    );
};

export default ExamResultForm;

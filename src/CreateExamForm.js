import React, { useState } from 'react';
import Exam from './entities/Exam';

const CreateExamForm = ({ onExamAdded, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        turkceCount: 20,
        matematikCount: 20,
        fenCount: 20,
        sosyalCount: 20,
        dinCount: 10,
        yabanciCount: 10,
        examDate: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Sınav adı zorunlu';
        if (!formData.examDate) newErrors.examDate = 'Tarih seçimi zorunlu';
        if (formData.turkceCount < 0) newErrors.turkceCount = 'Geçersiz değer';
        if (formData.matematikCount < 0) newErrors.matematikCount = 'Geçersiz değer';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.endsWith('Count') ? Math.max(0, parseInt(value) || 0) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const examData = {
                ...formData,
                examDate: new Date(formData.examDate).toISOString()
            };

            const createdExam = await Exam.createExam(examData);

            if (onExamAdded) {
                onExamAdded(createdExam);
            }

            // Formu sıfırla
            setFormData({
                name: '',
                turkceCount: 20,
                matematikCount: 20,
                fenCount: 20,
                sosyalCount: 20,
                dinCount: 10,
                yabanciCount: 10,
                examDate: ''
            });

            setSuccessMessage('✅ Sınav başarıyla oluşturuldu.');


        } catch (error) {
            setErrors({ submit: 'Sınav oluşturulamadı. Lütfen tekrar deneyin.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-exam-form">
            <h2 className="form-title">Yeni Sınav Oluştur</h2>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            {successMessage && (
                <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="exam-form">
                <div className="form-group">
                    <label className="form-label">
                        Sınav Adı:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Örnek: LGS Haziran Denemesi"
                        />
                    </label>
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="subject-grid">
                    {['turkce', 'matematik', 'fen', 'sosyal', 'din', 'yabanci'].map((subj, i) => (
                        <div className="subject-item" key={i}>
                            <label className="subject-label">
                                {subj.charAt(0).toUpperCase() + subj.slice(1)}:
                                <input
                                    type="number"
                                    name={`${subj}Count`}
                                    value={formData[`${subj}Count`]}
                                    onChange={handleChange}
                                    min="0"
                                    className="subject-input"
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Sınav Tarihi ve Saati:
                        <input
                            type="datetime-local"
                            name="examDate"
                            value={formData.examDate}
                            onChange={handleChange}
                            className={`form-input ${errors.examDate ? 'input-error' : ''}`}
                        />
                    </label>
                    {errors.examDate && <span className="error-text">{errors.examDate}</span>}
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Oluşturuluyor...' : 'Sınavı Oluştur'}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                        style={{ marginLeft: '10px' }}
                    >
                        İptal
                    </button>
                )}
            </form>
        </div>
    );
};

export default CreateExamForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Exam from './entities/Exam';
import config from './config';

const CreateExamForm = () => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Sinav adi zorunlu';
        if (!formData.examDate) newErrors.examDate = 'Tarih secimi zorunlu';
        if (formData.turkceCount < 0) newErrors.turkceCount = 'Gecersiz deger';
        if (formData.matematikCount < 0) newErrors.matematikCount = 'Gecersiz deger';

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

            await Exam.createExam(examData);
            navigate('/admin/main', { state: { success: true } });
        } catch (error) {
            console.error('Submission error:', error);
            setErrors({ submit: 'Sinav olusturulamadý. Lütfen tekrar deneyin.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-exam-form">
            <h2 className="form-title">Yeni Sinav Olustur</h2>

            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <form onSubmit={handleSubmit} className="exam-form">
                <div className="form-group">
                    <label className="form-label">
                        Sinav Adi:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Ornek: LGS Haziran Denemesi"
                        />
                    </label>
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="subject-grid">
                    <div className="subject-item">
                        <label className="subject-label">
                            Turkce:
                            <input
                                type="number"
                                name="turkceCount"
                                value={formData.turkceCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>

                    <div className="subject-item">
                        <label className="subject-label">
                            Matematik:
                            <input
                                type="number"
                                name="matematikCount"
                                value={formData.matematikCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>

                    <div className="subject-item">
                        <label className="subject-label">
                            Fen Bilimleri:
                            <input
                                type="number"
                                name="fenCount"
                                value={formData.fenCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>

                    <div className="subject-item">
                        <label className="subject-label">
                            Sosyal Bilgiler:
                            <input
                                type="number"
                                name="sosyalCount"
                                value={formData.sosyalCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>

                    <div className="subject-item">
                        <label className="subject-label">
                            Din Kulturu:
                            <input
                                type="number"
                                name="dinCount"
                                value={formData.dinCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>

                    <div className="subject-item">
                        <label className="subject-label">
                            Yabanci Dil:
                            <input
                                type="number"
                                name="yabanciCount"
                                value={formData.yabanciCount}
                                onChange={handleChange}
                                min="0"
                                className="subject-input"
                            />
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Sinav Tarihi ve Saati:
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
                    {isSubmitting ? 'Olusturuluyor...' : 'Sinavi Olustur'}
                </button>
            </form>
        </div>
    );
};

export default CreateExamForm;

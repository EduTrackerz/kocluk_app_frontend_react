// entities/Exam.js
import config from '../config';

export default class Exam {
    static async createExam(examData) {
        const role = localStorage.getItem('role');
        const response = await fetch(`${config.backendUrl}/api/exams/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'role': role
            },
            body: JSON.stringify(examData)
        });

        if (!response.ok) throw new Error('Sınav oluşturma başarısız');
        return await response.json();
    }

    static async getAllExams() {
        try {
            const role = localStorage.getItem('role');
            if (!role) throw new Error('Yetkilendirme hatası: Rol bilgisi yok');

            const response = await fetch(`${config.backendUrl}/api/exams/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'role': role.toLowerCase // Rol bilgisini header'a ekle
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Sınavlar getirilemedi');
            }
            return await response.json();
        } catch (error) {
            console.error('Sınavları getirme hatası:', error);
            throw error;
        }
    }
}
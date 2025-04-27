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

        if (!response.ok) throw new Error('Sýnav oluþturma baþarýsýz');
        return await response.json();
    }

    static async getAllExams() {
        try {
            const role = localStorage.getItem('role');
            if (!role) throw new Error('Yetkilendirme hatasý: Rol bilgisi yok');

            const response = await fetch(`${config.backendUrl}/api/exams/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT kullanýyorsanýz
                    'role': role // Rol bilgisini header'a ekle
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Sýnavlar getirilemedi');
            }
            return await response.json();
        } catch (error) {
            console.error('Sýnavlarý getirme hatasý:', error);
            throw error;
        }
    }
}
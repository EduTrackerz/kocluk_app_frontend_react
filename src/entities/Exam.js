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

        if (!response.ok) throw new Error('S�nav olu�turma ba�ar�s�z');
        return await response.json();
    }

    static async getAllExams() {
        try {
            const role = localStorage.getItem('role');
            if (!role) throw new Error('Yetkilendirme hatas�: Rol bilgisi yok');

            const response = await fetch(`${config.backendUrl}/api/exams/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // JWT kullan�yorsan�z
                    'role': role // Rol bilgisini header'a ekle
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'S�navlar getirilemedi');
            }
            return await response.json();
        } catch (error) {
            console.error('S�navlar� getirme hatas�:', error);
            throw error;
        }
    }
}
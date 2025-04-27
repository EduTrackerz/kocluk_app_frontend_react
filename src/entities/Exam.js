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
        const role = localStorage.getItem('role');
        const response = await fetch(`${config.backendUrl}/api/exams/all`, {
            headers: {
                'role': role
            }
        });

        if (!response.ok) throw new Error('Sýnavlar getirilemedi');
        return await response.json();
    }
}
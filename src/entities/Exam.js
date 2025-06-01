// src/entities/Exam.js
import config from '../config';

export default class Exam {
    // ✅ Sınav oluşturma – POST isteği
    static async createExam(examData) {
        const role = localStorage.getItem('role');
        if (!role) throw new Error('Yetkilendirme hatası: Rol bilgisi bulunamadı');

        const response = await fetch(`${config.backendUrl}/api/exams/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Role': role
            },
            body: JSON.stringify(examData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Sınav oluşturma başarısız');
        }

        // Backend sınav nesnesini döndüğü için burada direkt onu alıyoruz
        return await response.json();
    }

    // ✅ Tüm sınavları çekme – GET isteği
    static async getAllExams() {
        const role = localStorage.getItem('role');
        if (!role) throw new Error('Yetkilendirme hatası: Rol bilgisi bulunamadı');

        const response = await fetch(`${config.backendUrl}/api/exams/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Role': role
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Sınavlar getirilemedi');
        }

        return await response.json();
    }
}

import React, { useEffect, useState } from 'react';
import config from './config';
import ExamProgressChart from './components/ExamProgressChart';

const StudentStatisticsPage = ({ studentId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`${config.backendUrl}/api/exam-results/student/${studentId}`);
                if (!response.ok) throw new Error("Sonuçlar yüklenemedi");
                const data = await response.json();
                setResults(data);
            } catch (err) {
                console.error("Sonuç getirme hatası:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [studentId]);

    const calcNet = (correct, wrong) => (correct - wrong * 0.25).toFixed(2);
    const getNetClass = (net) => {
        if (net >= 15) return { color: "green" };
        if (net <= 5) return { color: "red" };
        return {};
    };

    if (loading) return <p>⏳ Yükleniyor...</p>;
    if (error) return <p className="error-message">Hata: {error}</p>;

    if (!Array.isArray(results)) {
        return <p>📭 Henüz sonuç girdiğiniz sınav bulunmamaktadır.</p>;
    }

    return (
        <div>
            <h2>📊 İstatistikler</h2>
            {results.length > 0 && <ExamProgressChart results={results} />}
        </div>
    );
};

export default StudentStatisticsPage;
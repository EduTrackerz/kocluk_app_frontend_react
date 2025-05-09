import React, { useEffect, useState } from 'react';
import config from './config';

const PastExamResults = ({ studentId }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const MOCK_MODE = false;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                if (MOCK_MODE) {
                    const mockData = [
                        {
                            exam: {
                                id: 1,
                                name: "LGS Deneme 1",
                                examDate: new Date().toISOString()
                            },
                            turkceCorrect: 15, turkceWrong: 5,
                            matematikCorrect: 12, matematikWrong: 8,
                            fenCorrect: 10, fenWrong: 5,
                            sosyalCorrect: 9, sosyalWrong: 6,
                            dinCorrect: 8, dinWrong: 2,
                            yabanciCorrect: 6, yabanciWrong: 4
                        }
                    ];
                    setResults(mockData);
                } else {
                    const response = await fetch(`${config.backendUrl}/api/exam-results/student/${studentId}`);
                    if (!response.ok) throw new Error("Sonuçlar yüklenemedi");
                    const data = await response.json();
                    setResults(data);
                }
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

    return (
        <div className="past-exam-results">
            <h2>📊 Geçmiş Sınav Sonuçlarınız</h2>

            {results.length === 0 ? (
                <p>📭 Henüz sonuç girdiğiniz sınav bulunmamaktadır.</p>
            ) : (
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Sınav</th>
                            <th>Tarih</th>
                            <th>Türkçe</th>
                            <th>Matematik</th>
                            <th>Fen</th>
                            <th>Sosyal</th>
                            <th>Din</th>
                            <th>Yabancı</th>
                            <th>Toplam Net</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((res, i) => {
                            const netler = [
                                calcNet(res.turkceCorrect, res.turkceWrong),
                                calcNet(res.matematikCorrect, res.matematikWrong),
                                calcNet(res.fenCorrect, res.fenWrong),
                                calcNet(res.sosyalCorrect, res.sosyalWrong),
                                calcNet(res.dinCorrect, res.dinWrong),
                                calcNet(res.yabanciCorrect, res.yabanciWrong)
                            ];
                            const totalNet = netler.reduce((acc, net) => acc + parseFloat(net), 0).toFixed(2);

                            return (
                                <tr key={i}>
                                    <td>{res.exam?.name || "-"}</td>
                                    <td>{new Date(res.examDate).toLocaleString("tr-TR")}</td>
                                    <td style={getNetClass(netler[0])}>{res.turkceCorrect}/{res.turkceWrong} ({netler[0]})</td>
                                    <td style={getNetClass(netler[1])}>{res.matematikCorrect}/{res.matematikWrong} ({netler[1]})</td>
                                    <td style={getNetClass(netler[2])}>{res.fenCorrect}/{res.fenWrong} ({netler[2]})</td>
                                    <td style={getNetClass(netler[3])}>{res.sosyalCorrect}/{res.sosyalWrong} ({netler[3]})</td>
                                    <td style={getNetClass(netler[4])}>{res.dinCorrect}/{res.dinWrong} ({netler[4]})</td>
                                    <td style={getNetClass(netler[5])}>{res.yabanciCorrect}/{res.yabanciWrong} ({netler[5]})</td>
                                    <td style={getNetClass(totalNet)}><b>{totalNet}</b></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PastExamResults;

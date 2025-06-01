import React, { useEffect, useState } from 'react';
import config from './config';
import ExamProgressChart from './components/ExamProgressChart';

const PastExamResults = ({ studentId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [detailedResult, setDetailedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const MOCK_MODE = false;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (MOCK_MODE) {
          const mockData = [
            {
              examId: 1,
              examName: "LGS Deneme 1",
              examDate: new Date().toISOString(),
              turkceCorrect: 15,
              turkceWrong: 5,
              matematikCorrect: 12,
              matematikWrong: 8,
              fenCorrect: 10,
              fenWrong: 5,
              sosyalCorrect: 9,
              sosyalWrong: 6,
              dinCorrect: 8,
              dinWrong: 2,
              yabanciCorrect: 6,
              yabanciWrong: 4
            }
          ];
          setResults(mockData);
        } else {
          const response = await fetch(
            `${config.backendUrl}/api/exam-results/student/${studentId}`
          );
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

  useEffect(() => {
    if (selectedExamId !== null) {
      const fetchDetailedResult = async () => {
        try {
          const response = await fetch(
            `${config.backendUrl}/api/exam-results/student/${studentId}/exam/${selectedExamId}/detailed`
          );
          if (!response.ok) throw new Error("Detaylı sonuç yüklenemedi");
          const data = await response.json();
          setDetailedResult(data);
          setShowModal(true);
        } catch (err) {
          console.error("Detaylı sınav sonucu alınamadı:", err);
        }
      };

      fetchDetailedResult();
    }
  }, [selectedExamId, studentId]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const calcNet = (correct, wrong) => (correct - wrong * 0.25).toFixed(2);
  const getNetClass = (net) => {
    if (net >= 15) return { color: "green" };
    if (net <= 5) return { color: "red" };
    return {};
  };
  const handleExamClick = (examId) => {
    if (examId === selectedExamId) {
      setSelectedExamId(null);
      setTimeout(() => setSelectedExamId(examId), 0);
    } else {
      setSelectedExamId(examId);
    }
  };

  if (loading) return <p>⏳ Yükleniyor...</p>;
  if (error) return <p className="error-message">Hata: {error}</p>;

  if (!Array.isArray(results) || results.length === 0) {
    return <p>📭 Henüz sonuç girdiğiniz sınav bulunmamaktadır.</p>;
  }

  return (
    <div className="past-exam-results">
      <h2>📊 Geçmiş Sınav Sonuçlarınız</h2>

      {results.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <ExamProgressChart results={results} />
        </div>
      )}

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
            <th>Detaylı Sonuç</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res, i) => {
            // DTO’dan gelen alan adları: res.examName, res.examDate, res.turkceCorrect, vs.
            const netler = [
              calcNet(res.turkceCorrect, res.turkceWrong),
              calcNet(res.matematikCorrect, res.matematikWrong),
              calcNet(res.fenCorrect, res.fenWrong),
              calcNet(res.sosyalCorrect, res.sosyalWrong),
              calcNet(res.dinCorrect, res.dinWrong),
              calcNet(res.yabanciCorrect, res.yabanciWrong),
            ];
            const totalNet = netler
              .reduce((acc, net) => acc + parseFloat(net), 0)
              .toFixed(2);

            return (
              <tr key={i}>
                {/* Eskiden res.exam?.name idi, şimdi DTO doğrudan examName’a sahip */}
                <td>{res.examName || "-"}</td>
                <td>
                  {new Date(res.examDate).toLocaleString("tr-TR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td style={getNetClass(netler[0])}>
                  {res.turkceCorrect}/{res.turkceWrong} ({netler[0]})
                </td>
                <td style={getNetClass(netler[1])}>
                  {res.matematikCorrect}/{res.matematikWrong} ({netler[1]})
                </td>
                <td style={getNetClass(netler[2])}>
                  {res.fenCorrect}/{res.fenWrong} ({netler[2]})
                </td>
                <td style={getNetClass(netler[3])}>
                  {res.sosyalCorrect}/{res.sosyalWrong} ({netler[3]})
                </td>
                <td style={getNetClass(netler[4])}>
                  {res.dinCorrect}/{res.dinWrong} ({netler[4]})
                </td>
                <td style={getNetClass(netler[5])}>
                  {res.yabanciCorrect}/{res.yabanciWrong} ({netler[5]})
                </td>
                <td style={getNetClass(totalNet)}>
                  <b>{totalNet}</b>
                </td>
                <td>
                  <button onClick={() => handleExamClick(res.examId)}>
                    Detayları Gör
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && detailedResult && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "600px",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              <h2>
                {detailedResult.examName} <br />
                <small>
                  {new Date(detailedResult.examDate).toLocaleString("tr-TR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </small>
              </h2>

              {/** detailedResult.detailedScores: 
                   { 
                     "Türkçe": [ { topicName, wrongCount }, … ], 
                     "Matematik": […], … 
                   }
              **/}
              {Object.entries(detailedResult.detailedScores).map(
                ([subject, topics]) => (
                  <div key={subject} style={{ marginBottom: "1rem" }}>
                    <h3>{subject}</h3>
                    <ul>
                      {topics.map((t, idx) => (
                        <li key={idx} style={{ marginBottom: "8px" }}>
                          <span>❌ {t.topicName}: {t.wrongCount} yanlış</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              <button
                onClick={() => setShowModal(false)}
                style={{ marginTop: "20px" }}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastExamResults;

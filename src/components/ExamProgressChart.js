// components/ExamProgressChart.js
import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ExamProgressChart = ({ results }) => {
    const [range, setRange] = useState('all'); // '7d', '30d', '90d', 'all'
    const dayInMs = 24 * 60 * 60 * 1000;

    const calcNet = (correct, wrong) =>
        parseFloat((correct - wrong * 0.25).toFixed(2));

    const fullData = results.map(res => {
        const date = new Date(res.exam?.examDate || res.examDate);
        const totalNet = [
            calcNet(res.turkceCorrect, res.turkceWrong),
            calcNet(res.matematikCorrect, res.matematikWrong),
            calcNet(res.fenCorrect, res.fenWrong),
            calcNet(res.sosyalCorrect, res.sosyalWrong),
            calcNet(res.dinCorrect, res.dinWrong),
            calcNet(res.yabanciCorrect, res.yabanciWrong)
        ].reduce((acc, val) => acc + val, 0);

        return {
            date: date.getTime(),
            label: format(date, 'dd MMM yyyy', { locale: tr }),
            totalNet: parseFloat(totalNet.toFixed(2))
        };
    }).sort((a, b) => a.date - b.date);

    const now = Date.now();
    const filteredData = useMemo(() => {
        if (range === 'all') return fullData;
        const rangeInMs = parseInt(range.replace('d', '')) * dayInMs;
        return fullData.filter(d => d.date >= now - rangeInMs);
    }, [range, fullData]);

    const dates = filteredData.map(d => d.date);
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);

    return (
        <div style={{ width: '100%', height: 350 }}>
            <h3>📈 Net Puan Gelişimi (Tarihe Göre)</h3>
            <div style={{ marginBottom: '0.5rem' }}>
                <label>
                    Görüntüleme Aralığı:{' '}
                    <select value={range} onChange={e => setRange(e.target.value)}>
                        <option value="7d">Son 7 Gün</option>
                        <option value="30d">Son 30 Gün</option>
                        <option value="90d">Son 90 Gün</option>
                        <option value="all">Tüm Zamanlar</option>
                    </select>
                </label>
            </div>
            <ResponsiveContainer>
                <LineChart data={filteredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                        type="number"
                        scale="time"
                        dataKey="date"
                        domain={[minDate - dayInMs * 2, maxDate + dayInMs * 2]}
                        tickFormatter={(timestamp) =>
                            format(new Date(timestamp), 'dd MMM', { locale: tr })
                        }
                    />
                    <YAxis />
                    <Tooltip
                        labelFormatter={(timestamp) =>
                            format(new Date(timestamp), 'dd MMMM yyyy', { locale: tr })
                        }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalNet" stroke="#8884d8" dot={{ r: 4 }} />
                    <Brush
                        dataKey="date"
                        height={25}
                        stroke="#8884d8"
                        travellerWidth={10}
                        tickFormatter={(timestamp) =>
                            format(new Date(timestamp), 'dd MMM', { locale: tr })
                        }
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExamProgressChart;

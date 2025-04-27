import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Ana sayfa testi
test('Ana sayfada login butonlar�n� g�sterir', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    expect(screen.getByText(/��renci/i)).toBeInTheDocument();
    expect(screen.getByText(/��retmen/i)).toBeInTheDocument();
    expect(screen.getByText(/Ko�/i)).toBeInTheDocument();
});

// Admin paneli testi
test('Admin paneli rotalar�n� do�ru y�kler', async () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    // URL'i de�i�tirerek test ediyoruz
    window.history.pushState({}, 'Admin Panel', '/admin/main/exam-create');

    // Ba�l�k kontrol�
    expect(await screen.findByText(/Yeni S�nav Olu�tur/i)).toBeInTheDocument();
});
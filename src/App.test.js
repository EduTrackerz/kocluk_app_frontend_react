import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Ana sayfa testi
test('Ana sayfada login butonlarýný gösterir', () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    expect(screen.getByText(/Öðrenci/i)).toBeInTheDocument();
    expect(screen.getByText(/Öðretmen/i)).toBeInTheDocument();
    expect(screen.getByText(/Koç/i)).toBeInTheDocument();
});

// Admin paneli testi
test('Admin paneli rotalarýný doðru yükler', async () => {
    render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    // URL'i deðiþtirerek test ediyoruz
    window.history.pushState({}, 'Admin Panel', '/admin/main/exam-create');

    // Baþlýk kontrolü
    expect(await screen.findByText(/Yeni Sýnav Oluþtur/i)).toBeInTheDocument();
});
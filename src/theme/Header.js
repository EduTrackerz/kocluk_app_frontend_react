import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import icon from './assets/logo_512.png';

function Header() {
    return (
        <header className="top-bar">
            <div className="top-bar-content">
                <img src={icon} alt="Logo" className="logo" />
                <Link to="/" className="title">EduTrackerz</Link>
            </div>
        </header>
    );
}

export default Header;

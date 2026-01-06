import React from 'react';

function Header() {
  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <a href="/">
            <img src="https://via.placeholder.com/40/ff5d00/ffffff?text=F" alt="Логотип" />
            <span>Финатлон</span>
          </a>
        </div>
        
        <a href="/" className="back-link">
          <i className="fas fa-arrow-left"></i>
          <span>На главную</span>
        </a>
      </div>
    </header>
  );
}

export default Header;
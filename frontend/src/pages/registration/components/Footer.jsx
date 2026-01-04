import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-container">
          <div className="footer-column footer-logo">
            <div className="brand">Ф<span>инатлон</span></div>
            <p>Платформа для организации и участия в мероприятиях, олимпиадах, форсайтах и хакатонах.</p>
          </div>
          
          <div className="footer-column">
            <h3>Контакты</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@finatlon.ru</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+7 (800) 123-45-67</span>
              </div>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Поддержка</h3>
            <ul>
              <li><a href="#">Частые вопросы</a></li>
              <li><a href="#">Техническая помощь</a></li>
              <li><a href="#">Служба поддержки</a></li>
              <li><a href="#">Обратная связь</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Документы</h3>
            <ul>
              <li><a href="#">Пользовательское соглашение</a></li>
              <li><a href="#">Политика конфиденциальности</a></li>
              <li><a href="#">Правила участия</a></li>
              <li><a href="#">Документация API</a></li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; 2023 Финатлон. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
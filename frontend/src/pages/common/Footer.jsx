import React from 'react';
import { FaEnvelope, FaPhone, FaVk, FaTelegram, FaYoutube } from 'react-icons/fa';

function Footer() {
  const navigationLinks = [
    { name: "Главная" },
    { name: "Мероприятия" },
    { name: "Чаты" },
    { name: "Рассылки" }
  ];

  const jobLinks = [
    { name: "Вакансии" },
    { name: "Стажировки" },
    { name: "Карьера в Финатлон" },
    { name: "Отправить резюме" }
  ];

  const socialLinks = [
    { icon: <FaVk />, href: "#" },
    { icon: <FaTelegram />, href: "#" },
    { icon: <FaYoutube />, href: "#" },
  ];

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
                <FaEnvelope />
                <span>info@finatlon.ru</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+7 (800) 123-45-67</span>
              </div>
            </div>
          </div>

          <div className="footer-column">
            <h3>Навигация</h3>
            <ul>
              {navigationLinks.map((link, index) => (
                <li key={index}><a href="#">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Работать у нас</h3>
            <ul>
              {jobLinks.map((link, index) => (
                <li key={index}><a href="#">{link.name}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3>Медиа и подписка</h3>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a href={social.href} className="social-link" key={index}>
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="newsletter-form">
              <p>Подписаться на рассылку:</p>
              <input type="email" placeholder="Ваш email" />
              <button className="btn">Подписаться</button>
            </div>
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
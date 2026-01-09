import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const onRefRegister = () => navigate("/registration");

  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Как начать <span>участвовать</span> в мероприятиях?</h1>
        <p>
          Присоединяйтесь к платформе Финатлон, чтобы участвовать в олимпиадах, форсайтах, 
          конкурсах и хакатонах. Создайте аккаунт и получите доступ к множеству возможностей 
          для развития и самореализации.
        </p>
        <button type="button" className="btn btn-secondary" onClick={onRefRegister}>
          Зарегистрироваться
        </button>
      </div>
    </section>
  );
}

export default Hero;
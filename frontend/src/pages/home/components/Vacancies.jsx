import React from 'react';
import { FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

function Vacancies() {
  const vacancies = [
    {
      id: 1,
      title: "CRM-специалист",
      description: "Работа с клиентской базой, настройка и оптимизация CRM-системы, автоматизация бизнес-процессов.",
      tag: "Удаленно",
      location: "Москва или удаленно",
      experience: "Опыт от 2 лет"
    },
    {
      id: 2,
      title: "Сотрудник сайта",
      description: "Разработка и поддержка функционала сайта, работа с контентом, взаимодействие с пользователями.",
      tag: "Офис",
      location: "Москва",
      experience: "Опыт от 1 года"
    }
  ];

  return (
    <section className="vacancies">
      <div className="container">
        <h2 className="section-title">Актуальные вакансии</h2>
        <div className="vacancies-container">
          {vacancies.map(vacancy => (
            <div className="vacancy-card" key={vacancy.id}>
              <div className="vacancy-header">
                <div>
                  <h3 className="vacancy-title">{vacancy.title}</h3>
                  <p className="vacancy-description">{vacancy.description}</p>
                </div>
                <span className="vacancy-tag">{vacancy.tag}</span>
              </div>
              <div className="vacancy-details">
                <div className="vacancy-detail">
                  <FaMapMarkerAlt />
                  <span>{vacancy.location}</span>
                </div>
                <div className="vacancy-detail">
                  <FaBriefcase />
                  <span>{vacancy.experience}</span>
                </div>
              </div>
              <a href="#" className="btn">Подробнее</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Vacancies;
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

function Features() {
  const features = [
    {
      id: 1,
      title: "Чаты и общение",
      description: "Общайтесь с участниками мероприятий, экспертами и организаторами в удобном мессенджере. Получайте важные рассылки и будьте в курсе всех событий.",
      imageClass: "feature-1",
      linkText: "Перейти в чаты"
    },
    {
      id: 2,
      title: "Мероприятия",
      description: "Найдите подходящие олимпиады, форсайты, конкурсы и хакатоны. Используйте удобную фильтрацию по типу, организатору, городу и дате проведения.",
      imageClass: "feature-2",
      linkText: "Посмотреть мероприятия"
    },
    {
      id: 3,
      title: "Об организации",
      description: "Узнайте больше о нашей организации, наших экспертах и организаторах. Изучите историю, документацию и возможности для сотрудничества.",
      imageClass: "feature-3",
      linkText: "Об организации"
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Возможности платформы</h2>
        <div className="features-container">
          {features.map(feature => (
            <div className="feature-card" key={feature.id}>
              <div className={`feature-image ${feature.imageClass}`}></div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href="#" className="feature-link">
                  {feature.linkText}
                  <FaArrowRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
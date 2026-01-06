import React, { useEffect } from 'react';
import Hero from './Hero.jsx';
import Features from './Features.jsx';
import Partners from './Partners.jsx';
import Vacancies from './Vacancies.jsx';



function Homepage() {
  useEffect(() => {
    // Анимация при загрузке
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Наблюдаем за карточками
    document.querySelectorAll('.feature-card, .vacancy-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="homepage">
      <main className="homepage-main">
        <Hero />
        <Features />
        <Partners />
        <Vacancies />
      </main>
    </div>
  );
}

export default Homepage;
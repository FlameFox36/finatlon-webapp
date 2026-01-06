import React from 'react';

function MarqueeSection() {
  const partners = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <section className="marquee-section">
      <div className="container">
        <h2 className="section-title">Наши партнеры</h2>
        <div className="marquee-container">
          <div className="marquee">
            {/* Первый набор партнеров */}
            {partners.map(num => (
              <img 
                key={`first-${num}`}
                src={`https://via.placeholder.com/150x60/121315/ffffff?text=Партнер+${num}`}
                alt={`Партнер ${num}`}
              />
            ))}
            {/* Дублируем для бесконечной анимации */}
            {partners.map(num => (
              <img 
                key={`second-${num}`}
                src={`https://via.placeholder.com/150x60/121315/ffffff?text=Партнер+${num}`}
                alt={`Партнер ${num}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarqueeSection;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaNewspaper, FaComments, FaCalendarAlt, FaBullhorn, FaInfoCircle, FaUser} from 'react-icons/fa';

function Header() {
  const navigate = useNavigate();
  const onRefHomepage = () => navigate("/");

  const navItems = [
    {
      name: " Лента",
      icon: <FaNewspaper />,
      dropdown: [
        { name: "Ивенты" },
        { name: "Посты" },
        { name: "Медиа" }
      ]
    },
    {
      name: " Чаты",
      icon: <FaComments />,
      dropdown: [
        { name: "Мессенджер" },
        { name: "Рассылки" }
      ]
    },
    {
      name: " Мероприятия",
      icon: <FaCalendarAlt />,
      dropdown: [
        { name: "Фильтрация по:", isTitle: true },
        { name: "Тип: Олимпиады" },
        { name: "Тип: Форсайты" },
        { name: "Тип: Конкурсы" },
        { name: "Тип: Хакатоны" },
        { name: "Организатор" },
        { name: "Город" },
        { name: "Дата" }
      ]
    },
    {
      name: " Рассылки",
      icon: <FaBullhorn />,
      dropdown: null
    },
    {
      name: " Об Организации",
      icon: <FaInfoCircle />,
      dropdown: [
        { name: "История и общее описание" },
        { name: "Эксперты, организаторы" },
        { name: "Вакансии + Стажировки" },
        { name: "Документация" }
      ]
    }
  ];

  return (
    <header>
      <div className="container header-container">
        <div className="logo">
          <button type="button" className="" onClick={onRefHomepage}>
            Логотип&nbsp;Ф<span>инатлон</span>
          </button>
        </div>

        <nav className="nav-links">
          {navItems.map((item, index) => (
            <div className="nav-item" key={index}>
              <a href="#" className="nav-link">
                {item.icon}
                {item.name}
              </a>
              {item.dropdown && (
                <div className="dropdown">
                  {item.dropdown.map((dropdownItem, idx) => (
                    dropdownItem.isTitle ? (
                      <div className="dropdown-item" key={idx}><strong>{dropdownItem.name}</strong></div>
                    ) : (
                      <a href="#" className="dropdown-item" key={idx}>{dropdownItem.name}</a>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="user-menu">
          <a href="/profile" className="user-btn">
            <FaUser />
            Личный кабинет
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
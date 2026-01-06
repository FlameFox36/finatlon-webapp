# 📋 ПОЛНОЕ ОБНОВЛЁННОЕ ТЗ ПРОЕКТА ФИНАТЛОН 

## (Консолидированная база + CRM + Admin + Expert + Соцсеть)

***

## СОДЕРЖАНИЕ

1. Общая концепция

2. Источники данных и консолидация

3. Типы пользователей и рабочие места

4. Структура БД

5. Процесс консолидации

6. CRM-система (аналитика, маркетинг, интеграции)

7. Требования к производительности

8. Требования к безопасности

9. Рекомендуемый тех-стек

10. Промт для Claude

***

## 1. ОБЩАЯ КОНЦЕПЦИЯ

**Проект:** платформа «Финатлон» — интегрированная экосистема для социального нетворкинга, профессиональных сообществ, управления талантами и маркетинга.

**Основные компоненты:**

- **Социальная сеть** — для учеников, студентов, родителей, учителей, экспертов.

- **Консолидированная база данных** — единая БД всех участников из всех проектов платформы.

- **CRM-система** — для аналитики, маркетинга, сегментации, рассылок.

- **Управленческие панели** — для администраторов, CRM-специалистов, экспертов.

- **Система экспертизы** — менторинг, оценка работ, рейтинги.

- **Профессиональные сообщества** — по отраслям, образованию, интересам.

**Целевые пользователи:**

- Ученики и студенты (основная аудитория).

- Родители (поддержка и контроль).

- Учителя школ (кураторство, менторинг).

- Преподаватели вузов и эксперты (оценка, менторинг, консультирование).

- Сотрудники компаний (рекрутинг, вакансии, брендинг).

- **CRM-специалисты** (аналитика, маркетинг, сегментация).

- **Администраторы платформы** (управление, модерация, настройки).

***

## 2. ИСТОЧНИКИ ДАННЫХ И КОНСОЛИДАЦИЯ

### 2.1. Исходные базы

|                    |             |                                      |                                                     |
| ------------------ | ----------- | ------------------------------------ | --------------------------------------------------- |
| Источник           | Объём       | Типы                                 | Особенности                                         |
| ----------         | -------     | ------                               | ------------                                        |
| **Олимп-тест**     | ≈400 000    | Ученики + родители/учителя в анкетах | Нужна экстракция родителей и учителей из JSON-полей |
| **Финатлон-форум** | ≈7 000      | Участники форума                     | Дедупликация при слиянии с Олимп-тестом             |
| **Новая соцсеть**  | 0 (будущее) | Все типы (при первичной регистрации) | Первичная регистрация и новые пользователи          |

### 2.2. Особенности консолидации

#### Олимп-тест:

- **400 000 участников** (в основном ученики и студенты).

- В анкетах каждого участника встраиваются данные:

  - **Родителей** (ФИО, телефон, email, место работы, должность, примечания).

  - **Школьных учителей/кураторов** (ФИО, предмет, школа, контакты).

- Эти данные хранятся в **JSON-полях** и НЕ имеют самостоятельных записей.

- **Требуется:**

  - Парсинг JSON-анкет.

  - Извлечение данных родителей и учителей.

  - Создание для них отдельных сущностей (записей в consolidated_users).

  - Установление связей (родитель → ребёнок, учитель → ученик).

#### Финатлон-форум:

- **7 000 участников**.

- Нужна **дедупликация** с Олимп-тестом.

- Критерии дедупликации:

  - Email (точное совпадение, нормализованное).

  - Телефон (точное совпадение, без пробелов/символов).

  - ФИО + дата рождения (нечёткое сопоставление ≥85% сходства через fuzzywuzzy).

- При совпадении: **слить** записи, приоритет отдать Финатлон-форуму (если данные полнее).

#### Новая соцсеть:

- **Источник для новых пользователей** (первичная регистрация).

- Будут регистрироваться через OAuth (Google, LinkedIn) или обычную форму.

### 2.3. Цель консолидации

Построить **единую нормализованную базу**, включающую:

1. **Учащихся и студентов** (основной тип пользователей).

2. **Родителей** (извлечены из анкет Олимп-теста):

   - Полные профили, но с возможностью неполных данных.

   - Минимум: ФИО или телефон (для связи с ребёнком).

   - Опционально: email, место работы, должность, фото и т.д.

3. **Школьных учителей** (извлечены из анкет).

4. **Преподавателей вузов и экспертов** (новые роли).

5. **Сотрудников компаний** (новые роли для рекрутинга).

6. **CRM-специалистов** (внутренние сотрудники платформы).

7. **Администраторов** (внутренние сотрудники платформы).

**Каждая запись содержит:**

- Связь с исходной системой (source, source_participant_id).

- Полный профиль (ФИО, контакты, локация, профессия и т.д.).

- Флаги активности, верификации, блокировки.

- Метрики (полнота профиля, активность, рейтинг).

- JSON-метаданные для дополнительных данных.

### 2.4. Требования к процессу миграции

**ETL/ELT-процесс должен:**

- Выгружать данные из Олимп-теста и Финатлон-форума.

- Парсить JSON-анкеты и извлекать родителей/учителей.

- Нормализовать данные (ФИО, телефоны, email, адреса).

- Выполнять дедупликацию (точная и нечёткая).

- Создавать связи (родитель—ребёнок, учитель—ученик, эксперт—менторируемый).

- Рассчитывать метрики профилей.

- Обрабатывать ошибки и логировать результаты.

- Поддерживать **повторный запуск** (инкрементальное обновление).

- Обрабатывать **large datasets** (400K+ записей) без перегрузки памяти (batch-обработка).

***

## 3. ТИПЫ ПОЛЬЗОВАТЕЛЕЙ И РАБОЧИЕ МЕСТА

### 3.1. Типы пользователей (user_type)

|     |                           |                                        |                                              |                                   |     |
| --- | ------------------------- | -------------------------------------- | -------------------------------------------- | --------------------------------- | --- |
|     | Тип                       | Описание                               | Доступ                                       | Основное назначение               |     |
|     | -----                     | ---------                              | --------                                     | -------------------               |     |
|     | **STUDENT**               | Ученик/студент (основной пользователь) | Соцсеть, профиль, поиск вакансий, сообщества | Участие в проектах Финатлона      |     |
|     | **PARENT**                | Родитель (может быть неполный профиль) | Профиль ребёнка, уведомления, сообщества     | Контроль и информация             |     |
|     | **TEACHER_SCHOOL**        | Школьный учитель                       | Профиль, рекомендации, сообщества            | Кураторство, менторинг            |     |
|     | **TEACHER_UNIVERSITY**    | Преподаватель вуза / Эксперт           | Профиль, оценка работ, менторинг, CRM        | Оценка, менторинг, лидерборды     |     |
|     | **ORGANIZATION_EMPLOYEE** | Сотрудник компании / рекрутер          | Профиль, вакансии, мероприятия, сообщества   | Рекрутинг, поиск кандидатов       |     |
|     | **CRM_SPECIALIST**        | CRM-специалист платформы               | **CRM-рабочее место**                        | Аналитика, маркетинг, сегментация |     |
|     | **PLATFORM_ADMIN**        | Администратор платформы                | **Admin-рабочее место**                      | Управление, модерация, система    |     |

### 3.2. Особенность профиля PARENT

**Профили родителей** должны быть **аналогичны профилям остальных пользователей**, но с важной особенностью:

- **Обязательные поля для родителя:**

  - ФИО (first_name, last_name, patronymic).

  - Связь с ребёнком (relation_to_participant_id).

- **Опциональные поля** (могут быть пустыми / NULL):

  - email (может отсутствовать).

  - Телефон (может отсутствовать).

  - Дата рождения (часто не указывают в анкетах).

  - Город, регион (могут совпадать с адресом ребёнка или отличаться).

  - Место работы, должность, отрасль (часто частично указано).

  - Фото, образование и т.д.

- **Статус верификации:**

  - Родитель **автоматически не верифицируется** (не подтверждает email/phone).

  - Верификация возможна в будущем (если родитель самостоятельно зарегистрируется).

- **Расчёт полноты профиля:**

  - Для родителей полнота рассчитывается по **имеющимся полям** (без "штрафа" за пустые необязательные поля).

  - Пример: если у родителя заполнены ФИО + телефон (2 поля), это не 20%, а 100% для его "минимального профиля".

**Пример структуры:**

```json

{

  "id": 1000001,

  "user_type": "PARENT",

  "first_name": "Иван",

  "last_name": "Иванов",

  "patronymic": "Иванович",

  "email": null,  // может быть пусто

  "phone": "+7-999-123-45-67",

  "date_of_birth": null,  // может быть пусто

  "city": "Москва",

  "job_title": "Инженер",

  "company_name": "ООО ХХХ",

  "industry": "IT",

  "relation_to_participant_id": 500001,  // ссылка на ребёнка (student_id)

  "source": "OLYMP_TEST_QUESTIONNAIRE",

  "profile_completeness": 0.60,  // 60% (5 из 8 опциональных полей)

  "is_active": true,

  "is_verified": false,

  "metadata": {

    "extraction_date": "2025-12-05",

    "extracted_from_questionnaire": true

  }

}

```

### 3.3. Рабочие места (Workspaces/Roles)

#### **🏢 CRM-СПЕЦИАЛИСТ** (CRM_SPECIALIST)

**Основные обязанности:**

- Работа с консолидированной базой данных участников.

- Аналитика аудитории и поведения пользователей.

- Маркетинг и сегментация для целевых кампаний.

- Отправка рассылок по email и в соцсети.

- Экспорт данных для анализа.

- Интеграция с внешними системами (Bitrix24, HubSpot и т.д.).

**Инструменты в системе:**

1. **Таблица пользователей с фильтрацией:**

   - Фильтры: тип, возраст, город, регион, отрасль, источник, уровень заполненности профиля, дата регистрации.

   - Сортировка: по дате, активности, рейтингу.

   - Поиск: по ФИО, email, телефону, организации.

   - Экспорт: Excel (XLSX), CSV.

2. **Сегментация аудитории (Audience Builder):**

   - Создание сегментов по условиям (AND/OR).

   - Сохранение сегментов для повторного использования.

   - Подсчёт размера сегмента в реальном времени.

   - Примеры: "Студенты IT, 18-25 лет, Москва", "Родители, активные в соцсети".

3. **Панель рассылок:**

   - Создание email-кампаний (с шаблонами).

   - Отправка в соцсеть (посты в группах/каналах).

   - Push-уведомления (для мобильного приложения, если будет).

   - SMS (опционально).

   - Расписание отправки (немедленно, по времени, по часовому поясу).

   - Отслеживание открытий, кликов, отписок.

4. **Аналитика и отчёты:**

   - **Воронка (Funnel):** регистрация → активация → конверсия → удержание.

   - **Когорты (Cohort Analysis):** анализ по группам (по времени регистрации, источнику).

   - **LTV (Lifetime Value):** прогнозная стоимость пользователя.

   - **Retention Curves:** удержание пользователей.

   - **Демография:** распределение по возрасту, городу, отрасли.

   - **Активность:** количество посещений, время, действия.

   - **Источники трафика:** откуда пришли пользователи (Олимп-тест, Финатлон-форум, соцсеть).

   - Экспорт отчётов (PDF, Excel).

5. **Интеграция с внешними системами:**

   - **Bitrix24:** двусторонняя синхронизация контактов, создание заявок/лидов.

   - **HubSpot:** интеграция для более продвинутого CRM.

   - **MailChimp/SendGrid:** для email-рассылок через API.

   - **Slack/Telegram:** отправка уведомлений о важных событиях.

   - **Google Sheets:** экспорт данных для совместной работы.

   - API для собственных интеграций.

6. **Управление кампаниями:**

   - Создание, редактирование, запуск, приостановка, отмена кампаний.

   - История всех отправок.

   - A/B-тестирование (разные версии письма, разные аудитории).

   - Автоматизация (триггеры: новая регистрация, день рождения, неактивность и т.д.).

**Доступные данные:**

- Все персональные данные пользователей (соблюдение GDPR).

- История активности (логины, посмотрели, кликнули).

- Статус подписки на рассылки, истории открытий.

- Сегменты и теги.

**Права доступа:**

- ✅ Просмотр, фильтрация, поиск пользователей.

- ✅ Создание и редактирование сегментов.

- ✅ Отправка рассылок (может требоваться одобрение администратора).

- ✅ Экспорт данных в Excel/CSV.

- ✅ Просмотр аналитики и отчётов.

- ✅ Интеграция с внешними системами (конфигурация ключей API).

- ❌ Не может: удалять пользователей, менять пароли, видеть логи администратора.

**Интеграция с Bitrix24 (подробно):**

```

1. Авторизация через OAuth2 (Bitrix24 API).

2. Синхронизация контактов:

   - При создании/обновлении контакта в Финатлон → создание/обновление в Bitrix24.

   - Поля: ФИО, email, телефон, компания, должность.

   - Теги в Bitrix24 соответствуют сегментам в Финатлон.

3. Создание лидов (leads):

   - Рассылка в Финатлон → создание лида в Bitrix24 (если клик по ссылке).

   - Отслеживание статуса лида в Bitrix24 (в реальном времени).

4. Работа с CRM-каналом:

   - Синхронизация телефонных звонков / сообщений из Bitrix24 в Финатлон (опционально).

```

***

#### **👨‍💼 АДМИНИСТРАТОР ПЛАТФОРМЫ** (PLATFORM_ADMIN)

**Основные обязанности:**

- Управление пользователями (создание, редактирование, удаление, блокировка, восстановление).

- Управление ролями и правами доступа (RBAC).

- Модерация контента и сообществ (посты, вакансии, комментарии).

- Системные настройки (SMTP, SMS-шлюз, API‑ключи, интеграции).

- Мониторинг и логирование всех действий (аудит).

- Резервное копирование и восстановление данных.

- Безопасность и блокировка вредоносных действий.

**Инструменты в системе:**

1. **Управление пользователями:**

   - Полный список пользователей (с фильтрацией).

   - Просмотр профиля (все поля).

   - Редактирование (любого поля).

   - Создание нового пользователя.

   - Блокировка/разблокировка (с причиной).

   - Удаление пользователя (soft-delete или hard-delete).

   - Восстановление удалённого пользователя.

   - Смена пароля, сброс 2FA.

   - Массовые операции (блокировка сегмента пользователей и т.д.).

2. **Управление ролями (RBAC):**

   - Справочник ролей (STUDENT, PARENT, TEACHER_SCHOOL, TEACHER_UNIVERSITY, CRM_SPECIALIST, PLATFORM_ADMIN и т.д.).

   - Привязка пользователя к роли(ям).

   - Расширение/ограничение прав конкретного пользователя.

   - История назначения ролей (кто, когда, почему).

   - Временные роли (с окончанием действия).

3. **Модерация контента:**

   - Список постов на модерацию (отмечены как "требуют проверки").

   - Просмотр постов (с контекстом: автор, дата, сообщество).

   - Одобрение / Отклонение / Удаление поста.

   - Применение санкций (предупреждение, блокировка автора).

   - История модерации (логирование всех решений).

4. **Модерация сообществ:**

   - Список сообществ.

   - Просмотр и редактирование настроек.

   - Закрытие/архивирование сообщества.

   - Управление модераторами сообщества.

   - История действий в сообществе.

5. **Системные настройки:**

   - Email (SMTP-сервер, адрес отправки, шаблоны).

   - SMS-шлюз (API-ключ, баланс).

   - API-ключи для интеграций.

   - Параметры безопасности (двухфакторная аутентификация, сессии и т.д.).

   - Резервное копирование (расписание, история).

6. **Логирование и аудит:**

   - Логи всех действий (кто, что, когда, откуда).

   - Фильтрация логов (по пользователю, типу действия, дате).

   - Экспорт логов (для анализа, комплайанса).

   - Поиск по содержимому логов.

7. **Мониторинг:**

   - Статистика платформы (кол-во активных пользователей, новых регистраций, активность).

   - Производительность (время ответа API, нагрузка на БД, использование памяти).

   - Алерты (если система выходит за пределы нормы).

   - История инцидентов.

8. **Резервное копирование:**

   - Ручное создание бэкапа.

   - Расписание автоматических бэкапов.

   - Список доступных бэкапов (с датой и размером).

   - Восстановление из бэкапа (с предупреждением о перезаписи данных).

   - Проверка целостности бэкапа.

**Доступные данные:**

- Все данные системы без ограничений.

- Полные логи всех операций.

- Статистика использования и производительности.

- Системные параметры и конфигурация.

**Права доступа:**

- ✅ Полный контроль над системой.

- ✅ CRUD-операции над пользователями.

- ✅ Назначение/отзыв ролей.

- ✅ Просмотр и редактирование логов.

- ✅ Системные настройки.

- ✅ Резервное копирование.

***

### 3.4. Расширенный профиль TEACHER_UNIVERSITY (Преподаватель ВУЗа / Эксперт)

**Дополнительные поля:**

|   |   |   |   |   |
|---|---|---|---|---|
||Поле|Тип|Описание||
||------|-----|---------||
||`university_position`|VARCHAR|Должность (профессор, доцент, ассистент, лектор и т.д.)||
||`faculty_name`|VARCHAR|Факультет / Школа||
||`department_name`|VARCHAR|Кафедра / Отделение||
||`expertise_areas`|JSONB|Области экспертизы (массив: ['финансы', 'экономика', 'статистика'])||
||`academic_qualification`|VARCHAR|Степень (кандидат наук, доктор наук, PhD и т.д.)||
||`expert_rating`|NUMERIC(4,2)|Рейтинг эксперта (0-10, рассчитывается на основе оценок студентов)||
||`mentee_count`|INTEGER|Количество менторируемых студентов||
||`reviewed_works_count`|INTEGER|Количество проверенных работ||
||`average_feedback_score`|NUMERIC(4,2)|Средняя оценка за обратную связь (0-10)||

**Личный кабинет эксперта включает:**

- Список менторируемых студентов (с прогрессом).

- Список проверяемых работ (статус: новая, в работе, завершена).

- Рейтинг и статистика оценок.

- История менторства.

- Возможность отправки обратной связи студентам.

***

## 4. СТРУКТУРА БД (ПОЛНАЯ)

### 4.1. Основная таблица консолидированных пользователей

```sql

CREATE TABLE consolidated_users (

    -- =============== ИДЕНТИФИКАЦИЯ ===============

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),

    external_id VARCHAR(255) UNIQUE,  -- для дедупликации

    -- =============== ТИПЫ И РОЛИ ===============

    user_type VARCHAR(50) NOT NULL DEFAULT 'STUDENT',

    -- STUDENT, PARENT, TEACHER_SCHOOL, TEACHER_UNIVERSITY,

    -- ORGANIZATION_EMPLOYEE, CRM_SPECIALIST, PLATFORM_ADMIN

    -- =============== ОСНОВНАЯ ИНФОРМАЦИЯ ===============

    first_name VARCHAR(100) NOT NULL,

    middle_name VARCHAR(100),

    last_name VARCHAR(100) NOT NULL,

    patronymic VARCHAR(100),

    full_name_normalized VARCHAR(300) GENERATED ALWAYS AS (

        CONCAT(

            COALESCE(first_name, ''), ' ',

            COALESCE(last_name, ''), ' ',

            COALESCE(patronymic, '')

        )

    ) STORED,

    -- =============== КОНТАКТЫ ===============

    email VARCHAR(255),

    phone VARCHAR(20),

    phone_country_code VARCHAR(5) DEFAULT 'RU',

    -- =============== ЛИЧНЫЕ ДАННЫЕ ===============

    date_of_birth DATE,

    gender VARCHAR(10),  -- M, F, OTHER, UNKNOWN

    avatar_url VARCHAR(500),

    city VARCHAR(100),

    region VARCHAR(100),

    country VARCHAR(100) DEFAULT 'RU',

    address TEXT,

    -- =============== ДЛЯ УЧЕНИКОВ/СТУДЕНТОВ ===============

    school_name VARCHAR(255),

    school_id INTEGER,

    grade_level INTEGER,  -- класс (1-11)

    university_name VARCHAR(255),

    university_id INTEGER,

    course_level INTEGER,  -- курс (1-6 для ВУЗов)

    specialization VARCHAR(255),  -- специальность

    -- =============== ДЛЯ ШКОЛЬНЫХ УЧИТЕЛЕЙ ===============

    school_subject VARCHAR(100),  -- предмет

    school_qualification VARCHAR(255),  -- категория, диплом

    -- =============== ДЛЯ ПРЕПОДАВАТЕЛЕЙ ВУЗов / ЭКСПЕРТОВ ===============

    university_position VARCHAR(100),  -- профессор, доцент, ассистент

    faculty_name VARCHAR(255),  -- факультет

    department_name VARCHAR(255),  -- кафедра

    expertise_areas JSONB,  -- {'areas': ['финансы', 'экономика']}

    academic_qualification VARCHAR(255),  -- степень, диплом

    expert_rating NUMERIC(4, 2) DEFAULT 0,  -- 0-10

    average_feedback_score NUMERIC(4, 2) DEFAULT 0,  -- 0-10

    mentee_count INTEGER DEFAULT 0,

    reviewed_works_count INTEGER DEFAULT 0,

    -- =============== ДЛЯ СОТРУДНИКОВ ОРГАНИЗАЦИЙ ===============

    job_title VARCHAR(255),

    company_name VARCHAR(255),

    industry VARCHAR(100),

    is_recruiter BOOLEAN DEFAULT FALSE,

    -- =============== ДЛЯ РОДИТЕЛЕЙ ===============

    relation_to_participant_id BIGINT REFERENCES consolidated_users(id),

    occupation VARCHAR(255),  -- работа родителя

    place_of_work VARCHAR(255),  -- место работы

    -- =============== РАБОЧИЕ МЕСТА (для CRM и Admin) ===============

    crm_workspace_access BOOLEAN DEFAULT FALSE,

    admin_workspace_access BOOLEAN DEFAULT FALSE,

    -- =============== ИСТОЧНИК ДАННЫХ ===============

    source VARCHAR(50) NOT NULL,

    -- OLYMP_TEST, FINATHLON_FORUM, SOCIAL_NETWORK, DIRECT_IMPORT,

    -- OLYMP_TEST_QUESTIONNAIRE (для родителей/учителей)

    source_participant_id VARCHAR(255),

    source_updated_at TIMESTAMP,

    -- =============== СТАТУС ===============

    is_active BOOLEAN DEFAULT TRUE,

    is_verified BOOLEAN DEFAULT FALSE,

    verification_date TIMESTAMP,

    is_blocked BOOLEAN DEFAULT FALSE,

    block_reason VARCHAR(500),

    block_date TIMESTAMP,

    -- =============== МЕТРИКИ ===============

    profile_completeness NUMERIC(3, 2) DEFAULT 0.00,  -- 0.00-1.00

    activity_score NUMERIC(5, 2) DEFAULT 0,

    last_activity_at TIMESTAMP,

    -- =============== СИСТЕМНЫЕ ПОЛЯ ===============

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    last_login_at TIMESTAMP,

    -- =============== МЕТАДАННЫЕ ===============

    metadata JSONB DEFAULT '{}',  -- скрины, настройки, теги

    original_data JSONB  -- исходные данные из анкет

);

-- ИНДЕКСЫ

CREATE INDEX idx_consolidated_users_email ON consolidated_users(email)

    WHERE email IS NOT NULL;

CREATE INDEX idx_consolidated_users_phone ON consolidated_users(phone)

    WHERE phone IS NOT NULL;

CREATE INDEX idx_consolidated_users_external_id ON consolidated_users(external_id);

CREATE INDEX idx_consolidated_users_user_type ON consolidated_users(user_type);

CREATE INDEX idx_consolidated_users_source ON consolidated_users(source);

CREATE INDEX idx_consolidated_users_created_at ON consolidated_users(created_at DESC);

CREATE INDEX idx_consolidated_users_university_id ON consolidated_users(university_id);

CREATE INDEX idx_consolidated_users_school_id ON consolidated_users(school_id);

CREATE INDEX idx_consolidated_users_expert_rating ON consolidated_users(expert_rating DESC);

CREATE INDEX idx_consolidated_users_city ON consolidated_users(city);

CREATE INDEX idx_consolidated_users_region ON consolidated_users(region);

CREATE INDEX idx_consolidated_users_industry ON consolidated_users(industry);

CREATE INDEX idx_consolidated_users_full_text ON consolidated_users

    USING GIN(to_tsvector('russian', full_name_normalized));

CREATE INDEX idx_consolidated_users_is_active ON consolidated_users(is_active);

```

### 4.2. Таблица ролей и прав доступа

```sql

CREATE TABLE user_roles (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    role VARCHAR(50) NOT NULL,

    workspace VARCHAR(50),  -- NULL (обычный пользователь), CRM, ADMIN

    permissions JSONB,  -- {'view_users': true, 'send_emails': true, ...}

    assigned_by_user_id BIGINT REFERENCES consolidated_users(id) ON DELETE SET NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),

    assigned_reason TEXT,

    expires_at TIMESTAMP,  -- если роль временная

    is_active BOOLEAN DEFAULT TRUE,

    UNIQUE(user_id, role, workspace)

);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

CREATE INDEX idx_user_roles_role ON user_roles(role);

CREATE INDEX idx_user_roles_workspace ON user_roles(workspace);

CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);

```

### 4.3. Таблица менторства

```sql

CREATE TABLE mentorship_relations (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    mentor_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    mentee_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    field_of_expertise VARCHAR(255),

    status VARCHAR(20),  -- ACTIVE, PAUSED, COMPLETED, REJECTED

    started_at TIMESTAMP DEFAULT NOW(),

    ended_at TIMESTAMP,

    notes TEXT,

    UNIQUE(mentor_id, mentee_id)

);

CREATE INDEX idx_mentorship_mentor_id ON mentorship_relations(mentor_id);

CREATE INDEX idx_mentorship_mentee_id ON mentorship_relations(mentee_id);

```

### 4.4. Таблица оценок экспертом

```sql

CREATE TABLE expert_reviews (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    expert_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    student_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    work_id BIGINT,  -- ID работы (если есть отдельная таблица)

    work_title VARCHAR(255),

    work_description TEXT,

    score NUMERIC(4, 2),  -- оценка (0-100)

    feedback TEXT,  -- комментарий

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    is_published BOOLEAN DEFAULT FALSE

);

CREATE INDEX idx_expert_reviews_expert_id ON expert_reviews(expert_id);

CREATE INDEX idx_expert_reviews_student_id ON expert_reviews(student_id);

```

### 4.5. Таблица сообществ

```sql

CREATE TABLE communities (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    category VARCHAR(100), 

    -- PROFESSIONAL, EDUCATIONAL, REGIONAL, INTEREST, EXPERT

    created_by_user_id BIGINT REFERENCES consolidated_users(id) ON DELETE SET NULL,

    avatar_url VARCHAR(500),

    cover_image_url VARCHAR(500),

    member_count INTEGER DEFAULT 0,

    post_count INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    is_verified BOOLEAN DEFAULT FALSE,

    moderation_level VARCHAR(20),  -- OPEN, MODERATED, PRIVATE

    -- Для экспертных сообществ

    is_expert_community BOOLEAN DEFAULT FALSE,

    expertise_field VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_communities_created_by ON communities(created_by_user_id);

CREATE INDEX idx_communities_category ON communities(category);

```

### 4.6. Таблица связей пользователь—сообщество

```sql

CREATE TABLE user_communities (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE CASCADE,

    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,

    role VARCHAR(20),  -- MEMBER, MODERATOR, ADMIN

    joined_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, community_id)

);

CREATE INDEX idx_user_communities_user_id ON user_communities(user_id);

CREATE INDEX idx_user_communities_community_id ON user_communities(community_id);

```

### 4.7. Таблица дедупликации

```sql

CREATE TABLE user_deduplication_map (

    id BIGSERIAL PRIMARY KEY,

    source_external_id VARCHAR(255),

    consolidated_user_id BIGINT REFERENCES consolidated_users(id) ON DELETE CASCADE,

    source_system VARCHAR(50),  -- OLYMP_TEST, FINATHLON_FORUM

    confidence NUMERIC(3, 2),  -- 0-1

    created_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_user_deduplication_map_source_id ON user_deduplication_map(source_external_id);

CREATE INDEX idx_user_deduplication_map_consolidated_id ON user_deduplication_map(consolidated_user_id);

```

### 4.8. Таблица аудита (истории изменений)

```sql

CREATE TABLE consolidated_users_audit (

    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT REFERENCES consolidated_users(id) ON DELETE CASCADE,

    change_type VARCHAR(20),  -- INSERT, UPDATE, DELETE, MERGE

    changed_fields JSONB,  -- {'email': 'old@mail.com', 'phone': '+7-999-123-45-67'}

    new_values JSONB,  -- {'email': 'new@mail.com', 'phone': '+7-999-111-11-11'}

    source_system VARCHAR(50),

    changed_by_user_id BIGINT REFERENCES consolidated_users(id) ON DELETE SET NULL,

    changed_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_consolidated_users_audit_user_id ON consolidated_users_audit(user_id);

CREATE INDEX idx_consolidated_users_audit_changed_at ON consolidated_users_audit(changed_at DESC);

```

### 4.9. Таблица CRM-кампаний

```sql

CREATE TABLE crm_campaigns (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    campaign_type VARCHAR(50),  -- EMAIL, SMS, PUSH, POST, etc.

    created_by_user_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE SET NULL,

    target_segment_id BIGINT REFERENCES crm_segments(id) ON DELETE SET NULL,

    -- или직접 условия в JSONB:

    target_criteria JSONB,  -- {'user_type': 'STUDENT', 'city': 'Москва'}

    template_id BIGINT,  -- ID шаблона письма/поста

    status VARCHAR(20),  -- DRAFT, SCHEDULED, SENT, FAILED, PAUSED

    scheduled_at TIMESTAMP,

    sent_at TIMESTAMP,

    total_recipients INTEGER,

    sent_count INTEGER DEFAULT 0,

    opened_count INTEGER DEFAULT 0,

    clicked_count INTEGER DEFAULT 0,

    unsubscribed_count INTEGER DEFAULT 0,

    failed_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_crm_campaigns_created_by ON crm_campaigns(created_by_user_id);

CREATE INDEX idx_crm_campaigns_status ON crm_campaigns(status);

```

### 4.10. Таблица CRM-сегментов

```sql

CREATE TABLE crm_segments (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    created_by_user_id BIGINT NOT NULL REFERENCES consolidated_users(id) ON DELETE SET NULL,

    criteria JSONB NOT NULL,  -- условия фильтрации

    -- {'user_type': ['STUDENT', 'PARENT'], 'city': 'Москва', 'age_min': 18, 'age_max': 25}

    member_count INTEGER DEFAULT 0,  -- кэшированное значение

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    last_calculated_at TIMESTAMP

);

CREATE INDEX idx_crm_segments_created_by ON crm_segments(created_by_user_id);

```

### 4.11. Таблица логирования консолидации

```sql

CREATE TABLE consolidation_log (

    id BIGSERIAL PRIMARY KEY,

    consolidated_at TIMESTAMP DEFAULT NOW(),

    source_system VARCHAR(50),  -- OLYMP_TEST, FINATHLON_FORUM

    records_processed INTEGER,

    records_inserted INTEGER,

    records_updated INTEGER,

    records_skipped INTEGER,

    records_failed INTEGER,

    parents_extracted INTEGER,  -- кол-во извлеченных родителей

    teachers_extracted INTEGER,  -- кол-во извлеченных учителей

    deduplication_matches INTEGER,

    execution_time_seconds NUMERIC(10, 2),

    error_log JSONB,  -- детали ошибок

    status VARCHAR(20)  -- SUCCESS, PARTIAL_SUCCESS, FAILED

);

```

### 4.12. Таблица CRM-интеграций

```sql

CREATE TABLE crm_integrations (

    id BIGSERIAL PRIMARY KEY,

    uuid UUID UNIQUE DEFAULT gen_random_uuid(),

    integration_type VARCHAR(50) NOT NULL, 

    -- BITRIX24, HUBSPOT, MAILCHIMP, SENDGRID, SLACK, TELEGRAM, GOOGLE_SHEETS

    name VARCHAR(255),

    is_active BOOLEAN DEFAULT TRUE,

    config JSONB,  -- конфигурация (API-ключи, endpoints и т.д.)

    -- зашифровано перед сохранением в БД

    last_sync_at TIMESTAMP,

    last_error_at TIMESTAMP,

    last_error_message TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX idx_crm_integrations_type ON crm_integrations(integration_type);

CREATE INDEX idx_crm_integrations_is_active ON crm_integrations(is_active);

```

***

## 5. ПРОЦЕСС КОНСОЛИДАЦИИ

### 5.1. Этапы консолидации

1. **Выгрузка данных**

   - Из Олимп-теста: вся таблица users + таблица анкет (где хранятся JSON).

   - Из Финатлон-форума: таблица пользователей.

   - Размер: ~400K записей из Олимп-теста, ~7K из Финатлон-форума.

2. **Парсинг анкет (только Олимп-тест)**

   - Для каждого участника распарсить JSON-поле `questionnaire`.

   - Извлечь поля "parents" (массив) и "teachers" (массив).

   - Для каждого родителя/учителя создать запись структуры.

3. **Нормализация данных**

   - ФИО: привести к единому формату (first_name, last_name, patronymic).

   - Email: привести к нижнему регистру, убрать пробелы.

   - Телефон: убрать пробелы, дефисы, привести к единому формату (+7-XXX-XXX-XX-XX).

   - Дата рождения: привести к формату DATE (YYYY-MM-DD).

   - Город/регион: нормализовать названия (убрать лишние пробелы, привести к одному регистру).

4. **Дедупликация**

   - **Точное совпадение по email:** если email совпадает (и не NULL) → объединить записи.

   - **Точное совпадение по телефону:** если телефон совпадает (и не NULL) → объединить записи.

   - **Нечёткое сопоставление по ФИО + дата рождения:**

     - Рассчитать сходство ФИО через fuzzywuzzy (similarity_ratio).

     - Если similarity ≥ 85% И даты рождения совпадают → объединить с confidence 0.95.

     - Если similarity ≥ 90% И одна из дат рождения NULL → объединить с confidence 0.85.

5. **Создание связей**

   - Для каждого извлечённого родителя установить `relation_to_participant_id` на ID участника.

   - Для каждого извлечённого учителя установить связь (если есть таблица для этого).

6. **Расчёт метрик**

   - **profile_completeness:**

     - Для обычных пользователей: (кол-во заполненных полей) / (общее кол-во основных полей).

     - Основные поля: first_name, last_name, email, phone, date_of_birth, city, school_name/university_name, job_title.

     - Для родителей: расчет по имеющимся полям (без штрафа за пустые опциональные поля).

   - **activity_score:** базовая оценка активности (0 для новых пользователей).

   - **expert_rating:** для экспертов (0 по умолчанию, будет пересчитываться из оценок).

7. **Вставка в консолидированную БД**

   - INSERT в таблицу consolidated_users (batch-processing, page_size=5000).

   - Обработка ошибок (уникальность external_id, ограничения и т.д.).

8. **Вставка карты дедупликации**

   - INSERT в таблицу user_deduplication_map.

   - Сохранение связей между источниками и консолидированными записями.

9. **Логирование результатов**

   - INSERT в таблицу consolidation_log.

   - Сохранение статистики (кол-во обработано, вставлено, ошибок).

   - Если были ошибки — сохранить их в JSON (error_log).

### 5.2. Batch-обработка для больших объёмов

```python

# Псевдокод

BATCH_SIZE = 5000

for source in [OLYMP_TEST, FINATHLON_FORUM]:

    records = load_records_from_source(source)

    for batch_start in range(0, len(records), BATCH_SIZE):

        batch_end = min(batch_start + BATCH_SIZE, len(records))

        batch = records[batch_start:batch_end]

        processed_batch = process_and_deduplicate(batch)

        insert_batch_into_db(processed_batch)

        log_batch_status(source, batch_start, batch_end, status)

```

***

## 6. CRM-СИСТЕМА (АНАЛИТИКА, МАРКЕТИНГ, ИНТЕГРАЦИИ)

### 6.1. Аналитика (Analytics Dashboard)

**Основные метрики:**

1. **Размер и рост аудитории**

   - Общее кол-во пользователей.

   - Новые пользователи за период (день, неделя, месяц).

   - Распределение по типам (студенты, родители, учителя, эксперты).

   - Чурн (пользователи, которые ушли).

2. **Демография**

   - Возраст (гистограмма, средний возраст).

   - Город (топ-20 городов).

   - Регион (карта распределения).

   - Отрасль (для профессионалов).

   - Учебное заведение (для учеников).

3. **Активность**

   - Активные пользователи за период (DAU, MAU, WAU).

   - Время сессии (средняя, медиана).

   - Частота визитов.

   - Основные действия (просмотр профиля, поиск вакансии, участие в сообществе).

4. **Источники трафика**

   - По источнику регистрации (Олимп-тест, Финатлон-форум, соцсеть).

   - По каналу привлечения (прямой, реферрал, реклама и т.д.).

5. **Воронка (Funnel)**

   - Регистрация → Email-верификация → Заполнение профиля → Первое действие → Активность.

   - Коэффициент конверсии на каждом шаге.

6. **Когорт-анализ (Cohort Analysis)**

   - Удержание пользователей по неделям/месяцам регистрации.

   - Кривая ретенции (Retention Curve).

7. **LTV (Lifetime Value)**

   - Прогноз среднего "вклада" пользователя (если есть монетизация).

   - Сегментирование по LTV (high-value, medium, low).

8. **Качество данных**

   - Средняя полнота профиля (profile_completeness).

   - Процент профилей с email, телефоном и т.д.

   - Дата последнего обновления профиля.

**Визуализация:**

- Графики (линейные, столбчатые, пирогообразные).

- Таблицы с детализацией.

- Карты (географическое распределение).

- Экспорт отчётов (PDF, Excel).

### 6.2. Сегментация аудитории (Audience Builder)

**Механика:**

1. Выбрать условие (AND/OR логика).

2. Фильтры:

   - user_type (STUDENT, PARENT, TEACHER, etc.)

   - Возраст (диапазон)

   - Город, регион, страна

   - Учебное заведение (школа/вуз)

   - Отрасль

   - Источник данных

   - Полнота профиля (%)

   - Активность (DAU, MAU и т.д.)

   - Дата регистрации (диапазон)

   - Последняя активность (например, "активен за последние 30 дней")

3. Вычисление размера сегмента в реальном времени.

4. Сохранение сегмента для повторного использования.

**Примеры:**

```

Сегмент: "Активные студенты IT, 18-23 года, Москва"

Условие: user_type = 'STUDENT' AND industry = 'IT' AND age BETWEEN 18 AND 23 AND city = 'Москва' AND last_activity > NOW() - '30 days'::interval

Размер: 1234 пользователей

Сегмент: "Родители, активные в течение последних 7 дней"

Условие: user_type = 'PARENT' AND last_activity > NOW() - '7 days'::interval

Размер: 456 пользователей

```

### 6.3. Рассылки (Campaign Management)

**Типы рассылок:**

1. **Email-рассылки**

   - Выбор сегмента.

   - Выбор шаблона письма (или создание нового).

   - Персонализация (вставка переменных: {first_name}, {company}, и т.д.).

   - Расписание отправки (немедленно, по расписанию, по часовому поясу).

   - A/B-тестирование (две версии письма, разные сегменты).

2. **Посты в сообществах**

   - Выбор сообществ.

   - Создание поста (текст, изображение, видео, ссылки).

   - Расписание публикации.

3. **Push-уведомления** (если есть мобильное приложение)

   - Выбор сегмента.

   - Текст уведомления.

   - CTA (call-to-action).

   - Расписание.

4. **SMS** (опционально)

   - Выбор сегмента.

   - Текст сообщения (до 160 символов или несколько сообщений).

**Отслеживание результатов:**

- Кол-во отправлено.

- Кол-во открыто (для email).

- Кол-во кликов.

- Кол-во отписок (unsubscribe).

- Кол-во ошибок (hard bounce, soft bounce).

### 6.4. Интеграция с внешними системами

#### **Bitrix24** (основная интеграция)

**Синхронизация контактов:**

```

Финатлон User с user_type=ORGANIZATION_EMPLOYEE

  ↓ синхронизируется

Bitrix24 Contact

  - ФИО

  - Email

  - Телефон

  - Компания

  - Должность

  - Теги (соответствуют сегментам в Финатлон)

```

**Создание лидов:**

```

Кликнул по ссылке в email-рассылке (Финатлон)

  ↓

Создание события в Финатлон (tracking_event)

  ↓ если интеграция с Bitrix24 активна

Создание лида в Bitrix24

  - Источник: "Финатлон"

  - Контакт: синхронизированный пользователь

  - Название: "Рассылка: {campaign_name}"

  - Статус: "Новый"

```

**Отслеживание статуса лида:**

```

Админ смотрит лид в Bitrix24, меняет статус на "В процессе"

  ↓

Если интеграция двусторонняя, статус обновляется в Финатлон

  ↓

CRM-специалист видит, что пользователь уже в работе

```

**Двусторонняя синхронизация (опционально):**

- Звонки из Bitrix24 → логируются в Финатлон.

- Задачи в Bitrix24 → видны в Финатлон (для отслеживания).

#### **HubSpot** (альтернатива/дополнение)

- Синхронизация контактов (более продвинутая, чем Bitrix24).

- Создание заявок (deals).

- Интеграция с email-маркетингом HubSpot.

- А/B-тестирование прямо в HubSpot.

#### **MailChimp / SendGrid** (для email-рассылок)

- Интеграция для отправки email-кампаний (если не хочется использовать свой email-сервис).

- Отслеживание открытий, кликов.

- Автоматизация (триггер-письма при регистрации, восстановлении пароля и т.д.).

#### **Slack / Telegram** (для уведомлений)

- Отправка уведомлений о важных событиях (новая регистрация, аномалия в активности и т.д.).

- Команда может следить за ключевыми метриками прямо в Slack/Telegram.

#### **Google Sheets** (для экспорта)

- Экспорт сегментов в Google Sheets (для совместной работы).

- Импорт аудиенции из Google Sheets (если хотят загрузить список).

#### **Custom API**

- Возможность интеграции с любой системой через REST API (с авторизацией по API-ключу).

### 6.5. Автоматизация (Automation / Workflows)

**Примеры автоматических кампаний:**

1. **Приветственное письмо при регистрации**

   ```

   Триггер: Новый пользователь регистрируется

   Действие: Отправить email "Добро пожаловать" через 5 минут

   ```

2. **Напоминание о заполнении профиля**

   ```

   Триггер: Пользователь зарегистрировался, но profile_completeness < 50%

   Действие: Отправить email "Пополните профиль" через 3 дня

   ```

3. **Уведомление о дне рождения**

   ```

   Триггер: Сегодня день рождения пользователя (date_of_birth)

   Действие: Отправить поздравление

   ```

4. **Перелив неактивных пользователей в Bitrix24**

   ```

   Триггер: Пользователь неактивен 30+ дней

   Действие: Создать лид в Bitrix24 для рекрутинга

   ```

***

## 7. ТРЕБОВАНИЯ К ПРОИЗВОДИТЕЛЬНОСТИ

- **Масштабируемость:** консолидированная база ≥ 500K записей.

- **Время ответа API:**

  - Фильтрация пользователей: ≤ 500ms (включая сортировку).

  - Расчёт размера сегмента: ≤ 1s (для 500K записей).

  - Экспорт в Excel (100K записей): ≤ 3s.

- **Генерация страницы на сервере:** ≤ 1 сек.

- **Полная загрузка страницы:** ≤ 10 сек (с медиа).

- **Нагрузка:** 100 посещений/мин (пиковая).

- **Uptime:** 99.9%.

- **Пиковая активность:** без рассылки без замедления, при рассылке 100K писем/час → асинхронная обработка через RabbitMQ/Celery.

***

## 8. ТРЕБОВАНИЯ К БЕЗОПАСНОСТИ И СООТВЕТСТВИЮ

- **GDPR / Локальные законы:**

  - Согласия на обработку персональных данных.

  - Право на удаление (GDPR right to be forgotten).

  - Возможность экспорта данных пользователя.

  - Логирование согласия.

- **Локализация данных:** физическое хранилище в РФ (если требуется по закону).

- **Шифрование:**

  - TLS 1.2+ для передачи данных (in-transit).

  - AES-256 для хранения чувствительных данных (password, API-ключи, токены) at-rest.

  - Хеширование паролей (bcrypt, scrypt).

- **RBAC:** разные уровни доступа по ролям (STUDENT, CRM_SPECIALIST, PLATFORM_ADMIN).

- **Логирование:**

  - Аудит всех операций с ПД (создание, обновление, удаление, экспорт).

  - Логирование попыток несанкционированного доступа.

  - Retention логов: 90 дней.

- **Резервное копирование:**

  - Ежедневное автоматическое бэкапирование.

  - Retention: 30 дней.

  - Регулярное тестирование восстановления (RTO, RPO).

- **Защита от SQL-injection:**

  - Использование параметризованных запросов (prepared statements).

  - ORM (SQLAlchemy, TypeORM) для абстракции от сырого SQL.

- **Защита от XSS и CSRF:**

  - Экранирование выходных данных.

  - CSRF-токены для изменения данных.

- **Rate limiting:**

  - Защита от brute-force атак на логин.

  - Rate limiting на API endpoints (чтобы не было DDoS).

***

## 9. РЕКОМЕНДУЕМЫЙ ТЕХ-СТЕК

|   |   |   |   |   |
|---|---|---|---|---|
||Компонент|Рекомендация|Альтернатива||
||-----------|------------|-------------||
||**Backend**|FastAPI (Python 3.10+)|NestJS (Node.js)||
||**Database**|PostgreSQL 14+|-||
||**ORM**|SQLAlchemy (Python)|TypeORM (Node.js)||
||**Миграции БД**|Alembic (Python)|Flyway, Liquibase||
||**ETL/Data**|Python + pandas + psycopg2|Apache NiFi, Talend||
||**Fuzzy Matching**|fuzzywuzzy (Python)|difflib (Python), levenshtein||
||**Frontend**|Vue 3 или React + TypeScript|Angular||
||**State Management**|Pinia (Vue) / Redux (React)|Vuex, MobX||
||**UI Framework**|Tailwind CSS или Material-UI|Bootstrap, Ant Design||
||**Real-time**|WebSocket / Socket.io|WebRTC (для видео)||
||**Cache**|Redis|Memcached||
||**Message Queue**|RabbitMQ / Celery|Apache Kafka, AWS SQS||
||**File Storage**|S3 / MinIO|Google Cloud Storage, Azure Blob||
||**Full-Text Search**|Elasticsearch (опционально)|PostgreSQL Full-Text Search||
||**Monitoring**|Prometheus + Grafana|Datadog, New Relic||
||**Logging**|ELK Stack (Elasticsearch, Logstash, Kibana)|Sentry, Splunk||
||**CI/CD**|GitHub Actions / GitLab CI|Jenkins, CircleCI||
||**Container**|Docker|Podman||
||**Orchestration**|Docker Compose (разработка), Kubernetes (production)|Docker Swarm||
||**API Documentation**|Swagger/OpenAPI|Postman, ReDoc||

***

## 10. ПРОМТ ДЛЯ CLAUDE / ИИ-КОДЕРА

**ГОТОВЫЙ ПОЛНЫЙ ПРОМТ (копируй целиком):**

***

```

╔══════════════════════════════════════════════════════════════════════════════╗

║                   ПОЛНОЕ ТЗ ДЛЯ РАЗРАБОТКИ ПЛАТФОРМЫ ФИНАТЛОН              ║

║            Консолидированная база данных + CRM + Admin + Соцсеть             ║

╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════

1. ОБЩАЯ КОНЦЕПЦИЯ И КОНТЕКСТ

═══════════════════════════════════════════════════════════════════════════════

Платформа Финатлон — интегрированная экосистема, объединяющая:

- Социальную сеть (для учеников, студентов, родителей, учителей, экспертов)

- Консолидированную базу данных (единая БД всех участников)

- CRM-систему (аналитика, маркетинг, сегментация, рассылки, интеграции)

- Управленческие панели (для администраторов и CRM-специалистов)

- Систему профессиональных сообществ (по отраслям, образованию)

- Систему экспертизы (менторинг, оценка работ, рейтинги)

═══════════════════════════════════════════════════════════════════════════════

2. ИСХОДНЫЕ ДАННЫЕ И КОНСОЛИДАЦИЯ БАЗ

═══════════════════════════════════════════════════════════════════════════════

ИСТОЧНИКИ:

1️⃣ ОЛИМП-ТЕСТ (≈400 000 записей)

   - Участники с полными профилями

   - В анкетах (JSON-поля) встраиваются данные родителей и учителей

   - Нужно: извлечь эти данные и создать отдельные сущности

2️⃣ ФИНАТЛОН-ФОРУМ (≈7 000 записей)

   - Участники форума

   - Часто один и тот же человек в обеих базах → дедупликация

3️⃣ НОВАЯ СОЦСЕТЬ (первичная регистрация)

   - Новые пользователи регистрируются напрямую

ОСОБЕННОСТЬ РОДИТЕЛЬСКИХ ПРОФИЛЕЙ:

- Должны быть аналогичны профилям остальных пользователей

- НО: могут иметь пустые поля (email, дата рождения и т.д.)

- Минимум: ФИО или телефон для связи с ребёнком

- Полнота профиля рассчитывается по имеющимся полям (без штрафа за пустые)

- Примеры неполных полей: email (NULL), date_of_birth (NULL)

ДЕДУПЛИКАЦИЯ (между Олимп-тестом и Финатлон-форумом):

- Email (точное, нормализованное) → confidence 0.95

- Телефон (точное) → confidence 0.90

- ФИО + дата рождения (нечёткое ≥85% через fuzzywuzzy) → confidence 0.85-0.99

═══════════════════════════════════════════════════════════════════════════════

3. ТИПЫ ПОЛЬЗОВАТЕЛЕЙ И РАБОЧИЕ МЕСТА

═══════════════════════════════════════════════════════════════════════════════

ОСНОВНЫЕ ТИПЫ (user_type):

- STUDENT: ученик/студент (основной тип)

- PARENT: родитель (извлечён из анкет, может быть неполный профиль)

- TEACHER_SCHOOL: школьный учитель

- TEACHER_UNIVERSITY: преподаватель вуза / эксперт

- ORGANIZATION_EMPLOYEE: сотрудник компании / рекрутер

- CRM_SPECIALIST: CRM-специалист платформы (рабочее место)

- PLATFORM_ADMIN: администратор платформы (рабочее место)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 CRM-СПЕЦИАЛИСТ (рабочее место для маркетологов / аналитиков)

ОБЯЗАННОСТИ:

- Работа с консолидированной базой данных

- Аналитика и отчёты (воронка, когорты, LTV, Retention)

- Маркетинг и сегментация аудитории

- Отправка рассылок (email, SMS, push, посты в соцсети)

- Экспорт данных для анализа

- Интеграция с внешними системами (Bitrix24, HubSpot и т.д.)

ИНСТРУМЕНТЫ И ФУНКЦИИ:

1. Таблица пользователей с фильтрацией:

   - Фильтры: тип, возраст, город, регион, отрасль, источник, полнота профиля, дата регистрации

   - Сортировка: по дате, активности, рейтингу

   - Поиск: по ФИО, email, телефону, организации

   - Экспорт: Excel (XLSX), CSV

2. Сегментация аудитории (Audience Builder):

   - Создание сегментов с AND/OR логикой

   - Условия: user_type, возраст, город, отрасль, профиль-completeness, активность и т.д.

   - Подсчёт размера сегмента в реальном времени

   - Сохранение сегментов

3. Панель рассылок:

   - Email-кампании (с шаблонами и персонализацией)

   - Посты в сообществах

   - Push-уведомления и SMS

   - Расписание отправки

   - A/B-тестирование

   - Отслеживание: открытия, клики, отписки, ошибки

4. Аналитика и отчёты:

   - Воронка (Funnel): регистрация → активация → конверсия

   - Когорт-анализ (Cohort Analysis) по неделям/месяцам

   - LTV (Lifetime Value) и сегментация по LTV

   - Retention Curves (удержание пользователей)

   - Демография (возраст, город, отрасль, учебное заведение)

   - Активность (DAU, MAU, сессии, основные действия)

   - Источники трафика (по источнику регистрации)

   - Качество данных (средняя полнота профиля)

   - Экспорт отчётов (PDF, Excel)

5. Интеграция с внешними системами:

   a) BITRIX24 (основная интеграция):

      - Двусторонняя синхронизация контактов

      - Автоматическое создание лидов при клике на ссылку в рассылке

      - Теги в Bitrix24 соответствуют сегментам в Финатлон

      - Отслеживание статуса лида (when updated in Bitrix24 → update in Finathlon)

      - Отслеживание звонков из Bitrix24 (опционально)

   b) HUBSPOT (альтернатива/дополнение):

      - Синхронизация контактов (более продвинутая)

      - Создание заявок (deals)

      - Интеграция с email-маркетингом

   c) MAILCHIMP / SENDGRID:

      - Отправка email-рассылок через их сервис (если не свой)

      - Отслеживание открытий и кликов

      - Автоматизация (триггер-письма)

   d) SLACK / TELEGRAM:

      - Уведомления о важных событиях (новая регистрация, аномалии)

      - Мониторинг ключевых метрик

   e) GOOGLE SHEETS:

      - Экспорт сегментов для совместной работы

      - Импорт аудитории из Google Sheets

   f) CUSTOM API:

      - Интеграция с любыми системами через REST API

6. Автоматизация (Workflows):

   - Приветственное письмо при регистрации

   - Напоминание о заполнении профиля (если profile_completeness < 50%)

   - Уведомление в день рождения

   - Перелив неактивных пользователей в Bitrix24 (для рекрутинга)

   - Кастомные триггеры и действия

ДОСТУПНЫЕ ДАННЫЕ:

- Все персональные данные пользователей (соблюдение GDPR)

- История активности (логины, просмотры, клики)

- Статус подписки, история открытий

- Сегменты, теги, метаданные

ПРАВА ДОСТУПА:

✅ Просмотр, фильтрация, поиск пользователей

✅ Создание и редактирование сегментов

✅ Отправка рассылок (может требоваться одобрение админа)

✅ Экспорт данных в Excel/CSV

✅ Просмотр аналитики и отчётов

✅ Интеграция с внешними системами

❌ Не может: удалять пользователей, менять пароли, видеть логи администратора

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍💼 АДМИНИСТРАТОР ПЛАТФОРМЫ (рабочее место для администраторов)

ОБЯЗАННОСТИ:

- Управление пользователями (CRUD, блокировка, восстановление)

- Управление ролями и правами доступа (RBAC)

- Модерация контента (посты, сообщества, вакансии)

- Системные настройки (SMTP, API, интеграции)

- Логирование и аудит

- Резервное копирование

ИНСТРУМЕНТЫ И ФУНКЦИИ:

1. Управление пользователями:

   - Полный список (с фильтрацией)

   - Просмотр и редактирование профиля

   - Создание нового пользователя

   - Блокировка/разблокировка (с причиной)

   - Удаление (soft/hard)

   - Восстановление удалённых

   - Массовые операции

2. Управление ролями (RBAC):

   - Справочник ролей

   - Привязка пользователя к роли(ям)

   - Расширение/ограничение прав

   - История назначения ролей

   - Временные роли (с окончанием)

3. Модерация контента:

   - Список постов на модерацию

   - Одобрение / Отклонение / Удаление

   - Применение санкций (предупреждение, блокировка автора)

   - История модерации

4. Модерация сообществ:

   - Просмотр и редактирование

   - Закрытие / архивирование

   - Управление модераторами

   - История действий

5. Системные настройки:

   - Email (SMTP, адрес, шаблоны)

   - SMS-шлюз (API, баланс)

   - API-ключи для интеграций

   - Безопасность (2FA, сессии)

   - Резервное копирование (расписание, история)

6. Логирование и аудит:

   - Логи всех действий (кто, что, когда, откуда)

   - Фильтрация и поиск логов

   - Экспорт логов

   - Истории инцидентов

7. Мониторинг:

   - Статистика платформы

   - Производительность (API, БД, память)

   - Алерты

   - История инцидентов

8. Резервное копирование:

   - Ручное создание бэкапа

   - Расписание автоматических бэкапов

   - Восстановление из бэкапа

   - Проверка целостности

ДОСТУПНЫЕ ДАННЫЕ:

- Все данные системы без ограничений

- Полные логи всех операций

- Статистика и производительность

- Системные параметры

ПРАВА ДОСТУПА:

✅ Полный контроль над системой

✅ CRUD над пользователями

✅ Назначение / отзыв ролей

✅ Просмотр и редактирование логов

✅ Системные настройки

✅ Резервное копирование

═══════════════════════════════════════════════════════════════════════════════

4. СТРУКТУРА БД (ключевые таблицы)

═══════════════════════════════════════════════════════════════════════════════

ОСНОВНАЯ ТАБЛИЦА: consolidated_users

Основные поля:

- id, uuid, external_id (для дедупликации)

- user_type (STUDENT, PARENT, TEACHER_SCHOOL, TEACHER_UNIVERSITY, ...)

- first_name, last_name, patronymic, middle_name

- email, phone

- date_of_birth, gender, city, region, country, address, avatar_url

- school_name, school_id, grade_level (для учеников)

- university_name, university_id, course_level, specialization (для студентов)

- school_subject, school_qualification (для школьных учителей)

- university_position, faculty_name, department_name, expertise_areas, academic_qualification (для преподавателей)

- expert_rating, average_feedback_score, mentee_count, reviewed_works_count (для экспертов)

- job_title, company_name, industry (для профессионалов)

- relation_to_participant_id (для родителей - ссылка на ребёнка)

- crm_workspace_access, admin_workspace_access (флаги доступа)

- source (OLYMP_TEST, FINATHLON_FORUM, SOCIAL_NETWORK, ...)

- source_participant_id (ID в исходной системе)

- is_active, is_verified, is_blocked, block_reason

- profile_completeness (0-1), activity_score

- created_at, updated_at, last_login_at

- metadata (JSONB), original_data (JSONB)

ДРУГИЕ ТАБЛИЦЫ:

- user_roles (роли и права доступа)

- mentorship_relations (менторство)

- expert_reviews (оценки экспертом)

- communities (сообщества)

- user_communities (связь пользователь-сообщество)

- user_deduplication_map (карта дедупликации)

- consolidated_users_audit (история изменений)

- crm_campaigns (кампании рассылок)

- crm_segments (сегменты аудитории)

- crm_integrations (конфигурация интеграций)

- consolidation_log (логирование процесса консолидации)

═══════════════════════════════════════════════════════════════════════════════

5. ПРОЦЕСС КОНСОЛИДАЦИИ

═══════════════════════════════════════════════════════════════════════════════

ЭТАПЫ:

1. Выгрузка данных (из Олимп-теста и Финатлон-форума)

2. Парсинг JSON-анкет (извлечение родителей и учителей)

3. Нормализация данных (ФИО, email, телефон, адреса)

4. Дедупликация (точная и нечёткая)

5. Создание связей (родитель-ребёнок, учитель-ученик и т.д.)

6. Расчёт метрик (полнота профиля, активность)

7. Вставка в консолидированную БД (batch-processing 5000 записей за раз)

8. Вставка карты дедупликации

9. Логирование результатов

ТРЕБОВАНИЯ:

- Batch-обработка для 400K+ записей без перегрузки памяти

- Возможность повторного запуска (инкрементальное обновление)

- Обработка ошибок и логирование

- Расчёт profile_completeness:

  * Для обычных пользователей: (заполненные поля) / (основные поля)

  * Для родителей: (заполненные поля) / (имеющиеся поля) - БЕЗ штрафа за пустые опциональные

═══════════════════════════════════════════════════════════════════════════════

6. ТРЕБОВАНИЯ К ФУНКЦИЯМ И API

═══════════════════════════════════════════════════════════════════════════════

1. ETL-ПРОЦЕСС КОНСОЛИДАЦИИ

   - Парсинг JSON-анкет из Олимп-теста

   - Экстракция родителей и учителей

   - Нормализация данных

   - Дедупликация (точная и нечёткая через fuzzywuzzy)

   - Batch-обработка

   - Логирование и обработка ошибок

2. REST API ENDPOINTS

   a) Фильтрация и сортировка пользователей:

      GET /api/users

      Query params: type, city, age_min, age_max, industry, school, university,

                    source, profile_completeness_min, sort_by, sort_order, limit, offset

      Response: список пользователей

   b) Сегментация аудитории (CRM):

      POST /api/crm/segments

      Body: { name, description, criteria (JSONB) }

      Response: сегмент с размером

      GET /api/crm/segments

      Response: список сегментов

   c) Рассылки (CRM):

      POST /api/crm/campaigns

      Body: { name, campaign_type, target_segment_id, template_id, scheduled_at }

      Response: кампания

      GET /api/crm/campaigns/{id}/stats

      Response: { sent, opened, clicked, unsubscribed, failed }

   d) Аналитика (CRM):

      GET /api/crm/analytics/funnel

      Response: { registration, activation, conversion, retention }

      GET /api/crm/analytics/demographics

      Response: { by_age, by_city, by_industry, by_university }

      GET /api/crm/analytics/cohorts

      Response: cohort analysis by registration week/month

   e) Управление пользователями (Admin):

      GET /api/admin/users

      PATCH /api/admin/users/{id}

      DELETE /api/admin/users/{id}

      POST /api/admin/users/{id}/block

      POST /api/admin/users/{id}/unblock

   f) Управление ролями (Admin):

      POST /api/admin/roles/{user_id}

      Body: { role, workspace, permissions }

      Response: role assigned

   g) Логирование (Admin):

      GET /api/admin/logs

      Query params: user_id, action_type, date_from, date_to

      Response: список логов

   h) Экспорт (CRM / Admin):

      GET /api/export/users?format=xlsx&filters={...}

      Response: файл Excel

═══════════════════════════════════════════════════════════════════════════════

7. ТРЕБОВАНИЯ К ПРОИЗВОДИТЕЛЬНОСТИ

═══════════════════════════════════════════════════════════════════════════════

- Масштабируемость: ≥ 500K записей в консолидированной БД

- Время ответа API:

  * Фильтрация пользователей: ≤ 500ms

  * Расчёт размера сегмента: ≤ 1s

  * Экспорт (100K записей): ≤ 3s

- Генерация страницы на сервере: ≤ 1 сек

- Полная загрузка страницы: ≤ 10 сек (с медиа)

- Нагрузка: 100 посещений/мин (пиковая)

- Рассылка 100K писем/час → асинхронная обработка через RabbitMQ/Celery

- Uptime: 99.9%

═══════════════════════════════════════════════════════════════════════════════

8. ТРЕБОВАНИЯ К БЕЗОПАСНОСТИ

═══════════════════════════════════════════════════════════════════════════════

- GDPR / Локальные законы: согласие, право на удаление, экспорт ПД

- Локализация: хранилище данных в РФ (если требуется)

- Шифрование: TLS (in-transit), AES-256 (at-rest) для чувствительных данных

- RBAC: разные уровни доступа по ролям

- Логирование: аудит всех операций с ПД

- Резервное копирование: ежедневно, retention 30 дней

- Защита от SQL-injection: параметризованные запросы, ORM

- Rate limiting: защита от brute-force и DDoS

═══════════════════════════════════════════════════════════════════════════════

9. РЕКОМЕНДУЕМЫЙ ТЕХ-СТЕК

═══════════════════════════════════════════════════════════════════════════════

- Backend: FastAPI (Python 3.10+) или NestJS (Node.js)

- Database: PostgreSQL 14+ (JSONB, UUID, Full-Text Search)

- ORM: SQLAlchemy (Python) или TypeORM (Node.js)

- Миграции: Alembic (Python)

- ETL: Python + pandas + psycopg2

- Fuzzy Matching: fuzzywuzzy (Python)

- Cache: Redis

- Message Queue: RabbitMQ / Celery (для рассылок)

- File Storage: S3 / MinIO

- Search (опционально): Elasticsearch

- Monitoring: Prometheus + Grafana

- Logging: ELK Stack или Sentry

- CI/CD: GitHub Actions / GitLab CI

- Container: Docker + Docker Compose

- Orchestration: Kubernetes (при масштабировании)

- API Documentation: Swagger/OpenAPI

═══════════════════════════════════════════════════════════════════════════════

10. ЗАДАЧИ ДЛЯ РАЗРАБОТКИ

═══════════════════════════════════════════════════════════════════════════════

1. ✅ Создать миграции Alembic для всех таблиц БД (с индексами)

2. ✅ Реализовать ETL-скрипты (Python):

   a) Парсинг JSON-анкет и экстракция родителей/учителей

   b) Нормализация данных

   c) Дедупликация (точная и нечёткая через fuzzywuzzy)

   d) Batch-обработка для 400K+ записей

   e) Логирование и обработка ошибок

   f) Возможность повторного запуска

3. ✅ Создать REST API endpoints (FastAPI):

   a) Фильтрация и сортировка пользователей

   b) CRM-панель (сегментация, рассылки, аналитика, экспорт)

   c) Admin-панель (управление пользователями, ролями, логирование)

   d) Экспертная панель (менторство, оценки)

4. ✅ Оптимизировать запросы для производительности:

   a) Индексы на часто фильтруемые поля

   b) Кэширование с Redis

   c) Пагинация по умолчанию

   d) Подготовленные statements

5. ✅ Реализовать систему логирования и аудита

6. ✅ Документация:

   a) Swagger/OpenAPI для API

   b) Database schema diagram (ERD)

   c) Инструкция по запуску ETL

   d) Примеры использования API (Postman collection)

═══════════════════════════════════════════════════════════════════════════════

11. РЕЗУЛЬТАТЫ И ОЖИДАЕМЫЕ ВЫХОДЫ

═══════════════════════════════════════════════════════════════════════════════

На выходе нужно получить:

✅ Полная схема БД (SQL-скрипты для создания таблиц, индексов, constraints)

✅ Миграции Alembic для версионирования БД

✅ Рабочие ETL-скрипты (Python) для консолидации баз данных

✅ REST API backend (FastAPI или NestJS) с полным функционалом

✅ Docker-файлы и docker-compose для локальной разработки

✅ Документация API (Swagger/OpenAPI)

✅ Примеры тестирования (Postman collection, pytest)

✅ Инструкция по развёртыванию в production

═══════════════════════════════════════════════════════════════════════════════

12. УТОЧНЕНИЯ, УСТАНОВЛЕННЫЕ ЗАКАЗЧИКОМ

═══════════════════════════════════════════════════════════════════════════════

✅ CRM требует аналитическую работу и маркетинг

✅ Сортировка по признакам (тип, возраст, город, отрасль, источник и т.д.)

✅ Рассылка писем в сети (email, SMS, push, посты)

✅ Предусмотрена возможность взаимодействия с системами типа Bitrix24

✅ Анкеты родителей аналогичны остальным, но могут иметь пустые поля

✅ Информация о родителях может быть неполной (опциональные поля)

✅ Преподаватели вузов добавлены как отдельный тип пользователя

✅ Рабочие места для CRM-специалиста и администратора (с полным функционалом)

═══════════════════════════════════════════════════════════════════════════════

ВОПРОСЫ ДЛЯ УТОЧНЕНИЯ (если возникнут):

1. Предпочитаемый язык backend: Python (FastAPI) или Node.js (NestJS)?

2. Нужно ли Elasticsearch для полнотекстового поиска или достаточно PostgreSQL FTS?

3. Какой средний размер JSON-анкет в Олимп-тесте?

4. Какие конкретные отчёты критичны для CRM-специалиста?

5. Какая политика удаления данных (GDPR right to be forgotten)?

6. Нужна ли интеграция с другими системами кроме Bitrix24?

═══════════════════════════════════════════════════════════════════════════════

```

***

## ИТОГОВЫЙ ДОКУМЕНТ

Сохрани этот файл как **`FINATHLON_FULL_TS_v2.0.md`**

Используй этот промт для Claude, и начинай разработку! 🚀

Источники
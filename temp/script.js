// Элементы DOM
const userTypeCards = document.querySelectorAll('.user-type-card');
const userTypeInput = document.getElementById('userType');
const parentFields = document.getElementById('parentFields');

const formSteps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');

const nextStep1Btn = document.getElementById('nextStep1');
const prevStep2Btn = document.getElementById('prevStep2');
const nextStep2Btn = document.getElementById('nextStep2');
const prevStep3Btn = document.getElementById('prevStep3');
const submitFormBtn = document.getElementById('submitForm');

const registrationForm = document.getElementById('registrationForm');
const reviewData = document.getElementById('reviewData');

let currentStep = 1;

// Выбор типа пользователя
userTypeCards.forEach(card => {
    card.addEventListener('click', () => {
        // Снимаем выделение со всех карточек
        userTypeCards.forEach(c => c.classList.remove('selected'));
        // Выделяем выбранную карточку
        card.classList.add('selected');
        
        // Сохраняем выбранный тип
        const userType = card.getAttribute('data-type');
        userTypeInput.value = userType;
        
        // Показываем дополнительные поля для родителей
        if (userType === 'parent') {
            parentFields.classList.add('show');
        } else {
            parentFields.classList.remove('show');
        }
    });
});

// Валидация шага 1
nextStep1Btn.addEventListener('click', () => {
    if (!userTypeInput.value) {
        alert('Пожалуйста, выберите тип пользователя');
        return;
    }
    
    goToStep(2);
});

// Валидация шага 2
nextStep2Btn.addEventListener('click', () => {
    if (!validateStep2()) {
        return;
    }
    
    updateReviewData();
    goToStep(3);
});

// Навигация по шагам
prevStep2Btn.addEventListener('click', () => goToStep(1));
prevStep3Btn.addEventListener('click', () => goToStep(2));

// Функция перехода к шагу
function goToStep(step) {
    // Скрываем все шаги
    formSteps.forEach(formStep => formStep.classList.remove('active'));
    stepIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.classList.remove('completed');
    });
    
    // Показываем текущий шаг
    document.getElementById(`step${step}Form`).classList.add('active');
    
    // Обновляем индикаторы шагов
    for (let i = 1; i <= step; i++) {
        const stepIndicator = document.getElementById(`step${i}`);
        if (i < step) {
            stepIndicator.classList.add('completed');
        } else if (i === step) {
            stepIndicator.classList.add('active');
        }
    }
    
    // Обновляем прогресс бар
    const progressWidth = (step - 1) * 50;
    progressFill.style.width = `${progressWidth}%`;
    progressPercent.textContent = `${Math.round(progressWidth)}%`;
    
    currentStep = step;
    
    // Обновляем текст прогресса
    document.querySelector('.progress-text span:first-child').textContent = `Шаг ${step} из 3`;
}

// Валидация шага 2
function validateStep2() {
    let isValid = true;
    
    // Сбрасываем ошибки
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
    
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('error');
    });
    
    // Проверяем обязательные поля
    const requiredFields = [
        { id: 'fullName', errorId: 'fullNameError', message: 'Пожалуйста, введите ваше ФИО' },
        { id: 'email', errorId: 'emailError', message: 'Пожалуйста, введите корректный email' },
        { id: 'phone', errorId: 'phoneError', message: 'Пожалуйста, введите номер телефона' },
        { id: 'birthDate', errorId: 'birthDateError', message: 'Пожалуйста, введите дату рождения' },
        { id: 'city', errorId: 'cityError', message: 'Пожалуйста, введите город' },
        { id: 'institution', errorId: 'institutionError', message: 'Пожалуйста, введите учебное заведение' }
    ];
    
    // Если это родитель, проверяем телефон ребенка
    if (userTypeInput.value === 'parent') {
        requiredFields.push({ 
            id: 'childPhone', 
            errorId: 'childPhoneError', 
            message: 'Пожалуйста, введите номер телефона ребенка' 
        });
    }
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);
        
        if (!input.value.trim()) {
            input.classList.add('error');
            error.textContent = field.message;
            error.classList.add('show');
            isValid = false;
        }
    });
    
    // Проверка email
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        document.getElementById('email').classList.add('error');
        document.getElementById('emailError').textContent = 'Пожалуйста, введите корректный email';
        document.getElementById('emailError').classList.add('show');
        isValid = false;
    }
    
    return isValid;
}

// Обновление данных для просмотра на шаге 3
function updateReviewData() {
    const userTypeLabels = {
        'student': 'Студент',
        'parent': 'Родитель',
        'teacher': 'Учитель'
    };
    
    const userType = userTypeLabels[userTypeInput.value] || userTypeInput.value;
    
    let reviewHTML = `
        <div style="margin-bottom: 20px;">
            <strong>Тип аккаунта:</strong> ${userType}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>ФИО:</strong> ${document.getElementById('fullName').value}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Email:</strong> ${document.getElementById('email').value}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Телефон:</strong> ${document.getElementById('phone').value}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Дата рождения:</strong> ${formatDate(document.getElementById('birthDate').value)}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Город:</strong> ${document.getElementById('city').value}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Учебное заведение:</strong> ${document.getElementById('institution').value}
        </div>
    `;
    
    if (userTypeInput.value === 'parent') {
        reviewHTML += `
            <div style="margin-bottom: 20px;">
                <strong>Телефон ребенка:</strong> ${document.getElementById('childPhone').value}
            </div>
        `;
        
        if (document.getElementById('childName').value) {
            reviewHTML += `
                <div style="margin-bottom: 20px;">
                    <strong>Имя ребенка:</strong> ${document.getElementById('childName').value}
                </div>
            `;
        }
    }
    
    reviewData.innerHTML = reviewHTML;
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Обработка отправки формы
registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Проверяем согласие с условиями
    if (!document.getElementById('agreeTerms').checked) {
        document.getElementById('termsError').classList.add('show');
        return;
    }
    
    document.getElementById('termsError').classList.remove('show');
    
    // Имитация отправки формы
    submitFormBtn.disabled = true;
    submitFormBtn.textContent = 'Отправка...';
    
    // Имитация запроса на сервер
    setTimeout(() => {
        // В реальном приложении здесь был бы fetch/axios запрос
        
        // Показываем сообщение об успехе
        alert('Регистрация успешно завершена! На ваш email отправлено письмо с подтверждением.');
        
        // Сброс формы (в реальном приложении перенаправление на другую страницу)
        registrationForm.reset();
        userTypeCards.forEach(card => card.classList.remove('selected'));
        parentFields.classList.remove('show');
        userTypeInput.value = '';
        goToStep(1);
        
        submitFormBtn.disabled = false;
        submitFormBtn.textContent = 'Зарегистрироваться';
    }, 1500);
});

// Инициализация формы
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем минимальную дату рождения (например, 100 лет назад)
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate()); // минимум 5 лет
    
    const birthDateInput = document.getElementById('birthDate');
    birthDateInput.min = minDate.toISOString().split('T')[0];
    birthDateInput.max = maxDate.toISOString().split('T')[0];
    
    // Устанавливаем дату по умолчанию (например, 18 лет назад)
    const defaultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    birthDateInput.value = defaultDate.toISOString().split('T')[0];
});
import React from 'react';

function ProgressSteps({ currentStep }) {
  return (
    <>
      <div className="registration-steps">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`step ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}
            id={`step${step}`}
          >
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 ? 'Выбор типа' : step === 2 ? 'Основные данные' : 'Завершение'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            id="progressFill"
            style={{ width: `${(currentStep - 1) * 50}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>Шаг {currentStep} из 3</span>
          <span id="progressPercent">{Math.round((currentStep - 1) * 50)}%</span>
        </div>
      </div>
    </>
  );
}

export default ProgressSteps;
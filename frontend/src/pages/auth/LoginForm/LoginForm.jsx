import { useState } from "react";

function LoginForm() {

  // Состояния для полей ввода
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Обработчик отправки формы
  const handleSubmit = (event) => {
    event.preventDefault(); // чтобы страница не перезагружалась

    // Пока просто выводим данные в консоль.
    // TODO: отправка формы на сервер
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Авторизация</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

// Простые стили прямо в файле (чтобы не усложнять)
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
    width: 300,
    borderRadius: 8,
  },
  input: {
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
};

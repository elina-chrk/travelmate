import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // імпортуємо useNavigate
import './RegisterPage.css';

function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // ініціалізуємо навігацію

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Невірний формат email").required("Обовʼязкове поле"),
      username: Yup.string().min(4, "Мінімум 4 символи").required("Обовʼязкове поле"),
      firstName: Yup.string().required("Обовʼязкове поле"),
      lastName: Yup.string().required("Обовʼязкове поле"),
      password: Yup.string().min(6, "Мінімум 6 символів").required("Обовʼязкове поле"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Паролі повинні збігатися")
        .required("Підтвердження пароля є обовʼязковим"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post('/Registration/register', {
          Email: values.email,
          Username: values.username,
          Password: values.password,
          FirstName: values.firstName,
          LastName: values.lastName,
        });

        setSuccessMessage("Чудово! Підтвердіть реєстрацію у листі на електронній пошті");
        setErrorMessage("");
        formik.resetForm();
      } catch (error) {
        console.error("Помилка реєстрації:", error);
        if (error.response?.data?.errorMessage) {
          setErrorMessage(error.response.data.errorMessage);
        } else {
          setErrorMessage("Сталася помилка. Спробуйте ще раз.");
        }
        setSuccessMessage("");
      }
    },
  });

  return (
    <div className="register-wrapper">
      <form onSubmit={formik.handleSubmit} className="register-form">
        <h2 className="register-title">Реєстрація</h2>

        {["email", "username", "firstName", "lastName"].map((field) => (
          <div className="form-group" key={field}>
            <label>
              {{
                email: "Email",
                username: "Імʼя користувача",
                firstName: "Імʼя",
                lastName: "Прізвище",
              }[field]}
            </label>
            <input
              type="text"
              name={field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
            />
            {formik.touched[field] && formik.errors[field] && (
              <div className="form-error">{formik.errors[field]}</div>
            )}
          </div>
        ))}

        {["password", "confirmPassword"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field === "password" ? "Пароль" : "Підтвердіть пароль"}</label>
            <input
              type="password"
              name={field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
            />
            {formik.touched[field] && formik.errors[field] && (
              <div className="form-error">{formik.errors[field]}</div>
            )}
          </div>
        ))}

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="form-error">{errorMessage}</div>
        )}

        <button type="submit" className="register-button">
          Зареєструватись
        </button>

        <button
          type="button"
          className="login-button"
          onClick={() => navigate("/login")} 
        >
          Увійти в акаунт
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

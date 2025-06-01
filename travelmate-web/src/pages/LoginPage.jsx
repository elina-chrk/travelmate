import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/axiosInstance';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      emailOrUsername: '',
      password: '',
    },
    validationSchema: Yup.object({
      emailOrUsername: Yup.string().required('Email або імʼя користувача — обовʼязково'),
      password: Yup.string().min(6, 'Мінімум 6 символів').required('Обовʼязкове поле'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post('/Auth/login', {
          emailOrUsername: values.emailOrUsername,
          password: values.password,
        });

        const token = response.data.token;
        localStorage.setItem('token', token);
        login(token);
        navigate('/');
      } catch (error) {
        console.error('Помилка входу:', error);
        setErrorMessage('Невірний email/username або пароль');
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={formik.handleSubmit} className="login-form">
        <h2 className="login-title">Авторизація</h2>

        <div className="form-group">
          <label>Email або Username</label>
          <input
            type="text"
            name="emailOrUsername"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.emailOrUsername}
          />
          {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
            <div className="form-error">{formik.errors.emailOrUsername}</div>
          )}
        </div>

        <div className="form-group">
          <label>Пароль</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <button
            type="button"
            className="toggle-password-text"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Сховати пароль' : 'Показати пароль'}
          </button>
          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
          )}
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <button type="submit" className="login-button">
          Увійти
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

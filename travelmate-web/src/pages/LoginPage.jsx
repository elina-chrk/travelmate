import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from '../api/axiosInstance'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom' 

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate() 

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
      })

        const token = response.data.token
        localStorage.setItem('token', token)
        login(token)

        // Переход на головну
        navigate('/')
      } catch (error) {
        console.error('Помилка входу:', error)
        setErrorMessage('Невірний email/username або пароль')
      }
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Авторизація</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email або Username</label>
          <input
            type="text"
            name="emailOrUsername"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.emailOrUsername}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.emailOrUsername && formik.errors.emailOrUsername && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.emailOrUsername}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Пароль</label>
          <input
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Увійти
        </button>
      </form>
    </div>
  )
}

export default LoginPage

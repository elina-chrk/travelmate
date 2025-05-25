import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../api/axiosInstance"
import { useState } from "react";

function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      email: Yup.string()
        .email("Невірний формат email")
        .required("Обовʼязкове поле"),
      username: Yup.string()
        .min(4, "Мінімум 4 символи")
        .required("Обовʼязкове поле"),
      firstName: Yup.string().required("Обовʼязкове поле"),
      lastName: Yup.string().required("Обовʼязкове поле"),
      password: Yup.string()
        .min(6, "Мінімум 6 символів")
        .required("Обовʼязкове поле"),
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
  LastName: values.lastName
})

    setSuccessMessage('Реєстрація успішна! Тепер увійдіть.')
    setErrorMessage('')
    formik.resetForm()
  } catch (error) {
    console.error('Помилка реєстрації:', error)

    // Якщо API повертає повідомлення про помилку
    if (error.response?.data?.errorMessage) {
      setErrorMessage(error.response.data.errorMessage)
    } else {
      setErrorMessage('Сталася помилка. Спробуйте ще раз.')
    }

    setSuccessMessage('')
  }
}
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Реєстрація</h2>

        {["email", "username", "firstName", "lastName"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {field === "email"
                ? "Email"
                : field === "username"
                ? "Імʼя користувача"
                : field === "firstName"
                ? "Імʼя"
                : "Прізвище"}
            </label>
            <input
              type="text"
              name={field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </div>
            )}
          </div>
        ))}

        {["password", "confirmPassword"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              {field === "password" ? "Пароль" : "Підтвердіть пароль"}
            </label>
            <input
              type="password"
              name={field}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field]}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched[field] && formik.errors[field] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[field]}
              </div>
            )}
          </div>
        ))}

        {successMessage && (
          <div className="text-green-600 text-sm mb-4">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Зареєструватись
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

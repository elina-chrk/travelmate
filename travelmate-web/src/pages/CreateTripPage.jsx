import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function CreateTripPage() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Назва обовʼязкова'),
      startTime: Yup.date().required('Початкова дата обовʼязкова'),
      endTime: Yup.date()
        .min(Yup.ref('startTime'), 'Кінцева дата повинна бути пізнішою за початкову')
        .required('Кінцева дата обовʼязкова')
    }),
    onSubmit: async (values) => {
  try {
    const payload = {
  ...values,
  startTime: new Date(values.startTime).toISOString(),
  endTime: new Date(values.endTime).toISOString(),
  routePoints: [
    {
      latitude: 50.4501,
      longitude: 30.5234,
      name: "Старт",
      description: "Стартова точка маршруту",
      order: 1,
    },
  ],
};

    await axiosInstance.post('/travel-groups', payload);
    alert('Подорож створено!');
    navigate('/');
  } catch (error) {
  console.error('Помилка створення подорожі:', error);
  console.log('Вміст помилки від сервера:', error.response?.data); 
  alert('Помилка при створенні подорожі');
}
}

  });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">Створити нову подорож</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Назва подорожі</label>
          <input
            type="text"
            name="title"
            className="w-full border px-3 py-2 rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Опис</label>
          <textarea
            name="description"
            className="w-full border px-3 py-2 rounded"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Початок</label>
          <input
            type="datetime-local"
            name="startTime"
            className="w-full border px-3 py-2 rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startTime}
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <p className="text-red-500 text-sm">{formik.errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium">Завершення</label>
          <input
            type="datetime-local"
            name="endTime"
            className="w-full border px-3 py-2 rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endTime}
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <p className="text-red-500 text-sm">{formik.errors.endTime}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Створити подорож
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;

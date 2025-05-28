import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './CreateTripPage.css';

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
        alert('Помилка при створенні подорожі');
      }
    }
  });

  return (
    <div className="create-trip-wrapper">
      <form onSubmit={formik.handleSubmit} className="create-trip-form">
        <button
        type="button"
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Назад
      </button>
        <h1 className="form-title">Створити нову подорож</h1>

        <div className="form-group">
          <label>Назва подорожі</label>
          <input
            type="text"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="form-error">{formik.errors.title}</p>
          )}
        </div>

        <div className="form-group">
          <label>Опис</label>
          <textarea
            name="description"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
        </div>

        <div className="form-group">
          <label>Початок</label>
          <input
            type="datetime-local"
            name="startTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startTime}
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <p className="form-error">{formik.errors.startTime}</p>
          )}
        </div>

        <div className="form-group">
          <label>Завершення</label>
          <input
            type="datetime-local"
            name="endTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endTime}
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <p className="form-error">{formik.errors.endTime}</p>
          )}
        </div>

        <button type="submit" className="form-submit">
          Створити подорож
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;

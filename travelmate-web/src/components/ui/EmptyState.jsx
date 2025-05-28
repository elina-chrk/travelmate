import './EmptyState.css';

function EmptyState({ title = "Нічого не знайдено", message = "Спробуйте пізніше або створіть новий запис." }) {
  return (
    <div className="empty-state">
      <p className="empty-state-title">😔 {title}</p>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;

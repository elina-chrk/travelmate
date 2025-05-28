import './SecondaryButton.css';

function SecondaryButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`secondary-button ${className}`}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;

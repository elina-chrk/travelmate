import './PurpleButton.css';

function PurpleButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`purple-button ${className}`}
    >
      {children}
    </button>
  );
}

export default PurpleButton;

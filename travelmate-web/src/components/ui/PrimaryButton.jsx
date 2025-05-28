import './PrimaryButton.css';

function PrimaryButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`primary-button ${className}`}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;

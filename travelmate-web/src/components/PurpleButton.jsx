function PurpleButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition ${className}`}
    >
      {children}
    </button>
  );
}

export default PurpleButton;
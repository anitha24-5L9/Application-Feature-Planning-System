import "../styles/modal.css";

function FlagModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-container">

        <div className="modal-header">

          <h2>Create Feature Flag</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="modal-body">

          {children}

        </div>

      </div>

    </div>
  );
}

export default FlagModal;
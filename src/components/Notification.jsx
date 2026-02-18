import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ type = 'success', message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {type === 'success' ? (
        <CheckCircle size={24} color="#10b981" />
      ) : (
        <XCircle size={24} color="#ef4444" />
      )}
      <span style={{ flex: 1, color: '#374151' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px'
        }}
      >
        <X size={18} color="#6b7280" />
      </button>
    </div>
  );
};

export default Notification;

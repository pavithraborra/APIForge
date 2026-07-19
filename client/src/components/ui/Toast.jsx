import React, { createContext, useContext, useState, useCallback } from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamation, HiX } from 'react-icons/hi';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Return no-op if used outside provider (e.g., during static pages)
    return { addToast: () => {}, removeToast: () => {} };
  }
  return context;
};

const icons = {
  success: HiCheckCircle,
  error: HiXCircle,
  info: HiInformationCircle,
  warning: HiExclamation,
};

const colorMap = {
  success: { bg: 'rgba(136,201,161,0.12)', border: 'rgba(136,201,161,0.4)', text: '#2d6a4f', icon: '#88C9A1' },
  error:   { bg: 'rgba(233,122,122,0.12)', border: 'rgba(233,122,122,0.4)', text: '#9b2335', icon: '#E97A7A' },
  info:    { bg: 'rgba(244,177,131,0.12)', border: 'rgba(244,177,131,0.4)', text: '#9c5a1d', icon: '#F4B183' },
  warning: { bg: 'rgba(242,184,128,0.12)', border: 'rgba(242,184,128,0.4)', text: '#7d4e00', icon: '#F2B880' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast stack */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '360px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || HiInformationCircle;
          const colors = colorMap[toast.type] || colorMap.info;
          return (
            <div
              key={toast.id}
              style={{
                background: 'rgba(255,255,255,0.97)',
                border: `1px solid ${colors.border}`,
                borderLeft: `4px solid ${colors.icon}`,
                borderRadius: '14px',
                padding: '14px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                pointerEvents: 'all',
                animation: 'slideInToast 0.3s ease forwards',
              }}
            >
              <Icon style={{ color: colors.icon, flexShrink: 0, width: 22, height: 22, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: colors.text }}>{toast.title}</p>
                {toast.message && (
                  <p style={{ margin: '3px 0 0', fontSize: 13, color: '#706864', lineHeight: 1.4 }}>{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#A0958D',
                  padding: 2,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <HiX style={{ width: 16, height: 16 }} />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(80px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

import { createContext, useContext, useState, useCallback } from "react";
import AlertContainer from "./AlertContainer";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const addAlert = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    const newAlert = { id, message, type, duration };
    
    setAlerts(prev => [...prev, newAlert]);

    // Auto remove after duration
    setTimeout(() => {
      removeAlert(id);
    }, duration);

    return id;
  }, [removeAlert]);

  // Convenience methods
  const success = useCallback((message, duration) => addAlert(message, "success", duration), [addAlert]);
  const error = useCallback((message, duration) => addAlert(message, "error", duration), [addAlert]);
  const warning = useCallback((message, duration) => addAlert(message, "warning", duration), [addAlert]);
  const info = useCallback((message, duration) => addAlert(message, "info", duration), [addAlert]);

  const value = {
    alerts,
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertContainer alerts={alerts} onRemove={removeAlert} />
    </AlertContext.Provider>
  );
};

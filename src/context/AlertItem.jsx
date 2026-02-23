const AlertItem = ({ alert, onRemove }) => {
  const { id, message, type } = alert;

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/10 border-green-500/30",
          icon: "✅",
          text: "text-green-400"
        };
      case "error":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          icon: "❌",
          text: "text-red-400"
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/30",
          icon: "⚠️",
          text: "text-yellow-400"
        };
      default:
        return {
          bg: "bg-blue-500/10 border-blue-500/30",
          icon: "ℹ️",
          text: "text-blue-400"
        };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`pointer-events-auto min-w-[320px] max-w-[400px] p-4 rounded-xl border backdrop-blur-md shadow-lg transform transition-all duration-300 animate-slide-in ${styles.bg}`}
      style={{
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{styles.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.text} break-words`}>
            {message}
          </p>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          ✕
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-0.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'} animate-shrink`}
          style={{
            animation: `shrink ${alert.duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};

export default AlertItem;

import AlertItem from "./AlertItem";

const AlertContainer = ({ alerts, onRemove }) => {
  return (
    <div className="fixed top-24 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default AlertContainer;

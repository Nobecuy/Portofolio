import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import { AlertProvider } from "./context/AlertContext";
import AuroraBackground from "./components/AuroraBackground";

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        {/* Aurora Background Effect */}
        <AuroraBackground />
        
        {/* Main App Routes */}
        <AppRoutes />
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;

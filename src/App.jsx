import { ThemeProvider } from "./context/ThemeContext";
import { AlertProvider } from "./context/AlertContext";
import AuroraBackground from "./components/AuroraBackground";
import OnePage from "./pages/user/OnePage";

function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        {/* Aurora Background Effect */}
        <AuroraBackground />
        
        {/* Temporarily bypass router for testing */}
        <OnePage />
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;

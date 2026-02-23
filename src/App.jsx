import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AlertProvider } from "./context/AlertContext";
import AuroraBackground from "./components/AuroraBackground";
import OnePage from "./pages/user/OnePage";

function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <AlertProvider>
          {/* Aurora Background Effect */}
          <AuroraBackground />
          
          {/* Portfolio Page */}
          <OnePage />
        </AlertProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Custom CSS for parallax effect and other styles
const customStyle = document.createElement('style');
customStyle.textContent = `
  .parallax {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  
  html {
    scroll-behavior: smooth;
  }

  .font-display {
    font-family: 'Playfair Display', serif;
  }

  .font-body {
    font-family: 'Roboto', sans-serif;
  }
`;

document.head.appendChild(customStyle);

createRoot(document.getElementById("root")!).render(<App />);

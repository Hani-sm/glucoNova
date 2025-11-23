import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found! Cannot mount React app.');
  document.body.innerHTML = '<div style="background: #0a0a0a; color: white; padding: 20px; font-family: monospace;">ERROR: Root element not found. React app cannot start.</div>';
} else {
  console.log('Root element found, attempting to render React app...');
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Failed to render React app:', error);
    const errorStack = error instanceof Error ? error.stack : String(error);
    rootElement.innerHTML = `
      <div style="background: linear-gradient(to bottom right, rgb(23, 23, 23), rgb(24, 24, 27), rgb(10, 10, 10)); color: white; padding: 40px; font-family: monospace; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; max-width: 600px;">
          <h1 style="font-size: 24px; margin-bottom: 20px; color: #2dd4bf;">⚠️ GlucoNova - Initialization Error</h1>
          <p style="color: #ff6b6b; margin-bottom: 20px; font-size: 16px;">Failed to initialize the application</p>
          <details style="text-align: left; margin-top: 20px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border-left: 3px solid #ff6b6b;">
            <summary style="cursor: pointer; color: #2dd4bf; font-weight: bold; margin-bottom: 10px;">Error Details (Click to expand)</summary>
            <pre style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; overflow-x: auto; margin-top: 10px; font-size: 12px; color: #ff6b6b;">${errorStack}</pre>
          </details>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">📋 Check the browser console (F12 → Console tab) for detailed error information</p>
        </div>
      </div>
    `;
  }
}

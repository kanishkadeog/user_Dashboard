import React from "react"; // Import core React library
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering the app to the DOM
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for client-side routing
import App from "./App"; // Import main App component
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling

// Create root element and render the React app
const root = ReactDOM.createRoot(document.getElementById("root")); // Select root element in index.html
root.render(
  <React.StrictMode> {/* StrictMode helps highlight potential problems in the app */}
    <BrowserRouter> {/* Wrap App in BrowserRouter to enable routing */}
      <App /> {/* Render the main App component */}
    </BrowserRouter>
  </React.StrictMode>
);

import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "mobx-react";
import weatherStore from "./stores/WeatherStore";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <Provider weatherStore={weatherStore}>
        <App />
    </Provider>
);

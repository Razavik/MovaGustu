import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createPortal } from "react-dom";

const root = document.getElementById("root")

createRoot(root!).render(createPortal(<App />, document.querySelector("main.page-main") ?? root!));

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createPortal } from "react-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const root = document.getElementById("root")
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false
        }
    }
});

createRoot(root!).render(
    createPortal(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>,
        document.querySelector("main.page-main") ?? root!
    ));

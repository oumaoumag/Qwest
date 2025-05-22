import { createContext, useContext, useState } from "react";

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 3000); 
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
        {children}
        {message && <div className="toast">{message}</div>}
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
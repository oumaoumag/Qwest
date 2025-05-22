import { createContext, useContext, useState } from "react";

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); 
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
        {children}
        {toastMessage && (
            <div className="fixed bottom-4 left-1/2 transform-translate-x-1/2 bg-[var(--app-accent)] text-white px-4 py-2 rounded-lg shadow-lg">
                {toastMessage}
            </div>
        )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
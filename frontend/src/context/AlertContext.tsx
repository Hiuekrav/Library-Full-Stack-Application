import React, { createContext, useState, ReactNode } from 'react';

// Definiowanie typu dla stanu błędu
export interface AlertMessageContextType {
    errorMessage: string;
    showFailed: boolean;
    setErrorMessage: (message: string) => void;
    setShowFailed: (show: boolean) => void;
    successMessage: string;
    showSuccess: boolean;
    setSuccessMessage: (message: string) => void;
    setShowSuccess: (show: boolean) => void;
}

// Inicjalizacja kontekstu
const AlertContext = createContext<AlertMessageContextType | undefined>(undefined);

interface ErrorProviderProps {
    children: ReactNode;
}

// Provider dla kontekstu
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFailed, setShowFailed] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const value = {
        errorMessage,
        showFailed,
        setErrorMessage,
        setShowFailed,
        // success alert
        successMessage,
        setSuccessMessage,
        showSuccess,
        setShowSuccess
    };

    return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

// Custom hook do dostępu do kontekstu
export const useErrorContext = (): AlertMessageContextType => {
    const context = React.useContext(AlertContext);
    if (!context) {
        throw new Error('useErrorContext must be used within an ErrorProvider');
    }
    return context;
};

// src/contexts/SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Portal } from "react-native-paper";

interface SnackbarContextData {
    showMessage: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [duration, setDuration] = useState(3000);

    const showMessage = (msg: string, dur: number = 3000) => {
        setMessage(msg);
        setDuration(dur);
        setVisible(true);
    };

    const onDismiss = () => setVisible(false);

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Portal>
                <Snackbar
                    visible={visible}
                    onDismiss={onDismiss}
                    duration={duration}
                    action={{
                        label: "Ok",
                        onPress: () => {
                            setVisible(false);
                        },
                    }}
                >
                    {message}
                </Snackbar>
            </Portal>
        </SnackbarContext.Provider>
    );
};

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
}

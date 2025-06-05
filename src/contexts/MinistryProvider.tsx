import React, { createContext, useContext, useEffect, useState } from "react";

interface MinistryContextProps {
    currentMinistryId: string;
    setCurrentMinistryId: (id: string) => void;
}

const MinistryContext = createContext<MinistryContextProps>({
    currentMinistryId: "core", // padrão inicial
    setCurrentMinistryId: () => {},
});

export const MinistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentMinistryId, setCurrentMinistryId] = useState<string>("core");

    // Se quiser salvar no asyncStorage para manter entre sessões, adicione aqui depois

    return (
        <MinistryContext.Provider value={{ currentMinistryId, setCurrentMinistryId }}>
            {children}
        </MinistryContext.Provider>
    );
};

export const useMinistry = () => useContext(MinistryContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "currentMinistry";

interface Ministry {
  id: string;
  name: string;
  type: "core" | "louvor" | "celula" | "default" | string;
}

interface MinistryContextProps {
  currentMinistry: Ministry | null;
  setCurrentMinistry: (ministry: Ministry) => void;
  loading: boolean;
}

const MinistryContext = createContext<MinistryContextProps>({
  currentMinistry: null,
  setCurrentMinistry: () => {},
  loading: true,
});

export const MinistryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMinistry, setCurrentMinistryState] = useState<Ministry | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMinistry = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: Ministry = JSON.parse(saved);
          setCurrentMinistryState(parsed);
        }
      } catch (err) {
        console.error("Erro ao carregar o ministério atual:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMinistry();
  }, []);

  const setCurrentMinistry = async (ministry: Ministry) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ministry));
      setCurrentMinistryState(ministry);
    } catch (err) {
      console.error("Erro ao salvar ministério:", err);
    }
  };

  return (
    <MinistryContext.Provider
      value={{ currentMinistry, setCurrentMinistry, loading }}
    >
      {children}
    </MinistryContext.Provider>
  );
};

export const useMinistry = () => useContext(MinistryContext);

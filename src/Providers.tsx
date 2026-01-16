import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

interface CardanoWallet {
  address?: string;
  connected: boolean;
  loading: boolean;
  error?: string;
}

interface CardanoContextType {
  wallet: CardanoWallet;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
}

const CardanoContext = createContext<CardanoContextType | undefined>(undefined);

export const useCardanoWallet = () => {
  const context = useContext(CardanoContext);
  if (!context) {
    throw new Error('useCardanoWallet must be used within CardanoProvider');
  }
  return context;
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<CardanoWallet>({
    address: undefined,
    connected: false,
    loading: false,
    error: undefined,
  });

  const connectWallet = async (walletName: string) => {
    setWallet(prev => ({ ...prev, loading: true, error: undefined }));
    try {
      // Detect available Cardano wallets (Nami, Eternl, Flint, etc.)
      const cardano = (window as any).cardano;
      
      if (!cardano) {
        throw new Error('No Cardano wallet detected. Please install Nami, Eternl, or Flint.');
      }

      const walletApi = cardano[walletName.toLowerCase()];
      if (!walletApi) {
        throw new Error(`Wallet "${walletName}" not found. Available wallets: ${Object.keys(cardano).join(', ')}`);
      }

      // Enable wallet and get address
      const enabled = await walletApi.enable();
      const addresses = await enabled.getUsedAddresses();
      
      if (addresses.length === 0) {
        throw new Error('No addresses found in wallet');
      }

      setWallet({
        address: addresses[0],
        connected: true,
        loading: false,
        error: undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setWallet(prev => ({
        ...prev,
        connected: false,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: undefined,
      connected: false,
      loading: false,
      error: undefined,
    });
  };

  return (
    <CardanoContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </CardanoContext.Provider>
  );
}

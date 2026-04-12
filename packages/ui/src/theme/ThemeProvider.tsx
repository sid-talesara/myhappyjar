import React, { createContext, useContext } from 'react';
import { tokens, Tokens } from '../tokens';

const ThemeContext = createContext<Tokens>(tokens);

export interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: Partial<Tokens>;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const value = theme ? { ...tokens, ...theme } : tokens;
  return (
    <ThemeContext.Provider value={value as Tokens}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}

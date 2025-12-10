import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define o tipo do contexto do tema
interface ThemeContextType {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	// Estado do tema
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const saved = localStorage.getItem('darkMode');
		return saved === 'true';
	});

	useEffect(() => {
		// Atualiza localStorage e classe do html
		localStorage.setItem('darkMode', isDarkMode.toString());
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode(prev => !prev);
	};

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	// Hook para acessar o contexto do tema
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme deve ser usado dentro de ThemeProvider');
	}
	return context;
};

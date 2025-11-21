// tailwind.config.js
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define a fonte Poppins para ser usada com `font-poppins` ou `font-sans`
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      // Define as cores diretamente
      colors: {
        border: '#E0E0E0',     // Cinza claro para bordas
        input: '#E0E0E0',      // Cinza claro para inputs
        ring: '#0060FF',       // Azul para anel de foco
        background: '#FAFAFA', // Fundo principal (quase branco)
        foreground: '#0A1C3E', // Texto principal (azul escuro)
        
        primary: {
          DEFAULT: '#0060FF', // Azul primário
          foreground: '#FFFFFF', // Texto branco para botões primários
        },
        secondary: {
          DEFAULT: '#F0F5FA', // Azul bem claro para fundos secundários
          foreground: '#1E3A8A', // Texto azul escuro para fundos secundários
        },
        destructive: {
          DEFAULT: '#E53E3E', // Vermelho para botões de "excluir"
          foreground: '#FFFFFF', // Texto branco
        },
        muted: {
          DEFAULT: '#F0F5FA', // Fundo "mudo" (cinza-azulado)
          foreground: '#6B7280', // Texto "mudo" (cinza)
        },
        accent: {
          DEFAULT: '#EBF5FF', // Cor de "hover" (azul muito claro)
          foreground: '#1E3A8A', // Texto para "hover"
        },
        card: {
          DEFAULT: '#FFFFFF', // Fundo dos cards (branco)
          foreground: '#0A1C3E', // Texto dos cards (azul escuro)
        },
        popover: {
          DEFAULT: '#FFFFFF', // Fundo dos popovers (branco)
          foreground: '#0A1C3E', // Texto dos popovers
        },
        
        // Cores específicas da Sidebar
        sidebar: {
          DEFAULT: '#FFFFFF', // Fundo da sidebar (branco)
          foreground: '#334155', // Texto da sidebar (cinza escuro)
          accent: '#F1F5F9', // Fundo do item em hover (cinza claro)
          border: '#E5E7EB', // Cor da borda direita da sidebar
        },
      },
      // Configuração do modo escuro (Dark Mode)
      // O Tailwind aplicará isso quando a classe 'dark' estiver no <html>
      dark: {
        colors: {
          border: '#2D3748',
          input: '#2D3748',
          ring: '#3B82F6',
          background: '#1A202C', // Fundo escuro
          foreground: '#E2E8F0', // Texto claro
          
          primary: {
            DEFAULT: '#3B82F6', // Azul mais brilhante para dark mode
            foreground: '#FFFFFF',
          },
          secondary: {
            DEFAULT: '#2D3748',
            foreground: '#E2E8F0',
          },
          // ... (outras cores do dark mode) ...
          card: {
            DEFAULT: '#1F2937', // Fundo dos cards (cinza escuro)
            foreground: '#E2E8F0', // Texto dos cards (claro)
          },
          sidebar: {
            DEFAULT: '#111827', // Fundo da sidebar (preto/cinza)
            foreground: '#9CA3AF', // Texto (cinza claro)
            accent: '#1F2937', // Hover (cinza escuro)
            border: '#374151', // Borda
          },
        }
      }
    },
  },
  plugins: [tailwindcssAnimate],
};
'use client';

import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ToggleThemeButton() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Marca que o componente já montou no client
  }, []);

  if (!mounted) {
    // Durante a renderização server-side, não renderiza o ícone para evitar divergência
    return <div className="fixed bottom-6 right-6 w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse z-50" />;
  }

  return (
    <button
      onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
      className="fixed top-6 right-6 w-14 h-14 rounded-full z-50 bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 dark:shadow-purple-500/25 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-0 outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      aria-label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {colorScheme === 'dark' ? <Sun size={24} className="text-white" /> : <Moon size={24} className="text-white" />}
    </button>
  );
}

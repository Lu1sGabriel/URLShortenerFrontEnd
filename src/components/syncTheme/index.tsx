'use client';

import { useComputedColorScheme } from '@mantine/core';
import { useEffect } from 'react';

export function SyncTheme() {
  const colorScheme = useComputedColorScheme();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', colorScheme);
    root.classList.remove('light', 'dark'); // Limpa para evitar conflito
    root.classList.add(colorScheme);
  }, [colorScheme]);

  return null;
}

import '@mantine/core/styles.css';
import '@/app/globals.css';

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core';
import { SyncTheme } from '@/components/syncTheme';
import { ToggleThemeButton } from '@/components/toglleThemebutton';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" {...mantineHtmlProps} className="h-full">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full">
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications />
          <SyncTheme />
          <ToggleThemeButton />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

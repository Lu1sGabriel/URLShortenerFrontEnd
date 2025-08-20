'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import authService from '@/services/auth/authService';

interface UseAuthCheckOptions {
  /** Path para redirecionamento caso necessário (default: '/') */
  redirectPath?: string;
  /** Habilitar polling de verificação de sessão (default: true) */
  enablePolling?: boolean;
  /** Intervalo de polling em minutos (default: 10) */
  intervalMinutes?: number;
  /** Se for página pública (login, registro), não dispara notificação quando não logado */
  isPublicPage?: boolean;
  /** Se for página pública, redireciona caso usuário esteja logado */
  redirectIfUserIsLoggedIn?: boolean;
}

export default function useAuthCheck(options: UseAuthCheckOptions = {}) {
  const {
    redirectPath = '/',
    enablePolling = true,
    intervalMinutes = 10,
    isPublicPage = false,
    redirectIfUserIsLoggedIn: redirectIfLoggedIn = false,
  } = options;

  const router = useRouter();
  const firstCheckDone = useRef(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkAuth = async () => {
      const result = await authService.getAuthStatus();

      const loggedIn = result.success && result.data?.authenticated;

      if (!loggedIn) {
        if (firstCheckDone.current && !isPublicPage) {
          // Sessão expirada em página protegida
          notifications.show({
            title: 'Session expired',
            message: 'Sua sessão expirou. Por favor, faça login novamente.',
            color: 'red',
            position: 'top-right',
            autoClose: 4000,
            withCloseButton: false,
          });
        }

        // Redireciona se não autenticado e não é página pública
        if (!isPublicPage) {
          router.push(redirectPath);
        }
      } else {
        // Usuário está logado
        if (isPublicPage && redirectIfLoggedIn) {
          // Redireciona usuário logado de páginas públicas (login, registro)
          router.push(redirectPath);
        }
      }

      firstCheckDone.current = true;
    };

    // Checagem inicial
    checkAuth();

    // Polling periódico
    if (enablePolling) {
      intervalId = setInterval(checkAuth, intervalMinutes * 60 * 1000);
    }

    return () => clearInterval(intervalId);
  }, [router, redirectPath, enablePolling, intervalMinutes, isPublicPage, redirectIfLoggedIn]);
}

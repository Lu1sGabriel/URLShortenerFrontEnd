'use client';

import { useAuthorization } from '@/shared/hooks/useAuthorization';
import { ReactNode } from 'react';

interface AuthorizedProps {
  authority?: string; // para checar 1 permissão
  anyOf?: string[]; // pelo menos 1
  allOf?: string[]; // todas
  fallback?: ReactNode;
  children: ReactNode;
}

export function Authorized({ authority, anyOf, allOf, fallback = null, children }: AuthorizedProps) {
  const { hasAuthority, hasAnyAuthority, hasAllAuthorities } = useAuthorization();

  let allowed = true;

  if (authority) {
    allowed = hasAuthority(authority);
  } else if (anyOf) {
    allowed = hasAnyAuthority(anyOf);
  } else if (allOf) {
    allowed = hasAllAuthorities(allOf);
  }

  return <>{allowed ? children : fallback}</>;
}

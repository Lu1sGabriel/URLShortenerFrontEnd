import { useUser } from '@/app/context/user';

export function useAuthorization() {
  const { authorities } = useUser();

  const hasAuthority = (authority: string) => authorities.includes(authority);

  const hasAnyAuthority = (required: string[]) => required.some((a) => authorities.includes(a));

  const hasAllAuthorities = (required: string[]) => required.every((a) => authorities.includes(a));

  return { hasAuthority, hasAnyAuthority, hasAllAuthorities };
}

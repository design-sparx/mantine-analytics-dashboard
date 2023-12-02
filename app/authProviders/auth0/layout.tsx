import { ReactNode } from 'react';
import { Providers } from '@/providers/session';

type Auth0LayoutProps = {
  children: ReactNode;
};

export default function Auth0Layout({ children }: Auth0LayoutProps) {
  return <Providers>{children}</Providers>;
}

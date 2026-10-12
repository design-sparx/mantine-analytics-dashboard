import { SignIn } from './SignIn';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function Page() {
  return <SignIn />;
}

import { PasswordReset } from './PasswordReset';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Reset',
};

export default function Page() {
  return <PasswordReset />;
}

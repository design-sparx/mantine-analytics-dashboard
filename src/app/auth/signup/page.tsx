import { SignUp } from './SignUp';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up',
};

export default function Page() {
  return <SignUp />;
}

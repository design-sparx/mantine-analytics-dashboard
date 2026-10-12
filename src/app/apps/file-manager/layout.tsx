import { ReactNode } from 'react';

import FileManagerLayout from './FileManagerLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <FileManagerLayout>{children}</FileManagerLayout>;
}

import { FileManager } from './FileManager';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Manager',
};

export default function Page() {
  return <FileManager />;
}

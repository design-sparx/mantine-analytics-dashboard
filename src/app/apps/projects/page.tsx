import { Projects } from './Projects';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
};

export default function Page() {
  return <Projects />;
}

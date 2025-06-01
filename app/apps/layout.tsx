import { ReactNode } from 'react';

import { MainLayout } from '@/layouts/Main';

export type SidebarState = 'hidden' | 'mini' | 'full';

type Props = {
  children: ReactNode;
};

function AppsLayout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

export default AppsLayout;

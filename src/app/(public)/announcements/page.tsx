import { AnnouncementsPage } from './AnnouncementsPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Announcements',
  description: 'Release announcements and upgrade notes for the dashboard.',
};

export default function Page() {
  return <AnnouncementsPage />;
}

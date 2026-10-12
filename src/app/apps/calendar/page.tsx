import { Calendar } from './Calendar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CalendarView',
};

export default function Page() {
  return <Calendar />;
}

'use client';

import dynamic from 'next/dynamic';

const LanguageTable = dynamic(
  () =>
    import('@/components/language-table/LanguageTable').then(
      (mod) => mod.default,
    ),
  {
    ssr: false,
    loading: () => <div style={{ height: '400px' }} />,
  },
);

export default LanguageTable;

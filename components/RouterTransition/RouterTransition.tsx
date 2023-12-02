'use client';
// components/RouterTransition.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NavigationProgress, nprogress } from '@mantine/nprogress';

const RouterTransition = () => {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && nprogress.start();
    const handleComplete = () => nprogress.complete();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.asPath]);

  return <NavigationProgress color="dark.8" />;
};

export default RouterTransition;

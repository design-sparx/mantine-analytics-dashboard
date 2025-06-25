import GuestLayout from '@/layouts/Guest';

function Layout({ children }: { children: React.ReactNode }) {
  return <GuestLayout>{children}</GuestLayout>;
}

export default Layout;

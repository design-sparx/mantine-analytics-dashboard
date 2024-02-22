'use client';

import React, { ReactNode } from 'react';

type AuthProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthProps) {
  return <>{children}</>;
}

export default AuthLayout;

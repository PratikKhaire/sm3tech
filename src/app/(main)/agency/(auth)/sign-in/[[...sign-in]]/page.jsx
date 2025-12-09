import { SignIn } from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <SignIn />
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/agency/sign-up"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

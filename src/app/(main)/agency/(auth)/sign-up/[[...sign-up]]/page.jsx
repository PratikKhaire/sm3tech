import { SignUp } from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const SignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <SignUp />
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/agency/sign-in"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;

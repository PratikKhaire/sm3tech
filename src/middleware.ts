import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/agency/sign-in(.*)',
  '/agency/sign-up(.*)',
  '/api/uploadthing(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // If user is not authenticated and trying to access protected route
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/agency/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}


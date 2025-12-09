import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/user.model'

export async function POST() {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId)

    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 })
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    await connectDB()

    // Check if user exists, if not create them
    let user = await User.findOne({ email })

    if (!user) {
      // Create new user in database
      user = await User.create({
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        email: email,
        avatar: clerkUser.imageUrl || '',
        role: 'User',
      })
      console.log('Created new user:', email)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to sync user' }, { status: 405 })
}

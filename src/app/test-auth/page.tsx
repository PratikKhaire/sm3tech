import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/queries'

export default async function TestAuthPage() {
  // Get user from Clerk
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/agency/sign-in')
  }

  // Get user from MongoDB (this will auto-create if not exists)
  let mongoUser
  let error = null
  try {
    mongoUser = await getUser()
  } catch (e: any) {
    error = e.message
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Debug Page</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Clerk User (Authentication)</h2>
          {clerkUser ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✅ Clerk user found!</p>
              <p><strong>ID:</strong> {clerkUser.id}</p>
              <p><strong>Email:</strong> {clerkUser.emailAddresses[0]?.emailAddress}</p>
              <p><strong>Name:</strong> {clerkUser.firstName} {clerkUser.lastName}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ No Clerk user found</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">MongoDB User (Database)</h2>
          {error ? (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold">❌ Error: {error}</p>
            </div>
          ) : mongoUser ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✅ MongoDB user found!</p>
              <p><strong>ID:</strong> {mongoUser._id?.toString()}</p>
              <p><strong>Email:</strong> {mongoUser.email}</p>
              <p><strong>Name:</strong> {mongoUser.name}</p>
              <p><strong>Role:</strong> {mongoUser.role}</p>
            </div>
          ) : (
            <p className="text-yellow-600">⚠️ No MongoDB user found (this shouldn't happen)</p>
          )}
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-2">What this means:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>If both are ✅ green, authentication is working correctly!</li>
            <li>If Clerk is ✅ but MongoDB is ❌, the user creation is failing</li>
            <li>If both are ❌, you're not logged in - go to <a href="/agency/sign-in" className="text-blue-600 underline">/agency/sign-in</a></li>
          </ul>
        </div>

        <a
          href="/home"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  )
}

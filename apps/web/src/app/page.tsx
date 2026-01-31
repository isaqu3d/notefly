import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-6xl font-bold">Notely</h1>
        <p className="text-xl text-center max-w-2xl">
          A modern workspace for your notes, documents, and knowledge base.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}

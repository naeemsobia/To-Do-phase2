"use client";
import Link from 




'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="absolute top-0 left-0 w-full p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TodoApp</h1>
          <nav>
            <Link href="/todos" className="text-gray-400 hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-4">Organize Your Life</h2>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          A simple, yet powerful to-do list application to help you manage your tasks and stay productive.
        </p>
        <Link
          href="/todos"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </Link>
      </main>

      <footer className="absolute bottom-0 left-0 w-full p-4">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} TodoApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

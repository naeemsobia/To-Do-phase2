'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MoonIcon, SunIcon, Menu, X } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/90 backdrop-blur-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            MY TO-DO APP
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="hover:text-blue-400 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</Link>
            <Link href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Dashboard</Link>
            <ThemeToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="ml-4 p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 py-4 px-4">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link href="#how-it-works" className="hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
              <Link href="#testimonials" className="hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Testimonials</Link>
              <Link href="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-fit" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
              <h1 className="text-7xl md:text-9xl font-extrabold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-orange-500 to-orange-600 drop-shadow-lg">TO-DO APP</span>
              </h1>
              <div className="inline-block px-6 py-2 mb-8 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full text-base font-bold mx-auto md:mx-0 shadow-lg shadow-orange-500/30">
                MY ULTIMATE TO-DO APPLICATION
              </div>
              <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
                Organize, prioritize, and accomplish your tasks with our intuitive and powerful task management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/dashboard" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium text-center transition-all shadow-lg shadow-blue-500/20">
                  Manage Your Tasks
                </Link>
                <Link href="#features" className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-center transition-colors border border-gray-700">
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-blob opacity-80"></div>
                <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl animate-blob animation-delay-2000 opacity-60"></div>
                <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl animate-blob animation-delay-4000 opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-gray-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay organized and boost your productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Organization",
                description: "Categorize and prioritize tasks with our intuitive tagging system",
                icon: "📋"
              },
              {
                title: "Real-time Sync",
                description: "Access your tasks from anywhere with seamless synchronization",
                icon: "🔄"
              },
              {
                title: "Team Collaboration",
                description: "Share tasks and collaborate with your team in real-time",
                icon: "👥"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Getting started with TaskFlow is simple and intuitive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up in seconds and start organizing your tasks"
              },
              {
                step: "02", 
                title: "Add Tasks",
                description: "Quickly add tasks with due dates, priorities, and categories"
              },
              {
                step: "03",
                title: "Track Progress",
                description: "Monitor your productivity and accomplish more"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-6 text-blue-400 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed the way they manage tasks
          </p>
          <Link href="/dashboard" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg inline-block transition-colors">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 md:px-8 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                MY TO-DO APP
              </Link>
              <p className="mt-2 text-gray-500">© 2026 My TO-DO APP. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic with GraphQL
    // Note: In production, this should connect to the backend API
    // and never log sensitive information like passwords
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE5DB] via-[#FFF9F0] to-[#FFD23F]/20 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#FF6B35] font-semibold mb-6 hover:underline"
        >
          ← Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 animate-bounce-in">
          <div className="text-center mb-8">
            <div className="inline-block text-6xl mb-4 animate-wiggle">🍕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">Sign in to continue ordering delicious food</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-sm font-semibold text-[#FF6B35] hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-lg"
            >
              Sign In 🚀
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-[#FF6B35] transition-colors font-semibold text-gray-700 flex items-center justify-center gap-2">
                <span className="text-xl">📱</span>
                Google
              </button>
              <button className="w-full py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-[#FF6B35] transition-colors font-semibold text-gray-700 flex items-center justify-center gap-2">
                <span className="text-xl">📘</span>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-[#FF6B35] hover:underline">
              Sign up now
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Your information is safe and secure</p>
        </div>
      </div>
    </div>
  );
}

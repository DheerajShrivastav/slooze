"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "INDIA",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic with GraphQL
    // TODO: Add client-side validation for:
    // - Password strength requirements
    // - Email format validation
    // - Password confirmation matching
    // - Terms acceptance
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 animate-bounce-in">
          <div className="text-center mb-8">
            <div className="inline-block text-6xl mb-4 animate-wiggle">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join Slooze!
            </h2>
            <p className="text-gray-600">Create an account and start ordering amazing food</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors bg-white"
              >
                <option value="INDIA">🇮🇳 India</option>
                <option value="AMERICA">🇺🇸 America</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-[#FF6B35] font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#FF6B35] font-semibold hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all text-lg"
            >
              Create Account 🚀
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
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
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[#FF6B35] hover:underline">
              Sign in
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

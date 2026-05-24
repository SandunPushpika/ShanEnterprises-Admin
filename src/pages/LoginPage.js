import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-5xl bg-white shadow-card rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-hero-gradient">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">
              DriveLux
            </h1>

            <p className="text-secondary-light text-lg">
              Premium Vehicle Rental Admin Panel
            </p>

            <div className="mt-8 space-y-3 text-muted">
              <p>• Manage vehicles efficiently</p>
              <p>• Track bookings in real-time</p>
              <p>• Approve driver requests instantly</p>
              <p>• View analytics & insights</p>
            </div>
          </div>

          <div className="mt-10 text-sm text-muted">
            © {new Date().getFullYear()} DriveLux. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary">
              Admin Login
            </h2>
            <p className="text-muted mt-1">
              Sign in to access the dashboard
            </p>
          </div>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-secondary-light">Email</label>
              <input
                type="email"
                placeholder="admin@drivelux.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-secondary-light">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted">
                <input type="checkbox" className="accent-primary" />
                Remember me
              </label>

              <button
                type="button"
                className="text-primary hover:text-primary-dark"
              >
                Forgot password?
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            Secure admin access for DriveLux system
          </p>
        </div>
      </div>
    </div>
  );
}
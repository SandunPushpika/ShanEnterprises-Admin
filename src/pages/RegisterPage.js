import React from "react";

export default function RegisterPage() {
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
              Create your Admin Account
            </p>

            <div className="mt-8 space-y-3 text-muted">
              <p>• Manage fleet operations</p>
              <p>• Approve drivers & bookings</p>
              <p>• Access analytics dashboard</p>
              <p>• Secure admin controls</p>
            </div>
          </div>

          <div className="mt-10 text-sm text-muted">
            © {new Date().getFullYear()} DriveLux Admin System
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary">
              Create Account
            </h2>
            <p className="text-muted mt-1">
              Register a new admin user for DriveLux
            </p>
          </div>

          <form className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="text-sm text-secondary-light">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-secondary-light">Email</label>
              <input
                type="email"
                placeholder="admin@drivelux.com"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Admin Code */}
            <div>
              <label className="text-sm text-secondary-light">Admin Code</label>
              <input
                type="password"
                placeholder="••••••••"
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

            {/* Confirm Password */}
            <div>
              <label className="text-sm text-secondary-light">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm text-muted">
              <input type="checkbox" className="mt-1 accent-primary" />
              <span>
                I agree to the admin terms and conditions of DriveLux system
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cta-gradient text-white font-semibold shadow-glow hover:opacity-90 transition"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <span className="text-primary cursor-pointer hover:text-primary-dark">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { register } from "../services/AuthService";

export default function RegisterPage() {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [keycode, setKeycode] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const validateForm = () => {
    if (!email || !password || !firstName || !lastName || !keycode || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    if (!validateForm()) {
      return;
    }

    const res = await register(firstName, lastName, email, password, keycode);
    if (!res.success) {
      setError(res.message || "Registration failed. Please try again.");
    } else {
      setSuccess("Registration successful! You can now log in.");
      setError("");
    }
  };

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
            <div className="flex gap-4">
              <div>
                <label className="text-sm text-secondary-light">First Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
               <div>
                <label className="text-sm text-secondary-light">Last Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={lastName}
                  onChange= {(e) => setLastName(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-secondary-light">Email</label>
              <input
                type="email"
                placeholder="admin@drivelux.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Admin Code */}
            <div>
              <label className="text-sm text-secondary-light">Admin Code</label>
              <input
                type="password"
                placeholder="••••••••"
                value={keycode}
                onChange={(e) => setKeycode(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-secondary-light">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="w-full p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              onClick={handleSubmit}
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
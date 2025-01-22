"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/Auth";

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  onClose,
  onSwitchToLogin,
}: RegisterFormProps) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(email, password, name);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-black/80 p-8 rounded-2xl w-full max-w-md border border-white/10"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
                text-white placeholder-white/50 focus:outline-none focus:ring-2 
                focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
                text-white placeholder-white/50 focus:outline-none focus:ring-2 
                focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/80 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 
                text-white placeholder-white/50 focus:outline-none focus:ring-2 
                focus:ring-purple-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div className="flex flex-col space-y-8 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 
                rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
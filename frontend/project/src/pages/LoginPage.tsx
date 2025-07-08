import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('brad@blackmore.ai');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to BradBoard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Project management made simple
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>

          <div className="text-center text-sm text-gray-400">
            <div>Demo credentials:</div>
            <div className="mt-1">
              <strong>Email:</strong> admin@example.com<br />
              <strong>Password:</strong> password
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
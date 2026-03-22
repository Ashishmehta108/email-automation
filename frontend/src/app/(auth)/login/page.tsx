"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '@/validations/auth.schema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email(data);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-lg">
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-light text-on-surface mb-2">Welcome back</h1>
        <p className="text-sm text-outline">Sign in to your account</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md text-outline mb-2">Email</label>
          <input
            {...form.register('email')}
            type="email"
            className="w-full input-base"
            placeholder="you@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-error mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-label-md text-outline mb-2">Password</label>
          <input
            {...form.register('password')}
            type="password"
            className="w-full input-base"
            placeholder="••••••••"
          />
          {form.formState.errors.password && (
            <p className="text-sm text-error mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary-gradient py-3 rounded-sm disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-sm text-outline mt-6">
        Don't have an account?{' '}
        <a href="/register" className="text-primary hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}

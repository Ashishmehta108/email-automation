"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, type RegisterFormValues } from '@/validations/auth.schema';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authClient.signUp.email(data);
      toast.success('Account created successfully');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-lg">
      <div className="mb-8">
        <h1 className="font-headline text-2xl font-light text-on-surface mb-2">Create account</h1>
        <p className="text-sm text-outline">Get started with Email Automation</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md text-outline mb-2">Name</label>
          <input
            {...form.register('name')}
            type="text"
            className="w-full input-base"
            placeholder="John Doe"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-error mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

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
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-outline mt-6">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

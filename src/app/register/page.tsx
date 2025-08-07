'use client';

import { useForm } from '@mantine/form';
import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Alert, Divider } from '@mantine/core';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Shield, User } from 'lucide-react';
import Link from 'next/link';

interface formValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return null;
      },
      email: (value) => {
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email';
        return null;
      },
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!passwordRegex.test(value))
          return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        return null;
      },
      confirmPassword: (value, values) => {
        if (!value) return 'Password confirmation is required';
        if (value !== values.password) return 'Passwords do not match';
        return null;
      },
    },
  });

  const handleSubmit = async (values: formValues) => {
    setLoading(true);
    setError('');

    try {
      // Simulate register request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate error for demonstration - check if email already exists
      if (values.email === 'admin@example.com') {
        throw new Error('Email already exists');
      }

      alert('Account created successfully!');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-200/10 to-purple-200/10 dark:from-violet-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-xl mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">Sign Up</h1>
          <p className="text-gray-600 text-sm dark:text-gray-300">Create your account</p>
        </div>

        {/* Register Form */}
        <Paper
          shadow="xl"
          p={32}
          radius="lg"
          className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10"
        >
          {error && (
            <Alert icon={<AlertCircle size={16} />} color="red" className="mb-6" variant="light" radius="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className="space-y-4">
            <TextInput
              label="Name"
              placeholder="Your full name"
              leftSection={<User size={16} className="text-gray-400" />}
              size="md"
              radius="md"
              classNames={{
                label: 'text-gray-700 dark:text-gray-200 py-2',
              }}
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="email@example.me"
              leftSection={<Mail size={16} className="text-gray-400" />}
              size="md"
              radius="md"
              classNames={{
                label: 'text-gray-700 dark:text-gray-200 py-2',
              }}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              leftSection={<Lock size={16} className="text-gray-400" />}
              size="md"
              radius="md"
              visibilityToggleIcon={({ reveal }) => (reveal ? <EyeOff size={16} /> : <Eye size={16} />)}
              classNames={{
                label: 'text-gray-700 dark:text-gray-200 py-2',
              }}
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              leftSection={<Lock size={16} className="text-gray-400" />}
              size="md"
              radius="md"
              visibilityToggleIcon={({ reveal }) => (reveal ? <EyeOff size={16} /> : <Eye size={16} />)}
              classNames={{
                label: 'text-gray-700 dark:text-gray-200 py-2',
              }}
              {...form.getInputProps('confirmPassword')}
            />

            <Button
              fullWidth
              loading={loading}
              size="md"
              radius="md"
              type="submit"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 h-11 transition-all duration-200"
              disabled={!form.isValid() || !form.isTouched()}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <Divider label="or" labelPosition="center" className="my-6" />

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Already have an account? </span>
            <Link
              href="/"
              className="text-sm text-violet-600 hover:text-violet-700 font-medium hover:underline dark:text-violet-400 dark:hover:text-violet-300"
            >
              Sign in
            </Link>
          </div>
        </Paper>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Modal, Paper, TextInput, PasswordInput, Button, Stack, Group, Text, ActionIcon, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Edit2, X, Copy, Type, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/user';
import userService from '@/services/user/userService';

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'name' | 'email' | 'password';
}

interface FormValues {
  name: string;
  email: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export default function EditUserModal({ opened, onClose, mode }: EditUserModalProps) {
  const { logout, user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  const invalidCharsRegex = /[çÇ]/;

  const form = useForm<FormValues>({
    initialValues: {
      name: mode === 'name' && user ? user.name : '',
      email: mode === 'email' && user ? user.email : '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
    validateInputOnChange: true,
    validate: {
      name: (value) => {
        if (mode !== 'name') return null;
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return null;
      },

      email: (value) => {
        if (mode !== 'email') return null;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Invalid email';
        return null;
      },

      currentPassword: (value) => {
        if (mode !== 'password') return null;
        if (!value) return 'Current password required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (invalidCharsRegex.test(value)) return 'Password cannot contain ç or Ç';
        if (!passwordRegex.test(value))
          return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        return null;
      },

      password: (value) => {
        if (mode !== 'password') return null;
        if (!value) return 'New password required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (invalidCharsRegex.test(value)) return 'Password cannot contain ç or Ç';
        if (!passwordRegex.test(value))
          return 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        return null;
      },

      confirmPassword: (value, values) => {
        if (mode !== 'password') return null;
        if (value !== values.password) return 'Passwords do not match';
        return null;
      },
    },
  });

  useEffect(() => {
    if (opened && user) {
      form.setValues({
        name: mode === 'name' ? user.name : '',
        email: mode === 'email' ? user.email ?? '' : '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, user, mode]);

  if (!user) return null;

  const isDirtyValue =
    mode === 'name'
      ? form.values.name.toLowerCase().trim() !== user.name.toLowerCase().trim()
      : mode === 'email'
      ? form.values.email.trim() !== user.email.trim()
      : form.values.currentPassword || form.values.password || form.values.confirmPassword;

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveEdit = async (values: typeof form.values) => {
    if (!isDirtyValue) return;
    setLoading(true);

    try {
      let updatedUserData;

      if (mode === 'name') {
        updatedUserData = await userService.changeName(values.name);
      } else if (mode === 'email') {
        updatedUserData = await userService.changeEmail(values.email);
      } else {
        const data = await userService.changePassword({
          currentPassword: values.currentPassword,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });

        if (data.success) {
          logout();
          router.push('/');
        }
        return;
      }

      if (updatedUserData?.data) {
        updateUser(updatedUserData.data);
        onClose();
      }
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = mode === 'name' ? 'Edit Name' : mode === 'email' ? 'Edit Email' : 'Change Password';
  const modalDescription = mode === 'name' ? 'Update your name' : mode === 'email' ? 'Update your email address' : 'Change your password';

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!loading) onClose();
      }}
      size="sm"
      radius="lg"
      centered
      withCloseButton={false}
      classNames={{
        root: 'bg-transparent shadow-none',
        body: 'p-0',
        content: 'bg-transparent shadow-none 2xl:size-md',
        header: 'hidden',
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 4,
        className: 'backdrop-blur-sm',
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute -top-10 -right-10 2xl:-top-20 2xl:-right-20 w-20 h-20 2xl:w-40 2xl:h-40 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 2xl:-bottom-20 2xl:-left-20 w-20 h-20 2xl:w-40 2xl:h-40 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        <Paper
          shadow="xl"
          p={20}
          radius="lg"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 relative z-10 2xl:p-32"
        >
          <div className="flex items-center justify-between mb-4 2xl:mb-6">
            <div className="flex items-center gap-2 2xl:gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 2xl:w-12 2xl:h-12 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-lg">
                <Edit2 className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg 2xl:text-xl font-bold text-gray-900 dark:text-gray-200">{modalTitle}</h2>
                <p className="text-xs 2xl:text-sm text-gray-600 dark:text-gray-300">{modalDescription}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!loading) onClose();
              }}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 2xl:w-5 2xl:h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {user && mode === 'name' && (
            <div className="mb-4 2xl:mb-6 p-3 2xl:p-4 rounded-lg bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
              <Text className="!text-xs 2xl:!text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</Text>
              <Tooltip label={copied ? 'Copied!' : 'Copy'}>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleCopy(user.name)}>
                  <Copy size={14} className="2xl:w-4 2xl:h-4" />
                </ActionIcon>
              </Tooltip>
            </div>
          )}

          {user && mode === 'email' && (
            <div className="mb-4 2xl:mb-6 p-3 2xl:p-4 rounded-lg bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 overflow-x-auto max-w-full flex items-center justify-between">
              <Text className="!text-xs2xl:!text-sm text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">{user.email}</Text>
              <Tooltip label={copied ? 'Copied!' : 'Copy'}>
                <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => handleCopy(user.email)}>
                  <Copy size={14} className="2xl:w-4 2xl:h-4" />
                </ActionIcon>
              </Tooltip>
            </div>
          )}

          <form onSubmit={form.onSubmit(handleSaveEdit)}>
            <Stack gap="md" className="2xl:gap-lg">
              <div className="space-y-3 2xl:space-y-4">
                {mode === 'name' && (
                  <TextInput
                    label="User Name"
                    placeholder="Enter a new name"
                    leftSection={<Type size={14} className="text-gray-400 2xl:w-4 2xl:h-4" />}
                    size="sm"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('name')}
                    classNames={{
                      label: 'text-gray-700 dark:text-gray-200 font-medium mb-1 2xl:mb-2 text-sm 2xl:text-base',
                      input:
                        'bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 focus:border-violet-500 dark:focus:border-violet-400 text-sm 2xl:text-base 2xl:size-md',
                    }}
                  />
                )}

                {mode === 'email' && (
                  <TextInput
                    label="Email"
                    placeholder="email@example.me"
                    leftSection={<Mail size={14} className="text-gray-400 2xl:w-4 2xl:h-4" />}
                    size="sm"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('email')}
                    classNames={{
                      label: 'text-gray-700 dark:text-gray-200 font-medium mb-1 2xl:mb-2 text-sm 2xl:text-base',
                      input:
                        'bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 focus:border-violet-500 dark:focus:border-violet-400 text-sm 2xl:text-base 2xl:size-md',
                    }}
                  />
                )}

                {mode === 'password' && (
                  <>
                    <PasswordInput
                      label="Current Password"
                      placeholder="Your current password"
                      leftSection={<Lock size={14} className="text-gray-400 2xl:w-4 2xl:h-4" />}
                      size="sm"
                      radius="md"
                      disabled={loading}
                      {...form.getInputProps('currentPassword')}
                      classNames={{
                        label: 'text-gray-700 dark:text-gray-200 font-medium mb-1 2xl:mb-2 text-sm 2xl:text-base',
                        input:
                          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 [&>input]:text-gray-900 [&>input]:dark:text-gray-100 [&>input]:caret-gray-900 [&>input]:dark:caret-gray-100 [&>input]:bg-transparent text-sm 2xl:text-base 2xl:size-md',
                        innerInput: 'text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 bg-transparent text-sm 2xl:text-base',
                      }}
                    />
                    <PasswordInput
                      label="New Password"
                      placeholder="Change your password"
                      leftSection={<Lock size={14} className="text-gray-400 2xl:w-4 2xl:h-4" />}
                      size="sm"
                      radius="md"
                      disabled={loading}
                      {...form.getInputProps('password')}
                      classNames={{
                        label: 'text-gray-700 dark:text-gray-200 font-medium mb-1 2xl:mb-2 text-sm 2xl:text-base',
                        input:
                          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 [&>input]:text-gray-900 [&>input]:dark:text-gray-100 [&>input]:caret-gray-900 [&>input]:dark:caret-gray-100 [&>input]:bg-transparent text-sm 2xl:text-base 2xl:size-md',
                        innerInput: 'text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 bg-transparent text-sm 2xl:text-base',
                      }}
                    />
                    <PasswordInput
                      label="Confirm new password"
                      placeholder="Confirm your new password"
                      leftSection={<Lock size={14} className="text-gray-400 2xl:w-4 2xl:h-4" />}
                      size="sm"
                      radius="md"
                      disabled={loading}
                      {...form.getInputProps('confirmPassword')}
                      classNames={{
                        label: 'text-gray-700 dark:text-gray-200 font-medium mb-1 2xl:mb-2 text-sm 2xl:text-base',
                        input:
                          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-400 text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 [&>input]:text-gray-900 [&>input]:dark:text-gray-100 [&>input]:caret-gray-900 [&>input]:dark:caret-gray-100 [&>input]:bg-transparent text-sm 2xl:text-base 2xl:size-md',
                        innerInput: 'text-gray-900 dark:text-gray-100 caret-gray-900 dark:caret-gray-100 bg-transparent text-sm 2xl:text-base',
                      }}
                    />
                  </>
                )}
              </div>

              <Group justify="flex-end" gap="sm" className="pt-3 2xl:pt-4">
                <Button
                  variant="subtle"
                  onClick={onClose}
                  disabled={loading}
                  size="xs"
                  radius="md"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm 2xl:text-base 2xl:size-md"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  size="xs"
                  radius="md"
                  disabled={loading || !form.isValid() || !isDirtyValue}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-200 text-sm 2xl:text-base 2xl:size-md"
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </div>
    </Modal>
  );
}

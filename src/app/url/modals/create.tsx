'use client';

import { useState } from 'react';
import { Modal, Stack, TextInput, Group, Button, Paper } from '@mantine/core';
import { Link, Type, X } from 'lucide-react';
import { useForm } from '@mantine/form';
import urlService from '@/services/url/urlService';

interface Url {
  id: string;
  urlName: string;
  url: string;
  shortened: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateUrlModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: (newUrl: Url) => void;
}

export default function CreateUrlModal({ opened, onClose, onCreated }: CreateUrlModalProps) {
  const [loading, setLoading] = useState(false);

  const URL_REGEX = /^(?:(http|https):\/\/|www\.)(([a-zA-Z0-9-]+\.)+)([a-zA-Z]{2,})([/?#][^\s]*)?$/;

  const form = useForm({
    initialValues: {
      urlName: '',
      url: '',
    },
    validateInputOnChange: true,
    validate: {
      urlName: (value) => {
        if (!value.trim()) return 'Please enter a URL name.';
        if (value.length < 2) return 'The URL name must be at least 2 characters long.';
        return null;
      },
      url: (value) => {
        if (!value.trim()) return 'Please enter a URL.';
        const stripped = value.trim();
        const hasValidPrefix = stripped.startsWith('http://') || stripped.startsWith('https://') || stripped.startsWith('www.');
        if (!hasValidPrefix) return 'The URL must start with http://, https://, or www.';
        if (!URL_REGEX.test(stripped)) return 'The provided URL is not valid.';
        return null;
      },
    },
  });

  async function handleCreateUrl(values: typeof form.values) {
    setLoading(true);
    const response = await urlService.create(values);
    setLoading(false);

    if (response.data) {
      onCreated(response.data);
      form.reset();
    }
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      radius="lg"
      centered
      withCloseButton={false}
      classNames={{
        root: 'bg-transparent shadow-none',
        body: 'p-0',
        content: 'bg-transparent shadow-none',
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
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        <Paper
          shadow="xl"
          p={32}
          radius="lg"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-lg">
                <Link className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">New URL</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Create a shortened URL</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={form.onSubmit(handleCreateUrl)}>
            <Stack gap="lg">
              <div className="space-y-4">
                <TextInput
                  label="URL Name"
                  placeholder="Enter a name for your URL"
                  leftSection={<Type size={16} className="text-gray-400" />}
                  size="md"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('urlName')}
                  classNames={{
                    label: 'text-gray-700 dark:text-gray-200 font-medium mb-2',
                    input:
                      'bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 focus:border-violet-500 dark:focus:border-violet-400',
                  }}
                />

                <TextInput
                  label="Original URL"
                  placeholder="https://example.com"
                  leftSection={<Link size={16} className="text-gray-400" />}
                  size="md"
                  radius="md"
                  disabled={loading}
                  {...form.getInputProps('url')}
                  classNames={{
                    label: 'text-gray-700 dark:text-gray-200 font-medium mb-2',
                    input:
                      'bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 focus:border-violet-500 dark:focus:border-violet-400',
                  }}
                />
              </div>

              <Group justify="flex-end" gap="sm" className="pt-4">
                <Button
                  variant="subtle"
                  onClick={onClose}
                  disabled={loading}
                  size="md"
                  radius="md"
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  size="md"
                  radius="md"
                  disabled={loading || !form.isValid()}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-200"
                >
                  {loading ? 'Creating...' : 'Save'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </div>
    </Modal>
  );
}

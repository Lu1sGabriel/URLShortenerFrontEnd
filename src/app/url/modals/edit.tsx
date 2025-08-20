'use client';

import { useState, useEffect } from 'react';
import { Modal, Stack, TextInput, Group, Button, Paper, Text } from '@mantine/core';
import { Edit2, Link, Type, X } from 'lucide-react';
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

interface EditUrlModalProps {
  opened: boolean;
  onClose: () => void;
  url: Url;
  mode: 'urlName' | 'url';
  onUpdated: (updatedUrl: Url) => void;
}

export default function EditUrlModal({ opened, onClose, url, mode, onUpdated }: EditUrlModalProps) {
  const [loading, setLoading] = useState(false);

  const URL_REGEX = /^(?:(http|https):\/\/|www\.)(([a-zA-Z0-9-]+\.)+)([a-zA-Z]{2,})([/?#][^\s]*)?$/;

  const form = useForm({
    initialValues: {
      urlName: '',
      originalUrl: '',
    },
    validateInputOnChange: true,
    validate: {
      urlName: (value) => {
        if (mode !== 'urlName') return null;
        if (!value.trim()) return 'Please enter a name.';
        if (value.length < 2) return 'The name must be at least 2 characters long.';
        return null;
      },
      originalUrl: (value) => {
        if (mode !== 'url') return null;
        if (!value.trim()) return 'Please enter a URL.';
        const stripped = value.trim();
        const hasValidPrefix = stripped.startsWith('http://') || stripped.startsWith('https://') || stripped.startsWith('www.');
        if (!hasValidPrefix) return 'The URL must start with http://, https://, or www.';
        if (!URL_REGEX.test(stripped)) return 'The provided URL is not valid.';
        return null;
      },
    },
  });

  useEffect(() => {
    form.setValues({
      urlName: mode === 'urlName' ? url.urlName : '',
      originalUrl: mode === 'url' ? url.url ?? '' : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, mode]);

  async function handleSaveEdit(values: typeof form.values) {
    setLoading(true);
    let response;
    if (mode === 'urlName') {
      response = await urlService.changeUrlName(url.id, values.urlName);
    } else {
      response = await urlService.changeUrl(url.id, values.originalUrl);
    }
    setLoading(false);

    if (response.data) {
      onUpdated(response.data);
    }

    onClose();
  }

  const getModalTitle = () => (mode === 'urlName' ? 'Edit URL Name' : 'Edit Original URL');

  const getModalDescription = () => (mode === 'urlName' ? 'Update the display name for your URL' : 'Update the original URL destination');

  return (
    <Modal
      opened={opened}
      onClose={() => {
        if (!loading) onClose();
      }}
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
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">{getModalTitle()}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{getModalDescription()}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!loading) onClose();
              }}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {url && mode === 'urlName' ? (
            <div className="mb-6 p-4 rounded-lg bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current: {url.urlName}</Text>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-lg bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 overflow-x-auto max-w-full">
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-mono whitespace-nowrap">{url.url}</Text>
            </div>
          )}

          <form onSubmit={form.onSubmit(handleSaveEdit)}>
            <Stack gap="lg">
              <div className="space-y-4">
                {mode === 'urlName' ? (
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
                ) : (
                  <TextInput
                    label="Original URL"
                    placeholder="https://example.com"
                    leftSection={<Link size={16} className="text-gray-400" />}
                    size="md"
                    radius="md"
                    disabled={loading}
                    {...form.getInputProps('originalUrl')}
                    classNames={{
                      label: 'text-gray-700 dark:text-gray-200 font-medium mb-2',
                      input:
                        'bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 focus:border-violet-500 dark:focus:border-violet-400',
                    }}
                  />
                )}
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
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  loading={loading}
                  size="md"
                  radius="md"
                  disabled={loading || !form.isValid()}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-200"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </div>
    </Modal>
  );
}

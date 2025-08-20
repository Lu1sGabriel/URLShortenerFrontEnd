'use client';

import { useEffect, useState } from 'react';
import { Container, Group, Text, Stack, Tooltip, ActionIcon, Button, Paper } from '@mantine/core';
import { Plus, Link as LinkIcon, ExternalLink, Copy, Edit2, Trash2, AlertCircle, Globe } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import urlService from '@/services/url/urlService';
import CreateUrlModal from './modals/create';
import EditUrlModal from './modals/edit';
import DeleteUrlModal from './modals/delete';
import useAuthCheck from '@/shared/hooks/useAuthCheck';
import { Authorized } from '@/components/authorized';

interface Urls {
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

export default function UserUrls() {
  const [urls, setUrls] = useState<Urls[]>([]);
  const [loading, setLoading] = useState(false);

  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);

  const [editingUrl, setEditingUrl] = useState<Urls | null>(null);
  const [editMode, setEditMode] = useState<'urlName' | 'url'>('urlName');

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Urls | null>(null);

  useAuthCheck({
    redirectPath: '/',
    enablePolling: true,
  });

  useEffect(() => {
    async function loadUrls() {
      setLoading(true);
      const response = await urlService.getByUser();
      if (response.data && response.data.length > 0) {
        setUrls(response.data);
      } else {
        setUrls([]);
      }
      setLoading(false);
    }

    loadUrls();
  }, []);

  function handleRedirect(shortened: string) {
    urlService.redirect(shortened);
  }

  async function handleCopyShortened(shortened: string) {
    try {
      await navigator.clipboard.writeText(`http://localhost:8080/redirector/${shortened}`);
      notifications.show({
        title: 'Copiado!',
        message: 'URL encurtada copiada para a área de transferência',
        color: 'green',
      });
    } catch {
      notifications.show({
        title: 'Erro',
        message: 'Não foi possível copiar',
        color: 'red',
      });
    }
  }

  function openEditModal(url: Urls, mode: 'urlName' | 'url') {
    setEditingUrl(url);
    setEditMode(mode);
    setEditModalOpened(true);
  }

  function openDeleteModal(url: Urls) {
    setUrlToDelete(url);
    setDeleteModalOpened(true);
  }

  async function handleDelete(id: string) {
    const response = await urlService.delete(id);
    if (response) {
      setUrls((prev) => prev.filter((url) => url.id !== id));
    }
  }

  function onUrlUpdated(newUrl: Urls) {
    setUrls((prev) => {
      const index = prev.findIndex((u) => u.id === newUrl.id);
      if (index === -1) {
        return [...prev, newUrl];
      } else {
        const copy = [...prev];
        copy[index] = newUrl;
        return copy;
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 2xl:-top-40 2xl:-right-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 2xl:-bottom-40 2xl:-left-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 2xl:w-96 2xl:h-96 bg-gradient-to-r from-violet-200/10 to-purple-200/10 dark:from-violet-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
        </div>

        <Container size="lg" className="py-4 2xl:py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-4 2xl:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 2xl:w-18 2xl:h-18 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-xl mb-3 2xl:mb-4">
              <Globe className="w-8 h-8 2xl:w-12 2xl:h-12 text-white" />
            </div>
            <h1 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-gray-200 mb-1 2xl:mb-2">Your URLs</h1>
            <p className="text-gray-600 text-xs 2xl:text-sm dark:text-gray-300 mb-4 2xl:mb-6">Manage your shortened URLs</p>
          </div>

          <Paper
            shadow="xl"
            p={16}
            radius="lg"
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 2xl:p-32"
          >
            <div className="flex justify-center py-6 2xl:py-8">
              <Text className="text-gray-600 dark:text-gray-300 text-sm 2xl:text-base">Loading your URLs...</Text>
            </div>
          </Paper>
        </Container>
      </div>
    );
  }

  if (!loading && urls.length === 0) {
    return (
      <div className="min-h-screen relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 2xl:-top-40 2xl:-right-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 2xl:-bottom-40 2xl:-left-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 2xl:w-96 2xl:h-96 bg-gradient-to-r from-violet-200/10 to-purple-200/10 dark:from-violet-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
        </div>

        <Container size="lg" className="py-4 2xl:py-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-4 2xl:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 2xl:w-18 2xl:h-18 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-xl mb-3 2xl:mb-4">
              <Globe className="w-8 h-8 2xl:w-12 2xl:h-12 text-white" />
            </div>
            <h1 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-gray-200 mb-1 2xl:mb-2">Your URLs</h1>
            <p className="text-gray-600 text-xs 2xl:text-sm dark:text-gray-300 mb-4 2xl:mb-6">Manage your shortened URLs</p>
          </div>

          <Paper
            shadow="xl"
            p={16}
            radius="lg"
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 2xl:p-32"
          >
            <div className="text-center py-6 2xl:py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 2xl:w-16 2xl:h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-3 2xl:mb-4">
                <AlertCircle className="w-6 h-6 2xl:w-8 2xl:h-8 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base 2xl:text-lg font-semibold text-gray-900 dark:text-gray-200 mb-1 2xl:mb-2">No URLs found</h3>
              <p className="text-xs 2xl:text-sm text-gray-600 dark:text-gray-300 mb-3 2xl:mb-4">
                You haven&apos;t created any shortened URLs yet. Click &quot;New URL&quot; to get started!
              </p>
              <Button
                size="sm"
                radius="md"
                leftSection={<Plus size={12} className="2xl:w-3.5 2xl:h-3.5" />}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
                onClick={() => setCreateModalOpened(true)}
              >
                Create your first URL
              </Button>
            </div>
          </Paper>
        </Container>
      </div>
    );
  }

  if (!loading && urls.length > 0) {
    return (
      <Authorized authority="url:view">
        <div className="min-h-screen relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 2xl:-top-40 2xl:-right-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 2xl:-bottom-40 2xl:-left-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 2xl:w-96 2xl:h-96 bg-gradient-to-r from-violet-200/10 to-purple-200/10 dark:from-violet-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
          </div>

          <Container size="lg" className="py-4 2xl:py-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-4 2xl:mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 2xl:w-18 2xl:h-18 bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25 rounded-xl mb-3 2xl:mb-4">
                <Globe className="w-8 h-8 2xl:w-12 2xl:h-12 text-white" />
              </div>
              <h1 className="text-xl 2xl:text-2xl font-bold text-gray-900 dark:text-gray-200 mb-1 2xl:mb-2">Your URLs</h1>
              <p className="text-gray-600 text-xs 2xl:text-sm dark:text-gray-300 mb-4 2xl:mb-6">Manage your shortened URLs</p>

              <Authorized authority="url:create">
                <Button
                  size="sm"
                  radius="md"
                  leftSection={<Plus size={14} />}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
                  onClick={() => setCreateModalOpened(true)}
                >
                  New URL
                </Button>
              </Authorized>
            </div>

            <Paper
              shadow="xl"
              p={16}
              radius="lg"
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 2xl:p-32"
            >
              <Stack gap="md" className="2xl:gap-lg">
                {urls.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 2xl:p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 shadow-lg shadow-violet-500/5 dark:shadow-purple-500/5 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-purple-500/10 transition-all duration-200"
                  >
                    <Group justify="space-between" align="flex-start">
                      <div className="flex-1 min-w-0">
                        <Group gap="xs" mb="xs">
                          <LinkIcon size={14} className="text-violet-600 dark:text-violet-400 2xl:w-4 2xl:h-4" />
                          <Text className="font-semibold text-base 2xl:text-lg text-gray-900 dark:text-gray-200 truncate">{item.urlName}</Text>
                        </Group>

                        <Text className="text-xs 2xl:text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">
                          <strong>Short URL:</strong> <span className="text-violet-600 dark:text-violet-400 font-mono">{item.shortened}</span>
                        </Text>

                        <Text className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          <strong>Original:</strong> {item.url}
                        </Text>
                      </div>

                      <Group gap="xs">
                        <Tooltip label="Open URL">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            className="bg-violet-100 hover:bg-violet-200 text-violet-600 dark:bg-violet-900/30 dark:hover:bg-violet-800/50 dark:text-violet-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                            onClick={() => handleRedirect(item.shortened)}
                          >
                            <ExternalLink size={14} className="2xl:w-4 2xl:h-4" />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Copy shortened URL">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-700/70 dark:text-gray-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                            onClick={() => handleCopyShortened(item.shortened)}
                          >
                            <Copy size={14} className="2xl:w-4 2xl:h-4" />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Edit name">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 dark:text-yellow-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                            onClick={() => openEditModal(item, 'urlName')}
                          >
                            <Edit2 size={14} className="2xl:w-4 2xl:h-4" />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Edit URL">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            className="bg-orange-100 hover:bg-orange-200 text-orange-600 dark:bg-orange-900/30 dark:hover:bg-orange-800/50 dark:text-orange-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                            onClick={() => openEditModal(item, 'url')}
                          >
                            <LinkIcon size={14} className="2xl:w-4 2xl:h-4" />
                          </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Delete">
                          <ActionIcon
                            variant="light"
                            size="sm"
                            className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-800/50 dark:text-red-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                            onClick={() => openDeleteModal(item)}
                          >
                            <Trash2 size={14} className="2xl:w-4 2xl:h-4" />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </div>
                ))}
              </Stack>
            </Paper>
          </Container>

          {/* Modais */}

          {/* Creation */}
          <CreateUrlModal opened={createModalOpened} onClose={() => setCreateModalOpened(false)} onCreated={onUrlUpdated} />

          {/* Editing */}
          {editingUrl && (
            <EditUrlModal
              opened={editModalOpened}
              onClose={() => setEditModalOpened(false)}
              url={editingUrl}
              mode={editMode}
              onUpdated={onUrlUpdated}
            />
          )}

          {/* Deleting */}
          {urlToDelete && (
            <DeleteUrlModal
              opened={deleteModalOpened}
              onClose={() => setDeleteModalOpened(false)}
              urlName={urlToDelete.urlName}
              onConfirm={async () => {
                await handleDelete(urlToDelete.id);
              }}
            />
          )}
        </div>
      </Authorized>
    );
  }
}

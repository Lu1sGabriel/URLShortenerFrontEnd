'use client';

import { Button, Modal, Paper, Stack, Group } from '@mantine/core';
import { Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface DeleteUrlModalProps {
  opened: boolean;
  onClose: () => void;
  urlName: string; // nome ou identificador da URL
  onConfirm: () => Promise<void>; // função para deletar a URL
}

export default function DeleteUrlModal({ opened, onClose, urlName, onConfirm }: DeleteUrlModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  }

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
        {/* Decorative Elements - Red theme for destructive action */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-300/20 dark:bg-red-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-300/20 dark:bg-red-500/10 rounded-full blur-2xl"></div>
        </div>

        <Paper
          shadow="xl"
          p={32}
          radius="lg"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-red-500/10 dark:shadow-red-500/10 relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 shadow-lg shadow-red-500/25 rounded-lg">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">Confirm Deletion</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete the URL <strong className="text-red-600 dark:text-red-400">{urlName}</strong>? This action cannot be
                  undone.
                </p>
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

          {/* Warning Message */}
          <div className="mb-6 p-4 rounded-lg bg-red-50/70 dark:bg-red-900/20 border border-red-200/30 dark:border-red-700/30">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">Permanent Action</p>
                <p className="text-xs text-red-700 dark:text-red-400">
                  Once deleted, this URL and all its analytics data will be permanently removed from your account.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <Stack gap="sm" className="pt-4">
            <Group justify="flex-end" gap="sm">
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
                onClick={handleConfirm}
                loading={loading}
                size="md"
                radius="md"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/25 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none transition-all duration-200"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </div>
    </Modal>
  );
}

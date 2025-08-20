'use client';

import { useState } from 'react';
import { Paper, Stack, Text, ActionIcon, Tooltip } from '@mantine/core';
import { User2Icon, Edit2, MailIcon, LockIcon, UserLock, AlertCircle, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/user';
import EditUserModal from './modals/edit';

type ModalModes = 'name' | 'email' | 'password';

export default function UserProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editMode, setEditMode] = useState<ModalModes>('name');

  // Abre modal de edição
  const openEditModal = (mode: ModalModes) => {
    setEditMode(mode);
    setEditModalOpened(true);
  };

  if (isLoading) {
    return (
      <Paper className="p-8 2xl:p-12 text-center">
        <div className="animate-pulse inline-block w-12 h-12 2xl:w-16 2xl:h-16 bg-violet-300 rounded-full mb-3 2xl:mb-4" />
        <Text className="text-sm 2xl:text-base">Loading your profile...</Text>
      </Paper>
    );
  }

  if (!user) {
    return (
      <Paper className="p-8 2xl:p-12 text-center">
        <AlertCircle size={36} className="mx-auto mb-3 2xl:mb-4 text-red-600 2xl:w-12 2xl:h-12" />
        <Text className="text-sm 2xl:text-base">We couldn&apos;t load your profile. Please try again.</Text>
        <button
          onClick={() => router.refresh()}
          className="mt-3 2xl:mt-4 px-4 py-2 2xl:px-6 2xl:py-2 bg-violet-500 text-white rounded text-sm 2xl:text-base"
        >
          Try Again
        </button>
      </Paper>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-4 2xl:py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 2xl:-top-40 2xl:-right-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 2xl:-bottom-40 2xl:-left-40 w-40 h-40 2xl:w-80 2xl:h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 2xl:w-96 2xl:h-96 bg-gradient-to-r from-violet-200/10 to-purple-200/10 dark:from-violet-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg 2xl:max-w-2xl relative z-10">
        <Paper
          shadow="xl"
          radius="xl"
          className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-violet-500/10 dark:shadow-purple-500/10 overflow-hidden"
        >
          {/* Header com Avatar */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-6 2xl:px-8 2xl:py-12 text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 2xl:w-24 2xl:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 2xl:mb-4 mx-auto border-4 border-white/30">
                <User2Icon size={28} className="text-white 2xl:w-10 2xl:h-10" />
              </div>
            </div>
            <h1 className="text-lg 2xl:text-2xl font-bold text-white mb-1 2xl:mb-2">{user?.name}</h1>
            <Text className="!text-violet-100 !font-medium !text-sm 2xl:!text-lg">{user?.email}</Text>
          </div>

          {/* Content */}
          <div className="p-6 2xl:p-8">
            <Stack gap="md">
              {/* Informações do Perfil */}
              <div>
                <div className="grid gap-3 2xl:gap-4">
                  {/* Nome */}
                  <div className="flex items-center justify-between p-3 2xl:p-4 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-700/50">
                    <div className="flex items-center gap-2 2xl:gap-3">
                      <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-violet-100 dark:bg-violet-800/50 rounded-lg flex items-center justify-center">
                        <User2Icon size={14} className="text-violet-600 dark:text-violet-400 2xl:w-4.5 2xl:h-4.5" />
                      </div>
                      <div>
                        <Text className="!text-xs 2xl:!text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</Text>
                        <Text className="!text-sm 2xl:!text-base text-gray-900 dark:text-gray-200 font-semibold">{user?.name}</Text>
                      </div>
                    </div>
                    <Tooltip label="Edit name">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/50 dark:text-yellow-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                        onClick={() => openEditModal('name')}
                      >
                        <Edit2 size={14} className="2xl:w-4 2xl:h-4" />
                      </ActionIcon>
                    </Tooltip>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between p-3 2xl:p-4 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-700/50">
                    <div className="flex items-center gap-2 2xl:gap-3">
                      <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-orange-100 dark:bg-orange-800/50 rounded-lg flex items-center justify-center">
                        <MailIcon size={14} className="text-orange-600 dark:text-orange-400 2xl:w-4.5 2xl:h-4.5" />
                      </div>
                      <div>
                        <Text className="!text-xs 2xl:!text-sm font-medium text-gray-600 dark:text-gray-400">Email Address</Text>
                        <Text className="!text-sm 2xl:!text-base text-gray-900 dark:text-gray-200 font-semibold font-mono">{user?.email}</Text>
                      </div>
                    </div>
                    <Tooltip label="Edit email">
                      <ActionIcon
                        variant="light"
                        size="sm"
                        className="bg-orange-100 hover:bg-orange-200 text-orange-600 dark:bg-orange-900/30 dark:hover:bg-orange-800/50 dark:text-orange-400 border-0 shadow-sm 2xl:w-9 2xl:h-9"
                        onClick={() => openEditModal('email')}
                      >
                        <Edit2 size={14} className="2xl:w-4 2xl:h-4" />
                      </ActionIcon>
                    </Tooltip>
                  </div>

                  {/* Data de Criação */}
                  <div className="flex items-center justify-between p-3 2xl:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50">
                    <div className="flex items-center gap-2 2xl:gap-3">
                      <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                        <Calendar size={14} className="text-blue-600 dark:text-blue-400 2xl:w-4.5 2xl:h-4.5" />
                      </div>
                      <div>
                        <Text className="!text-xs 2xl:!text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</Text>
                        <Text className="!text-sm 2xl:!text-base text-gray-900 dark:text-gray-200 font-semibold">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('pt-BR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : 'Unknown'}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações de Segurança */}
              <div className="mt-4 2xl:mt-6">
                <Text className="text-base 2xl:text-lg font-semibold text-gray-900 dark:text-gray-200 !mb-3 2xl:!mb-4">Security & Privacy</Text>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 2xl:gap-3">
                  <button
                    onClick={() => openEditModal('password')}
                    className="flex items-center gap-2 2xl:gap-3 p-3 2xl:p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-700/50 transition-colors">
                      <LockIcon size={14} className="text-green-600 dark:text-green-400 2xl:w-4.5 2xl:h-4.5" />
                    </div>
                    <div className="text-left">
                      <Text className="!text-xs 2xl:!text-sm font-medium text-gray-900 dark:text-gray-200">Change Password</Text>
                      <Text className="!text-xs text-gray-600 dark:text-gray-400">Update your password</Text>
                    </div>
                  </button>

                  <button
                    // onClick={() => openDeleteModal(user)}
                    className="flex items-center gap-2 2xl:gap-3 p-3 2xl:p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/50 dark:border-red-700/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 2xl:w-10 2xl:h-10 bg-red-100 dark:bg-red-800/50 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-700/50 transition-colors">
                      <UserLock size={14} className="text-red-600 dark:text-red-400 2xl:w-4.5 2xl:h-4.5" />
                    </div>
                    <div className="text-left">
                      <Text className="!text-xs 2xl:!text-sm font-medium text-gray-900 dark:text-gray-200">Deactivate Account</Text>
                      <Text className="!text-xs text-gray-600 dark:text-gray-400">Temporarily disable</Text>
                    </div>
                  </button>
                </div>
              </div>
            </Stack>
          </div>
        </Paper>
      </div>

      {/* Modal de edição */}
      <EditUserModal opened={editModalOpened} onClose={() => setEditModalOpened(false)} mode={editMode} />
    </div>
  );
}

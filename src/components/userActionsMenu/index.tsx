'use client';

import { useState } from 'react';
import { Menu, Text, Divider } from '@mantine/core';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/app/context/user';

export default function UserActionsMenu() {
  const [menuOpened, setMenuOpened] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const { user, isAuthenticated, logout } = useUser();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  async function navigateToProfile() {
    router.push('/profile');
  }

  async function navigateToUrls() {
    router.push('/url');
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Menu
      opened={menuOpened}
      onChange={setMenuOpened}
      position="top-end"
      offset={10}
      shadow="xl"
      width={280}
      radius="lg"
      classNames={{
        dropdown: 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        item: 'hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200',
      }}
    >
      <Menu.Target>
        <button
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full z-50 bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 dark:shadow-purple-500/25 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center border-0 outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
            menuOpened ? 'scale-110' : ''
          }`}
          aria-label="User Actions Menu"
        >
          <div className="relative">
            <User size={20} className="text-white" />
            <ChevronDown
              size={12}
              className={`absolute -bottom-1 -right-1 text-white/80 transition-transform duration-200 ${menuOpened ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        {/* Informações do usuário */}
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <Text size="sm" fw={500} className="text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'User'}
              </Text>
              <Text size="xs" className="text-gray-600 dark:text-gray-400 truncate">
                {user?.email || 'email@example.com'}
              </Text>
            </div>
          </div>
        </div>

        {pathName !== '/profile' && (
          <Menu.Item leftSection={<User size={16} />} onClick={navigateToProfile} className="text-gray-700 dark:text-gray-300 my-1">
            My Profile
          </Menu.Item>
        )}

        {pathName !== '/url' && (
          <Menu.Item leftSection={<Settings size={16} />} onClick={navigateToUrls} className="text-gray-700 dark:text-gray-300 my-1">
            My URLs
          </Menu.Item>
        )}

        {/* Logout */}
        <Divider className="my-2" />

        <Menu.Item
          leftSection={<LogOut size={16} />}
          onClick={handleLogout}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

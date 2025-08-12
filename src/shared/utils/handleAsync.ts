import { AxiosError, AxiosResponse } from 'axios';
import { notifications } from '@mantine/notifications';

interface HandleAsyncResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function handleAsync<T>(asyncFn: () => Promise<AxiosResponse<T>>, notifySuccess?: false | string): Promise<HandleAsyncResult<T>> {
  try {
    const response = await asyncFn();
    const data = response.data;

    if (notifySuccess !== false) {
      notifications.show({
        title: 'Success',
        message: typeof notifySuccess === 'string' ? notifySuccess : 'Operation completed successfully',
        color: 'green',
        position: 'top-right',
        withCloseButton: false,
        autoClose: 4000,
      });
    }

    return { success: true, data };
  } catch (error) {
    const err = error as AxiosError<{ error?: string; message?: string }>;

    const message = err.response?.data?.error || err.response?.data?.message || err.message || 'An unexpected error occurred';

    notifications.show({
      title: 'Error',
      message,
      color: 'red',
      position: 'top-right',
      withCloseButton: false,
      autoClose: 4000,
    });

    return { success: false, error: message };
  }
}

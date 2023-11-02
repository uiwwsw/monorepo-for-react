import { ModalBaseProps } from '@/Modal/Base';
import { ToastBaseProps } from '@/Toast/Base';
import { createContext, useContext } from 'react';

interface ContextProps {
  showModal: (params: Omit<ModalBaseProps, 'open'>) => unknown;
  hideModal: (id: string) => unknown;

  showToast: (params: Omit<ToastBaseProps, 'open'>) => unknown;
  hideToast: (id: string) => unknown;
  clearToast: () => unknown;
}
const NotificationContext = createContext<ContextProps>({
  showModal: () => false,
  hideModal: () => false,

  showToast: () => false,
  hideToast: () => false,
  clearToast: () => false,
});
export const useNotificationContext = () => useContext(NotificationContext);

export default NotificationContext;

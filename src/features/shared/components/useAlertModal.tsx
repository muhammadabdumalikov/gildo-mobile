import { useCallback, useState } from 'react';
import { AlertModal, AlertVariant } from './AlertModal';

interface AlertOptions {
  variant: AlertVariant;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const useAlertModal = () => {
  const [visible, setVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions | null>(null);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertOptions(options);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
    // Clear options after animation
    setTimeout(() => {
      setAlertOptions(null);
    }, 300);
  }, []);

  const AlertModalComponent = alertOptions ? (
    <AlertModal
      visible={visible}
      variant={alertOptions.variant}
      title={alertOptions.title}
      message={alertOptions.message}
      confirmText={alertOptions.confirmText}
      cancelText={alertOptions.cancelText}
      onConfirm={alertOptions.onConfirm}
      onCancel={alertOptions.onCancel}
      onClose={hideAlert}
      showCancel={alertOptions.showCancel}
    />
  ) : null;

  return {
    showAlert,
    hideAlert,
    AlertModal: AlertModalComponent,
  };
};

// Convenience functions for common alert types
export const createAlertHelpers = (showAlert: (options: AlertOptions) => void) => {
  return {
    success: (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        variant: 'success',
        title,
        message,
        onConfirm,
      });
    },
    error: (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        variant: 'error',
        title,
        message,
        onConfirm,
      });
    },
    alert: (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
      showAlert({
        variant: 'alert',
        title,
        message,
        onConfirm,
        onCancel,
        showCancel: !!onCancel,
      });
    },
    info: (title: string, message: string, onConfirm?: () => void) => {
      showAlert({
        variant: 'info',
        title,
        message,
        onConfirm,
      });
    },
  };
};


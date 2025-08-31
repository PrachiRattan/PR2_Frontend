import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  showCloseButton = true,
  preventCloseOnOverlay = false,
  footer,
  className = ''
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && !preventCloseOnOverlay) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, preventCloseOnOverlay]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-7xl mx-4';
      default:
        return 'max-w-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Centering trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`relative inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${getSizeClasses()} ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`${title || showCloseButton ? '' : 'pt-4'} ${footer ? 'pb-0' : 'pb-4'}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Pre-built Modal Variants for common use cases
export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary' // 'primary', 'danger', 'warning'
}) => {
  const getConfirmButtonClasses = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${getConfirmButtonClasses()}`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="p-4">
        <p className="text-gray-700">{message}</p>
      </div>
    </Modal>
  );
};

export const LoadingModal = ({ isOpen, message = 'Loading...' }) => (
  <Modal
    isOpen={isOpen}
    onClose={() => {}}
    showCloseButton={false}
    preventCloseOnOverlay={true}
    size="sm"
  >
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-emerald-600 mx-auto mb-4"></div>
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  </Modal>
);

export const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info' // 'info', 'success', 'warning', 'error'
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: '✓'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: '⚠'
        };
      case 'error':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: '✕'
        };
      default:
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: 'ℹ'
        };
    }
  };

  const { bgColor, textColor, iconColor, icon } = getIconAndColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          OK
        </button>
      }
    >
      <div className="p-4">
        <div className={`${bgColor} rounded-lg p-4 flex items-start gap-3`}>
          <div className={`${iconColor} font-bold text-lg flex-shrink-0`}>
            {icon}
          </div>
          <p className={`${textColor} text-sm`}>{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;

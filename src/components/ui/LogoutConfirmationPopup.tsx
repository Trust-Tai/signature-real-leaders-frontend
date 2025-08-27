"use client";

import React from 'react';

interface LogoutConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmationPopup: React.FC<LogoutConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="absolute  mt-2 right-[50] top-[50] z-50">
      <div className="bg-white rounded-lg p-3 shadow-lg border border-gray-200 w-56">
        <p className="text-sm text-gray-700 mb-3 text-center">
          Are you sure you want to logout?
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-3 py-1.5 bg-[#CF3232] text-white rounded text-xs hover:bg-red-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationPopup;

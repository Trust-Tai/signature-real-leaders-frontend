"use client";

import { toast as toastify } from "react-toastify";

type ToastOptions = {
  id?: string;
  autoClose?: number | false;
};

export const toast = {
  success(message: string, options: ToastOptions = {}): void {
    toastify.success(message, {
      toastId: options.id,
      autoClose: options.autoClose ?? 2000, // Default 2 seconds
    });
  },
  error(message: string, options: ToastOptions = {}): void {
    toastify.error(message, {
      toastId: options.id,
      autoClose: options.autoClose ?? 2000, // Default 2 seconds
    });
  },
  info(message: string, options: ToastOptions = {}): void {
    toastify.info(message, {
      toastId: options.id,
      autoClose: options.autoClose ?? 2000, // Default 2 seconds
    });
  },
  warning(message: string, options: ToastOptions = {}): void {
    toastify.warning(message, {
      toastId: options.id,
      autoClose: options.autoClose ?? 2000, // Default 2 seconds
    });
  },
};

export type { ToastOptions };



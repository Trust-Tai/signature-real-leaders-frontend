"use client";

import { toast as toastify } from "react-toastify";

type ToastOptions = {
  id?: string;
  autoCloseMs?: number;
};

export const toast = {
  success(message: string, options: ToastOptions = {}): void {
    toastify.success(message, {
      toastId: options.id,
      autoClose: options.autoCloseMs ?? false,
    });
  },
  error(message: string, options: ToastOptions = {}): void {
    toastify.error(message, {
      toastId: options.id,
      autoClose: options.autoCloseMs ?? false,
    });
  },
  info(message: string, options: ToastOptions = {}): void {
    toastify.info(message, {
      toastId: options.id,
      autoClose: options.autoCloseMs ?? false,
    });
  },
  warning(message: string, options: ToastOptions = {}): void {
    toastify.warning(message, {
      toastId: options.id,
      autoClose: options.autoCloseMs ?? false,
    });
  },
};

export type { ToastOptions };



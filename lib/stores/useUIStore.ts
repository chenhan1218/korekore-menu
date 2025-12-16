import { create } from "zustand";

interface UIState {
  // Modal 狀態
  isOrderCardModalOpen: boolean;
  isUploadModalOpen: boolean;
  isDeleteConfirmOpen: boolean;
  deleteTargetId: string | null;

  // Toast 訊息
  toast: {
    message: string;
    type: "success" | "error" | "info";
  } | null;

  // Actions
  openOrderCardModal: () => void;
  closeOrderCardModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openDeleteConfirm: (id: string) => void;
  closeDeleteConfirm: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOrderCardModalOpen: false,
  isUploadModalOpen: false,
  isDeleteConfirmOpen: false,
  deleteTargetId: null,
  toast: null,

  openOrderCardModal: () => set({ isOrderCardModalOpen: true }),
  closeOrderCardModal: () => set({ isOrderCardModalOpen: false }),

  openUploadModal: () => set({ isUploadModalOpen: true }),
  closeUploadModal: () => set({ isUploadModalOpen: false }),

  openDeleteConfirm: (id) =>
    set({ isDeleteConfirmOpen: true, deleteTargetId: id }),
  closeDeleteConfirm: () =>
    set({ isDeleteConfirmOpen: false, deleteTargetId: null }),

  showToast: (message, type) => set({ toast: { message, type } }),
  hideToast: () => set({ toast: null }),
}));

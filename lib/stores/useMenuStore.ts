import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuDocument, MenuItem } from "@/types/menu";

interface MenuState {
  // 當前菜單列表
  menus: MenuDocument[];
  // 當前查看的菜單
  currentMenu: MenuDocument | null;
  // 選中的菜單項目
  selectedItems: string[];
  // Loading 狀態
  isLoading: boolean;
  // Error 狀態
  error: string | null;

  // Actions
  setMenus: (menus: MenuDocument[]) => void;
  addMenu: (menu: MenuDocument) => void;
  setCurrentMenu: (menu: MenuDocument | null) => void;
  toggleSelectItem: (itemId: string) => void;
  clearSelection: () => void;
  setSelectedItems: (items: string[]) => void;
  deleteMenu: (menuId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  menus: [],
  currentMenu: null,
  selectedItems: [],
  isLoading: false,
  error: null,
};

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setMenus: (menus) => set({ menus }),

      addMenu: (menu) =>
        set((state) => ({
          menus: [menu, ...state.menus],
        })),

      setCurrentMenu: (menu) =>
        set({
          currentMenu: menu,
          selectedItems: menu?.selectedItems || [],
        }),

      toggleSelectItem: (itemId) =>
        set((state) => {
          const isSelected = state.selectedItems.includes(itemId);
          return {
            selectedItems: isSelected
              ? state.selectedItems.filter((id) => id !== itemId)
              : [...state.selectedItems, itemId],
          };
        }),

      clearSelection: () => set({ selectedItems: [] }),

      setSelectedItems: (items) => set({ selectedItems: items }),

      deleteMenu: (menuId) =>
        set((state) => ({
          menus: state.menus.filter((menu) => menu.id !== menuId),
          currentMenu:
            state.currentMenu?.id === menuId ? null : state.currentMenu,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "menu-storage",
      partialize: (state) => ({
        menus: state.menus,
        selectedItems: state.selectedItems,
      }),
    }
  )
);

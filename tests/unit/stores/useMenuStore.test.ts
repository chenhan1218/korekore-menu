/**
 * 單元測試範例：Zustand Store
 *
 * 測試商業邏輯，完全不依賴 UI
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMenuStore } from "@/lib/stores/useMenuStore";
import type { MenuDocument } from "@/types/menu";

describe("useMenuStore", () => {
  // 每個測試前重置 store
  beforeEach(() => {
    useMenuStore.getState().reset();
  });

  describe("菜單管理", () => {
    it("應該能新增菜單", () => {
      const { result } = renderHook(() => useMenuStore());

      const mockMenu: MenuDocument = {
        id: "menu-1",
        userId: "user-1",
        imageUrl: "https://example.com/menu.jpg",
        menuItems: [
          {
            id: "item-1",
            name: "ラーメン",
            name_zh_TW: "拉麵",
            price: "¥800",
          },
        ],
        language: "ja",
        createdAt: { seconds: 1234567890, nanoseconds: 0 } as any,
        updatedAt: { seconds: 1234567890, nanoseconds: 0 } as any,
      };

      act(() => {
        result.current.addMenu(mockMenu);
      });

      expect(result.current.menus).toHaveLength(1);
      expect(result.current.menus[0].id).toBe("menu-1");
    });

    it("應該能刪除菜單", () => {
      const { result } = renderHook(() => useMenuStore());

      const mockMenu: MenuDocument = {
        id: "menu-1",
        userId: "user-1",
        imageUrl: "https://example.com/menu.jpg",
        menuItems: [],
        language: "ja",
        createdAt: { seconds: 1234567890, nanoseconds: 0 } as any,
        updatedAt: { seconds: 1234567890, nanoseconds: 0 } as any,
      };

      act(() => {
        result.current.addMenu(mockMenu);
        result.current.deleteMenu("menu-1");
      });

      expect(result.current.menus).toHaveLength(0);
    });
  });

  describe("選擇項目", () => {
    it("應該能切換選中狀態", () => {
      const { result } = renderHook(() => useMenuStore());

      act(() => {
        result.current.toggleSelectItem("item-1");
      });

      expect(result.current.selectedItems).toContain("item-1");

      act(() => {
        result.current.toggleSelectItem("item-1");
      });

      expect(result.current.selectedItems).not.toContain("item-1");
    });

    it("應該能清除所有選擇", () => {
      const { result } = renderHook(() => useMenuStore());

      act(() => {
        result.current.setSelectedItems(["item-1", "item-2", "item-3"]);
        result.current.clearSelection();
      });

      expect(result.current.selectedItems).toHaveLength(0);
    });
  });

  describe("Loading 狀態", () => {
    it("應該能設定 loading 狀態", () => {
      const { result } = renderHook(() => useMenuStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});

/**
 * 單元測試範例：工具函數
 *
 * 測試純函數邏輯
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { getDeviceId, clearDeviceId } from "@/lib/utils/device-id";

describe("Device ID 工具", () => {
  // Mock localStorage
  beforeEach(() => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });

    localStorage.clear();
  });

  describe("getDeviceId", () => {
    it("應該在第一次調用時生成新的 device ID", () => {
      const deviceId = getDeviceId();

      expect(deviceId).toBeTruthy();
      expect(deviceId).toMatch(/^device_\d+_[a-z0-9]+$/);
    });

    it("應該在後續調用時返回相同的 device ID", () => {
      const firstId = getDeviceId();
      const secondId = getDeviceId();

      expect(firstId).toBe(secondId);
    });

    it("應該將 device ID 儲存到 localStorage", () => {
      const deviceId = getDeviceId();
      const stored = localStorage.getItem("korekore_device_id");

      expect(stored).toBe(deviceId);
    });
  });

  describe("clearDeviceId", () => {
    it("應該能清除儲存的 device ID", () => {
      getDeviceId(); // 先生成
      clearDeviceId(); // 清除

      const stored = localStorage.getItem("korekore_device_id");
      expect(stored).toBeNull();
    });

    it("清除後重新取得應該生成新的 ID", () => {
      const firstId = getDeviceId();
      clearDeviceId();
      const secondId = getDeviceId();

      expect(firstId).not.toBe(secondId);
    });
  });
});

/**
 * 取得或建立裝置 ID（用於匿名使用者）
 * @returns 裝置 ID
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  const storageKey = "korekore_device_id";
  let deviceId = localStorage.getItem(storageKey);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, deviceId);
  }

  return deviceId;
}

/**
 * 清除裝置 ID
 */
export function clearDeviceId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("korekore_device_id");
}

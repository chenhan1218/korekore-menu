/**
 * 抽象的主要按鈕元件
 * 底層實作可替換（目前使用 shadcn/ui）
 */

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

/**
 * 主要按鈕元件
 *
 * 遷移其他 UI 框架時，只需修改此檔案的實作，
 * 不需要改動使用此元件的頁面
 *
 * @example
 * <PrimaryButton size="lg" onClick={handleClick}>
 *   上傳菜單
 * </PrimaryButton>
 */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  fullWidth,
  size = "md",
  variant = "primary",
  type = "button",
  icon,
}: PrimaryButtonProps) {
  // 轉換抽象的 size 到 shadcn/ui 的規格
  const uiSize = {
    sm: "sm" as const,
    md: "default" as const,
    lg: "lg" as const,
  }[size];

  // 轉換抽象的 variant 到 shadcn/ui 的規格
  const uiVariant = {
    primary: "default" as const,
    secondary: "secondary" as const,
    outline: "outline" as const,
    ghost: "ghost" as const,
  }[variant];

  return (
    <Button
      size={uiSize}
      variant={uiVariant}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={fullWidth ? "w-full" : ""}
    >
      {loading && <span className="mr-2">⏳</span>}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
}

/**
 * 未來遷移到 Material-UI 時的實作範例：
 *
 * import { Button as MuiButton } from '@mui/material';
 *
 * export function PrimaryButton({ ... }) {
 *   return (
 *     <MuiButton
 *       size={size}
 *       variant={variant === 'primary' ? 'contained' : variant}
 *     >
 *       {children}
 *     </MuiButton>
 *   );
 * }
 */

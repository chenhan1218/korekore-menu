/**
 * 抽象的卡片元件
 * 底層實作可替換（目前使用 shadcn/ui）
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";

interface MenuCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * 菜單卡片元件
 *
 * 提供統一的卡片介面，方便未來替換 UI 框架
 *
 * @example
 * <MenuCard title="菜單" description="點擊查看詳情">
 *   <MenuItem />
 * </MenuCard>
 */
export function MenuCard({
  title,
  description,
  children,
  footer,
  className,
  onClick,
}: MenuCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <div className="px-6 pb-6">{footer}</div>}
    </Card>
  );
}

/**
 * 未來遷移到其他框架的實作範例：
 *
 * // Ant Design
 * import { Card as AntCard } from 'antd';
 *
 * // Chakra UI
 * import { Box, Heading, Text } from '@chakra-ui/react';
 */

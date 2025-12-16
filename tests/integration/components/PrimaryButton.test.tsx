/**
 * 整合測試範例：UI 元件
 *
 * 測試元件的渲染和互動行為
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Upload } from "lucide-react";

describe("PrimaryButton 元件", () => {
  it("應該正確渲染文字", () => {
    render(<PrimaryButton>點擊我</PrimaryButton>);

    expect(screen.getByRole("button")).toHaveTextContent("點擊我");
  });

  it("應該在點擊時觸發 onClick 回調", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<PrimaryButton onClick={handleClick}>點擊我</PrimaryButton>);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 狀態下不應該觸發點擊", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PrimaryButton onClick={handleClick} disabled>
        點擊我
      </PrimaryButton>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("應該顯示 loading 狀態", () => {
    render(<PrimaryButton loading>上傳中</PrimaryButton>);

    expect(screen.getByText("⏳")).toBeInTheDocument();
  });

  it("應該正確渲染圖示", () => {
    render(
      <PrimaryButton icon={<Upload data-testid="upload-icon" />}>
        上傳
      </PrimaryButton>
    );

    expect(screen.getByTestId("upload-icon")).toBeInTheDocument();
  });

  it("fullWidth 應該套用正確的樣式", () => {
    render(<PrimaryButton fullWidth>全寬按鈕</PrimaryButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });

  describe("不同尺寸", () => {
    it.each([
      ["sm", "small"],
      ["md", "default"],
      ["lg", "large"],
    ] as const)("應該正確渲染 %s 尺寸", (size) => {
      render(<PrimaryButton size={size}>按鈕</PrimaryButton>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("不同變體", () => {
    it.each([
      "primary",
      "secondary",
      "outline",
      "ghost",
    ] as const)("應該正確渲染 %s 變體", (variant) => {
      render(<PrimaryButton variant={variant}>按鈕</PrimaryButton>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});

/**
 * 通用 UI 元件 - 抽象層
 *
 * 這些元件提供統一的 API，隔離底層 UI 框架的實作細節
 * 當需要更換 UI 框架時，只需修改這些元件的實作，
 * 不需要改動使用這些元件的業務代碼
 */

export { PrimaryButton } from "./PrimaryButton";
export { MenuCard } from "./MenuCard";

/**
 * 未來可以添加更多抽象元件：
 *
 * export { Input } from "./Input";
 * export { Select } from "./Select";
 * export { Modal } from "./Modal";
 * export { Toast } from "./Toast";
 * export { Checkbox } from "./Checkbox";
 * ...
 */

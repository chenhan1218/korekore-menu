/**
 * Zustand store exports
 *
 * Centralized export point for all application stores
 */

export { useMenuStore, selectCurrentMenu, selectImageUrl, selectIsParsing, selectParseError } from './menuStore'
export type { MenuState } from './menuStore'

export {
  useOrderStore,
  selectSelectedItems,
  selectOrderTotal,
} from './orderStore'
export type { OrderState, OrderItem } from './orderStore'

export {
  useUIStore,
  selectIsLoading,
  selectGlobalError,
  selectToasts,
  selectIsModalOpen,
} from './uiStore'
export type { UIState, Toast } from './uiStore'

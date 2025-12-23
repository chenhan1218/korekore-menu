import { describe, it, expect } from 'vitest'
import { routes } from '../router'

/**
 * Tests for application routing configuration
 *
 * Verifies:
 * - All routes are defined correctly
 * - Path routing is correct
 * - 404 fallback is present
 */
describe('Application Router', () => {
  it('should have home route at root path', () => {
    const homeRoute = routes.find((route) => route.path === '/')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.element).toBeDefined()
  })

  it('should have scan route at /scan path', () => {
    const scanRoute = routes.find((route) => route.path === '/scan')
    expect(scanRoute).toBeDefined()
    expect(scanRoute?.element).toBeDefined()
  })

  it('should have menu detail route at /menu path', () => {
    const menuRoute = routes.find((route) => route.path === '/menu')
    expect(menuRoute).toBeDefined()
    expect(menuRoute?.element).toBeDefined()
  })

  it('should have order card route at /order-card path', () => {
    const orderRoute = routes.find((route) => route.path === '/order-card')
    expect(orderRoute).toBeDefined()
    expect(orderRoute?.element).toBeDefined()
  })

  it('should have fallback route for 404 errors', () => {
    const fallbackRoute = routes.find((route) => route.path === '*')
    expect(fallbackRoute).toBeDefined()
    expect(fallbackRoute?.element).toBeDefined()
  })

  it('should have exactly 5 routes (4 main + 1 fallback)', () => {
    expect(routes.length).toBe(5)
  })
})

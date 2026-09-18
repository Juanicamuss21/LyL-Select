'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  hasHydrated: boolean
  lastAddedId: string | null
  
  // Actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  clearCart: () => void
  setHasHydrated: (state: boolean) => void
  setLastAddedId: (id: string | null) => void
  
  // Getters
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      lastAddedId: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setLastAddedId: (id) => set({ lastAddedId: id }),

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === newItem.id)
          const addQty = newItem.cantidad ?? 1

          if (existingIndex > -1) {
            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              cantidad: updatedItems[existingIndex].cantidad + addQty,
            }
            return { items: updatedItems, isOpen: true, lastAddedId: newItem.id }
          }

          return {
            items: [...state.items, { ...newItem, cantidad: addQty }],
            isOpen: true,
            lastAddedId: newItem.id,
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const updatedItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.cantidad + delta
                return newQty > 0 ? { ...item, cantidad: newQty } : null
              }
              return item
            })
            .filter((item): item is CartItem => item !== null)

          return { items: updatedItems }
        })
      },

      clearCart: () => set({ items: [] }),

      setHasHydrated: (status) => set({ hasHydrated: status }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.cantidad, 0)
      },
    }),
    {
      name: 'lyl-select-cart-v1',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

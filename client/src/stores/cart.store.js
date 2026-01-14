/**
 * Cart Store
 * Shopping cart state management
 */

import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        customizations: {}
    }),

    getters: {
        itemCount: (state) => {
            return state.items.reduce((total, item) => total + item.quantity, 0)
        },

        subtotal: (state) => {
            return state.items.reduce((total, item) => {
                const itemPrice = parseFloat(item.basePrice) + parseFloat(item.variantAdjustment || 0)
                return total + (itemPrice * item.quantity)
            }, 0)
        },

        total: (state, getters) => {
            // Can add tax, shipping, etc here
            return getters.subtotal
        },

        isEmpty: (state) => {
            return state.items.length === 0
        }
    },

    actions: {
        addItem(product, variant = null, quantity = 1) {
            const itemId = variant ? `${product.id}-${variant.id}` : product.id

            const existingItem = this.items.find(item => item.itemId === itemId)

            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                this.items.push({
                    itemId,
                    productId: product.id,
                    productName: product.name,
                    productSlug: product.slug,
                    basePrice: product.basePrice,
                    image: product.image,
                    variantId: variant?.id || null,
                    variantName: variant?.name || null,
                    variantAdjustment: variant?.priceAdj || 0,
                    quantity
                })
            }
        },

        removeItem(itemId) {
            const index = this.items.findIndex(item => item.itemId === itemId)
            if (index > -1) {
                this.items.splice(index, 1)
            }
        },

        updateQuantity(itemId, quantity) {
            const item = this.items.find(item => item.itemId === itemId)
            if (item) {
                if (quantity <= 0) {
                    this.removeItem(itemId)
                } else {
                    item.quantity = quantity
                }
            }
        },

        clearCart() {
            this.items = []
            this.customizations = {}
        },

        setCustomization(productId, customization) {
            this.customizations[productId] = customization
        }
    },

    persist: true // Persist cart to localStorage
})

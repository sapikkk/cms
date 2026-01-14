/**
 * Page Store
 * Manages active page configuration and dynamic content
 */

import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
    state: () => ({
        currentPage: null,
        sections: [],
        isEditMode: false,
        isDirty: false,

        // Page metadata
        metadata: {
            title: '',
            slug: '',
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            ogImage: '',
            isPublished: false,
            inNavbar: false,
            navOrder: 0
        }
    }),

    getters: {
        hasUnsavedChanges: (state) => state.isDirty,
        isPublished: (state) => state.metadata.isPublished,
        pageTitle: (state) => state.metadata.title,
        sectionCount: (state) => state.sections.length
    },

    actions: {
        setCurrentPage(page) {
            this.currentPage = page

            if (page) {
                this.sections = page.sections || []
                this.metadata = {
                    title: page.title || '',
                    slug: page.slug || '',
                    metaTitle: page.metaTitle || '',
                    metaDescription: page.metaDescription || '',
                    metaKeywords: page.metaKeywords || '',
                    ogImage: page.ogImage || '',
                    isPublished: page.isPublished || false,
                    inNavbar: page.inNavbar || false,
                    navOrder: page.navOrder || 0
                }
            }

            this.isDirty = false
        },

        updateSections(sections) {
            this.sections = sections
            this.isDirty = true
        },

        updateMetadata(metadata) {
            this.metadata = { ...this.metadata, ...metadata }
            this.isDirty = true
        },

        toggleEditMode() {
            this.isEditMode = !this.isEditMode
        },

        setEditMode(mode) {
            this.isEditMode = mode
        },

        markSaved() {
            this.isDirty = false
        },

        markDirty() {
            this.isDirty = true
        },

        clearPage() {
            this.currentPage = null
            this.sections = []
            this.isEditMode = false
            this.isDirty = false
            this.metadata = {
                title: '',
                slug: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: '',
                ogImage: '',
                isPublished: false,
                inNavbar: false,
                navOrder: 0
            }
        },

        publishPage() {
            this.metadata.isPublished = true
            this.isDirty = true
        },

        unpublishPage() {
            this.metadata.isPublished = false
            this.isDirty = true
        }
    }
})

/**
 * Page Builder Composable
 * Logic for building dynamic JSON-based page structures
 */

import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export function usePageBuilder() {
    const sections = ref([])
    const activeSectionId = ref(null)

    // Available widget types
    const widgetTypes = [
        { type: 'HeroBanner', name: 'Hero Banner', icon: 'image' },
        { type: 'ProductCatalog', name: 'Product Catalog', icon: 'shopping-cart' },
        { type: 'TextBlock', name: 'Text Block', icon: 'file-text' },
        { type: 'EventCalendar', name: 'Event Calendar', icon: 'calendar' }
    ]

    // Get active section
    const activeSection = computed(() => {
        return sections.value.find(s => s.id === activeSectionId.value)
    })

    /**
     * Add a new section/widget to the page
     */
    const addSection = (widgetType) => {
        const id = uuidv4()

        const defaultProps = getDefaultProps(widgetType)

        const newSection = {
            id,
            type: widgetType,
            props: defaultProps
        }

        sections.value.push(newSection)
        activeSectionId.value = id

        return newSection
    }

    /**
     * Remove a section
     */
    const removeSection = (sectionId) => {
        const index = sections.value.findIndex(s => s.id === sectionId)
        if (index > -1) {
            sections.value.splice(index, 1)

            // Clear active if removed
            if (activeSectionId.value === sectionId) {
                activeSectionId.value = null
            }
        }
    }

    /**
     * Update section properties
     */
    const updateSectionProps = (sectionId, newProps) => {
        const section = sections.value.find(s => s.id === sectionId)
        if (section) {
            section.props = { ...section.props, ...newProps }
        }
    }

    /**
     * Move section up/down
     */
    const moveSectionUp = (sectionId) => {
        const index = sections.value.findIndex(s => s.id === sectionId)
        if (index > 0) {
            const temp = sections.value[index]
            sections.value[index] = sections.value[index - 1]
            sections.value[index - 1] = temp
        }
    }

    const moveSectionDown = (sectionId) => {
        const index = sections.value.findIndex(s => s.id === sectionId)
        if (index < sections.value.length - 1) {
            const temp = sections.value[index]
            sections.value[index] = sections.value[index + 1]
            sections.value[index + 1] = temp
        }
    }

    /**
     * Duplicate a section
     */
    const duplicateSection = (sectionId) => {
        const section = sections.value.find(s => s.id === sectionId)
        if (section) {
            const newSection = {
                ...section,
                id: uuidv4(),
                props: { ...section.props }
            }
            sections.value.push(newSection)
            return newSection
        }
    }

    /**
     * Set active section for editing
     */
    const setActiveSection = (sectionId) => {
        activeSectionId.value = sectionId
    }

    /**
     * Load sections from JSON
     */
    const loadSections = (jsonSections) => {
        if (Array.isArray(jsonSections)) {
            sections.value = jsonSections
        }
    }

    /**
     * Export sections as JSON
     */
    const exportJSON = () => {
        return JSON.parse(JSON.stringify(sections.value))
    }

    /**
     * Clear all sections
     */
    const clearAll = () => {
        sections.value = []
        activeSectionId.value = null
    }

    /**
     * Get default props for widget type
     */
    function getDefaultProps(widgetType) {
        const defaults = {
            HeroBanner: {
                title: 'Welcome to Our Coffee Shop',
                subtitle: 'Best coffee in town',
                image: '',
                ctaText: 'Order Now',
                ctaLink: '/products'
            },
            ProductCatalog: {
                categoryId: '',
                layout: 'grid',
                columns: 3,
                showPrice: true
            },
            TextBlock: {
                content: '<p>Your content here...</p>',
                alignment: 'center'
            },
            EventCalendar: {
                events: [],
                viewMode: 'month'
            }
        }

        return defaults[widgetType] || {}
    }

    return {
        // State
        sections,
        activeSectionId,
        activeSection,
        widgetTypes,

        // Methods
        addSection,
        removeSection,
        updateSectionProps,
        moveSectionUp,
        moveSectionDown,
        duplicateSection,
        setActiveSection,
        loadSections,
        exportJSON,
        clearAll
    }
}

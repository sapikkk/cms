/**
 * Export Helper
 * Generate PDF and Excel exports
 */

import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

/**
 * Export data to PDF
 */
export function exportToPDF(options) {
    const {
        title = 'Export Report',
        filename = 'export.pdf',
        headers = [],
        data = [],
        orientation = 'portrait', // 'portrait' or 'landscape'
        pageSize = 'a4'
    } = options

    // Create new PDF document
    const doc = new jsPDF(orientation, 'mm', pageSize)

    // Add title
    doc.setFontSize(16)
    doc.text(title, 14, 15)

    // Add generation date
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString('id-ID')}`, 14, 22)

    // Add table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 28,
        styles: {
            fontSize: 9,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [139, 69, 19], // Coffee color
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    })

    // Save PDF
    doc.save(filename)
}

/**
 * Export data to Excel
 */
export function exportToExcel(options) {
    const {
        filename = 'export.xlsx',
        sheetName = 'Sheet1',
        data = [],
        headers = []
    } = options

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data, {
        header: headers.length > 0 ? headers : undefined
    })

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Auto-size columns
    const maxWidth = 50
    const colWidths = []

    if (headers.length > 0) {
        headers.forEach((header, i) => {
            const headerLen = header.length
            const dataLen = Math.max(
                ...data.map(row => {
                    const val = row[header]
                    return val ? val.toString().length : 0
                })
            )
            colWidths[i] = { wch: Math.min(Math.max(headerLen, dataLen) + 2, maxWidth) }
        })
        ws['!cols'] = colWidths
    }

    // Save file
    XLSX.writeFile(wb, filename)
}

/**
 * Export table data to CSV
 */
export function exportToCSV(options) {
    const {
        filename = 'export.csv',
        data = [],
        headers = []
    } = options

    // Convert data to CSV format
    let csvContent = ''

    // Add headers
    if (headers.length > 0) {
        csvContent += headers.map(h => `"${h}"`).join(',') + '\n'
    }

    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const val = row[header]
            return `"${val !== null && val !== undefined ? val : ''}"`
        })
        csvContent += values.join(',') + '\n'
    })

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Print HTML content
 */
export function printHTML(content, title = 'Print') {
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
        alert('Please allow popups for printing')
        return
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #8B4513;
                    color: white;
                }
                @media print {
                    button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            ${content}
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    }
                }
            </script>
        </body>
        </html>
    `)

    printWindow.document.close()
}

/**
 * Download file from URL
 */
export function downloadFile(url, filename) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Convert blob to base64
 */
export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

export default {
    exportToPDF,
    exportToExcel,
    exportToCSV,
    printHTML,
    downloadFile,
    blobToBase64
}

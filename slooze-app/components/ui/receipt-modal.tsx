'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Receipt, ReceiptOrder } from '@/components/ui/receipt'
import { X, Download, Printer, FileText } from 'lucide-react'

interface ReceiptModalProps {
  order: ReceiptOrder
  isOpen: boolean
  onClose: () => void
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handlePrint = () => {
    if (!receiptRef.current) return

    const printContent = receiptRef.current.innerHTML
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - Order #${order.id.slice(0, 8)}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 12px;
                padding: 20px;
                max-width: 350px;
                margin: 0 auto;
                background: white;
                color: black;
              }
              .receipt-container {
                background: white;
                padding: 20px;
              }
              .logo-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 20px;
              }
              .logo {
                width: 60px;
                height: 60px;
                background: #FF6B6B;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
              }
              .logo svg {
                width: 30px;
                height: 30px;
                color: white;
              }
              h1 {
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 3px;
                text-align: center;
              }
              .subtitle {
                font-size: 10px;
                color: #666;
                margin-top: 4px;
              }
              .restaurant-details {
                text-align: center;
                margin-bottom: 20px;
              }
              .restaurant-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .restaurant-info {
                font-size: 10px;
                color: #666;
              }
              .divider {
                border-top: 2px dashed #ccc;
                margin: 15px 0;
              }
              .items {
                margin-bottom: 15px;
              }
              .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
              .item-name {
                flex: 1;
              }
              .item-price {
                text-align: right;
                white-space: nowrap;
              }
              .totals {
                margin-bottom: 15px;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
              }
              .total-row.final {
                font-weight: bold;
                font-size: 16px;
                padding-top: 8px;
                border-top: 1px solid #ddd;
                margin-top: 8px;
              }
              .payment-info, .customer-info, .order-date {
                text-align: center;
                font-size: 10px;
                color: #666;
                margin-bottom: 15px;
              }
              .thank-you {
                text-align: center;
                margin-top: 20px;
              }
              .thank-you-text {
                font-weight: bold;
              }
              .thank-you-sub {
                font-size: 10px;
                color: #666;
                margin-top: 4px;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 10px;
                font-weight: bold;
                margin-top: 15px;
              }
              .status-delivered {
                background: #dcfce7;
                color: #15803d;
              }
              .status-cancelled {
                background: #fee2e2;
                color: #b91c1c;
              }
              .status-confirmed {
                background: #dbeafe;
                color: #1d4ed8;
              }
              .status-pending {
                background: #fef9c3;
                color: #a16207;
              }
              @media print {
                body {
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()

      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return

    setIsGenerating(true)

    try {
      // Create a new window for PDF generation
      const printContent = receiptRef.current.innerHTML
      const printWindow = window.open('', '_blank')

      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Receipt - Order #${order.id.slice(0, 8)}</title>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                body {
                  font-family: 'Courier New', Courier, monospace;
                  font-size: 12px;
                  padding: 20px;
                  max-width: 350px;
                  margin: 0 auto;
                  background: white;
                  color: black;
                }
                .receipt-container {
                  background: white;
                  padding: 20px;
                }
                .logo-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-bottom: 20px;
                }
                .logo {
                  width: 60px;
                  height: 60px;
                  background: #FF6B6B;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 10px;
                }
                h1 {
                  font-size: 20px;
                  font-weight: bold;
                  letter-spacing: 3px;
                  text-align: center;
                }
                .subtitle {
                  font-size: 10px;
                  color: #666;
                  margin-top: 4px;
                }
                .restaurant-details {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .restaurant-name {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 4px;
                }
                .restaurant-info {
                  font-size: 10px;
                  color: #666;
                }
                .divider {
                  border-top: 2px dashed #ccc;
                  margin: 15px 0;
                }
                .items {
                  margin-bottom: 15px;
                }
                .item {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .item-name {
                  flex: 1;
                }
                .item-price {
                  text-align: right;
                  white-space: nowrap;
                }
                .totals {
                  margin-bottom: 15px;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 4px;
                }
                .total-row.final {
                  font-weight: bold;
                  font-size: 16px;
                  padding-top: 8px;
                  border-top: 1px solid #ddd;
                  margin-top: 8px;
                }
                .payment-info, .customer-info, .order-date {
                  text-align: center;
                  font-size: 10px;
                  color: #666;
                  margin-bottom: 15px;
                }
                .thank-you {
                  text-align: center;
                  margin-top: 20px;
                }
                .thank-you-text {
                  font-weight: bold;
                }
                .thank-you-sub {
                  font-size: 10px;
                  color: #666;
                  margin-top: 4px;
                }
                .status-badge {
                  display: inline-block;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 10px;
                  font-weight: bold;
                  margin-top: 15px;
                }
                .status-delivered {
                  background: #dcfce7;
                  color: #15803d;
                }
                .status-cancelled {
                  background: #fee2e2;
                  color: #b91c1c;
                }
                .status-confirmed {
                  background: #dbeafe;
                  color: #1d4ed8;
                }
                .status-pending {
                  background: #fef9c3;
                  color: #a16207;
                }
              </style>
            </head>
            <body>
              ${printContent}
              <script>
                // Trigger print dialog configured to save as PDF
                window.onload = function() {
                  window.print();
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <h2 className="text-lg font-bold">Payment Receipt</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handlePrint}
            >
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-coral hover:bg-coral/90"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
            >
              <Download size={16} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          {/* Receipt Preview */}
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            <Receipt ref={receiptRef} order={order} taxRate={0.08} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

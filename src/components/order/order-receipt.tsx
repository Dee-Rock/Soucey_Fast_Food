"use client";

import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { OrderResponse } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface OrderReceiptProps {
  order: OrderResponse;
  className?: string;
}

export function OrderReceipt({ order, className = "" }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const receiptElement = receiptRef.current;

    if (!receiptElement) return;

    // Add content to PDF
    doc.html(receiptElement, {
      callback: (pdf) => {
        pdf.save(`receipt-${order.orderNumber}.pdf`);
      },
      margin: 10,
      html2canvas: {
        scale: 0.7,
        useCORS: true,
      },
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 print:p-0 ${className}`} ref={receiptRef}>
      <div className="print:hidden flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Order Receipt</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="print:block">
        <div className="text-center mb-6 print:mb-4">
          <h1 className="text-2xl font-bold text-pink-600">Soucey Fast Food</h1>
          <p className="text-gray-500 text-sm">Order Receipt</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Order #:</span> {order.orderNumber}</p>
              <p><span className="font-medium">Date:</span> {format(new Date(order.createdAt), "PPPp")}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{order.status}</span></p>
              <p><span className="font-medium">Payment:</span> <span className="capitalize">{order.paymentStatus}</span></p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>{order.customer?.name || 'N/A'}</p>
              <p>{order.customer?.email || 'N/A'}</p>
              <p>{order.customer?.phone || 'N/A'}</p>
              <p>{order.address || 'N/A'}</p>
              {order.landmark && <p>Landmark: {order.landmark}</p>}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Order Items</h3>
          <div className="space-y-4 mb-6">
            {order.items?.map((item) => (
              <div key={item._id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  {item.notes && <p className="text-sm text-gray-500">Note: {item.notes}</p>}
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatPrice(order.deliveryFee || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 print:mt-6 print:pt-2">
          <p>Thank you for your order!</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}

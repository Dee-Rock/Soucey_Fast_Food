import * as React from 'react';
import { format } from 'date-fns';

export function ReceiptEmail({ order }: { order: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(price);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#EC4899', textAlign: 'center', fontSize: '24px', marginBottom: '5px' }}>Soucey Fast Food</h1>
      <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '25px', color: '#4B5563' }}>Order Confirmation</h2>
      
      <div style={{ backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '25px', borderLeft: '4px solid #EC4899' }}>
        <p style={{ margin: '0 0 10px 0', color: '#111827' }}>Hello {order.customer?.name || 'Valued Customer'},</p>
        <p style={{ margin: '0', color: '#4B5563' }}>Thank you for your order! We're getting it ready to be delivered. You'll receive a notification when your order is on its way.</p>
      </div>
      
      <div style={{ marginBottom: '30px', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '10px', marginBottom: '20px', fontSize: '18px', color: '#111827' }}>
          Order Summary
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Order #</span>
            <span style={{ fontWeight: '500' }}>{order.orderNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Order Date</span>
            <span>{format(new Date(order.createdAt), 'PPPpp')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Status</span>
            <span style={{ 
              color: order.status === 'delivered' ? '#10B981' : 
                     order.status === 'cancelled' ? '#EF4444' : 
                     order.status === 'processing' ? '#3B82F6' : '#F59E0B',
              textTransform: 'capitalize'
            }}>
              {order.status}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Payment Status</span>
            <span style={{ 
              color: order.paymentStatus === 'paid' ? '#10B981' : 
                     order.paymentStatus === 'failed' ? '#EF4444' : '#F59E0B',
              textTransform: 'capitalize'
            }}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
        
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ fontWeight: '600', marginBottom: '12px', color: '#111827' }}>Order Items</h4>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
            {order.items?.map((item: any, index: number) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '12px 15px',
                  backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white',
                  borderBottom: index < order.items.length - 1 ? '1px solid #E5E7EB' : 'none'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{item.quantity}x {item.name}</div>
                  {item.notes && (
                    <div style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
                      Note: {item.notes}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: '500' }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Subtotal:</span>
            <span>{formatPrice(order.subtotal || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Delivery Fee:</span>
            <span>{formatPrice(order.deliveryFee || 0)}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 'bold', 
            fontSize: '18px', 
            marginTop: '15px',
            paddingTop: '10px',
            borderTop: '1px dashed #E5E7EB'
          }}>
            <span>Total:</span>
            <span>{formatPrice(order.total || 0)}</span>
          </div>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#F3F4F6', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '25px',
        borderLeft: '4px solid #9CA3AF'
      }}>
        <h4 style={{ marginTop: '0', marginBottom: '15px', fontSize: '16px', color: '#111827' }}>Delivery Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px' }}>
          <div style={{ color: '#6B7280' }}>Name:</div>
          <div>{order.customer?.name || 'N/A'}</div>
          
          <div style={{ color: '#6B7280' }}>Email:</div>
          <div>{order.customer?.email || 'N/A'}</div>
          
          <div style={{ color: '#6B7280' }}>Phone:</div>
          <div>{order.customer?.phone || 'N/A'}</div>
          
          <div style={{ color: '#6B7280' }}>Address:</div>
          <div>{order.address || 'N/A'}</div>
          
          {order.landmark && (
            <>
              <div style={{ color: '#6B7280' }}>Landmark:</div>
              <div>{order.landmark}</div>
            </>
          )}
        </div>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        color: '#6B7280', 
        fontSize: '14px', 
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #E5E7EB'
      }}>
        <p style={{ margin: '0 0 10px 0' }}>If you have any questions about your order, please contact our support team at support@souceyfood.com</p>
        <p style={{ margin: '0 0 20px 0' }}>Thank you for choosing Soucey Fast Food!</p>
        
        <div style={{ marginTop: '25px', fontSize: '12px', color: '#9CA3AF' }}>
          <p style={{ margin: '5px 0' }}>© {new Date().getFullYear()} Soucey Fast Food. All rights reserved.</p>
          <p style={{ margin: '5px 0' }}>123 Food Street, Accra, Ghana</p>
        </div>
      </div>
    </div>
  );
}

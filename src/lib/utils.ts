import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | undefined | null): string {
  const numPrice = Number(price) || 0;
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numPrice);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function generateOrderId(): string {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`
}

export function calculateDeliveryTime(distance: number): number {
  // Assuming average delivery speed is 15km/h
  // Adding 15 minutes for food preparation
  const deliveryTimeInMinutes = (distance / 15) * 60 + 15
  return Math.ceil(deliveryTimeInMinutes)
}

export function getRandomDeliveryTime(): number {
  // Random delivery time between 20 and 45 minutes
  return Math.floor(Math.random() * 25) + 20
}

export function formatPhoneNumber(phoneNumber: string | undefined | null): string {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Check if the phone number is a valid length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  // Return the original if it doesn't match expected format
  return phoneNumber;
}

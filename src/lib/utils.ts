import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine Tailwind classes with clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation: at least 8 characters, with number and special character
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && 
         /\d/.test(password) && 
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

// Check if passwords match
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}




// Format username from first name and last name
export function formatUsername(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// Get age from birth date
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string): string {
  // Basic formatting, could be expanded based on regional requirements
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}
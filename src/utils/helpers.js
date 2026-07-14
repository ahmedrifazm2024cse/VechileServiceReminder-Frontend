import { format, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  } catch {
    return date;
  }
};

export const getDaysLabel = (days) => {
  if (days === null || days === undefined) return '';
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days remaining`;
};

export const getServiceStatus = (daysUntil) => {
  if (daysUntil < 0) return { label: 'Overdue', color: '#ef4444', bg: '#fee2e2', class: 'badge-danger' };
  if (daysUntil === 0) return { label: 'Due Today', color: '#dc2626', bg: '#fee2e2', class: 'badge-danger' };
  if (daysUntil <= 7) return { label: 'Urgent', color: '#d97706', bg: '#fef3c7', class: 'badge-warning' };
  if (daysUntil <= 30) return { label: 'Upcoming', color: '#2563eb', bg: '#eff6ff', class: 'badge-info' };
  return { label: 'On Track', color: '#059669', bg: '#d1fae5', class: 'badge-success' };
};

export const getFuelTypeLabel = (type) => {
  const map = {
    petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric',
    hybrid: 'Hybrid', cng: 'CNG', lpg: 'LPG', other: 'Other'
  };
  return map[type] || type;
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency, minimumFractionDigits: 0
  }).format(amount || 0);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0);
};

export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? `${str.substring(0, len)}...` : str;
};

export const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const getErrorMessage = (error) => {
  if (!error?.response) return 'Network error. Please check your connection.';
  const data = error.response.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (data?.errors) {
    const errors = data.errors;
    const first = Object.values(errors)[0];
    return Array.isArray(first) ? first[0] : first;
  }
  return 'Something went wrong. Please try again.';
};

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cng', label: 'CNG' },
  { value: 'lpg', label: 'LPG' },
  { value: 'other', label: 'Other' },
];

export const REMINDER_DAYS_OPTIONS = [
  { value: 1, label: '1 Day Before' },
  { value: 3, label: '3 Days Before' },
  { value: 7, label: '7 Days Before' },
  { value: 15, label: '15 Days Before' },
  { value: 30, label: '30 Days Before' },
];

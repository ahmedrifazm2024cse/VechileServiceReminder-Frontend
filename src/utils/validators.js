export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return '';
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Enter a valid email address';
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
    return '';
  },

  phone: (value) => {
    if (!value) return '';
    const phoneRegex = /^[+]?[\d\s\-()]{7,15}$/;
    if (!phoneRegex.test(value)) return 'Enter a valid phone number';
    return '';
  },

  registrationNumber: (value) => {
    if (!value) return 'Registration number is required';
    if (value.trim().length < 3) return 'Registration number must be at least 3 characters';
    return '';
  },

  year: (value) => {
    const current = new Date().getFullYear();
    if (!value) return 'Year is required';
    if (value < 1900 || value > current + 1) {
      return `Year must be between 1900 and ${current + 1}`;
    }
    return '';
  },

  positiveNumber: (value, label = 'Value') => {
    if (value === '' || value === null || value === undefined) return `${label} is required`;
    if (isNaN(value) || Number(value) < 0) return `${label} must be a positive number`;
    return '';
  },

  image: (file) => {
    if (!file) return '';
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return 'Only JPEG, PNG and WebP images are allowed';
    if (file.size > 5 * 1024 * 1024) return 'Image must be smaller than 5 MB';
    return '';
  },

  confirm: (value, original) => {
    if (!value) return 'Please confirm your password';
    if (value !== original) return 'Passwords do not match';
    return '';
  },
};

export const validateForm = (data, rules) => {
  const errors = {};
  let hasErrors = false;
  Object.keys(rules).forEach(field => {
    const validate = rules[field];
    const error = validate(data[field], data);
    if (error) {
      errors[field] = error;
      hasErrors = true;
    }
  });
  return { errors, hasErrors };
};

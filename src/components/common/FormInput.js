import React from 'react';

const FormInput = ({
  label, name, type = 'text', value, onChange, onBlur,
  error, placeholder, required, disabled, min, max,
  hint, children, style = {}
}) => {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && (
        <label htmlFor={name} style={{
          display: 'block', marginBottom: 6,
          fontSize: 13, fontWeight: 500, color: '#374151',
        }}>
          {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      {children || (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          required={required}
          style={{
            width: '100%', padding: '10px 13px',
            border: `1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
            borderRadius: 10, fontSize: 14,
            outline: 'none', background: disabled ? '#f8fafc' : '#fff',
            color: '#0f172a', boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => { if (!error) e.target.style.borderColor = '#3b82f6'; }}
          onBlurCapture={(e) => { if (!error) e.target.style.borderColor = '#e2e8f0'; }}
        />
      )}
      {error && (
        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#ef4444' }}>{error}</p>
      )}
      {hint && !error && (
        <p style={{ margin: '5px 0 0', fontSize: 12, color: '#94a3b8' }}>{hint}</p>
      )}
    </div>
  );
};

export default FormInput;

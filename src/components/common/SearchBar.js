import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...', onClear }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <FiSearch style={{
        position: 'absolute', left: 12, top: '50%',
        transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
      }} size={17} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 36px 9px 38px',
          border: '1px solid #e2e8f0', borderRadius: 10,
          fontSize: 14, outline: 'none', background: '#fff',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
      {value && (
        <button onClick={onClear || (() => onChange(''))} style={{
          position: 'absolute', right: 10, top: '50%',
          transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 4,
        }}>
          <FiX size={15} color="#94a3b8" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

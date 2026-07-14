import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  const btnStyle = (active, disabled = false) => ({
    width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1px solid #e2e8f0',
    background: active ? '#3b82f6' : '#fff', color: active ? '#fff' : '#475569',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', padding: '16px 0' }}>
      <button
        style={btnStyle(false, currentPage === 1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft size={16} />
      </button>

      {start > 1 && <>
        <button style={btnStyle(false)} onClick={() => onPageChange(1)}>1</button>
        {start > 2 && <span style={{ color: '#94a3b8' }}>...</span>}
      </>}

      {pages.map(p => (
        <button key={p} style={btnStyle(p === currentPage)} onClick={() => onPageChange(p)}>
          {p}
        </button>
      ))}

      {end < totalPages && <>
        {end < totalPages - 1 && <span style={{ color: '#94a3b8' }}>...</span>}
        <button style={btnStyle(false)} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
      </>}

      <button
        style={btnStyle(false, currentPage === totalPages)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;

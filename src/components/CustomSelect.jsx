import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  style = {},
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (optionValue) => {
    // Call synthetic event or direct value
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt === value || opt.value === value);
  const displayLabel = typeof selectedLabel === 'object' ? selectedLabel.label : (selectedLabel || value);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          background: 'var(--background)',
          border: error ? '1px solid var(--destructive)' : '1px solid rgba(222,216,207,0.8)',
          boxShadow: isOpen
            ? error
              ? '0 0 0 3px rgba(168,84,72,0.15)'
              : '0 0 0 3px rgba(93,112,82,0.15)'
            : '0 2px 4px rgba(0,0,0,0.02)',
          borderColor: isOpen ? (error ? 'var(--destructive)' : 'var(--primary)') : error ? 'var(--destructive)' : 'rgba(222,216,207,0.8)',
          borderRadius: '9999px',
          color: value ? 'var(--foreground)' : 'var(--muted-foreground)',
          fontFamily: 'var(--ff-body)',
          fontSize: '0.95rem',
          padding: '14px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: 'var(--muted-foreground)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0,
            marginLeft: 8,
          }}
        />
      </div>

      {/* Animated Dropdown Menu */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          zIndex: 999,
          background: '#ffffff',
          border: '1px solid rgba(222,216,207,0.8)',
          borderRadius: '1.25rem',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
          padding: '6px',
          maxHeight: '260px',
          overflowY: 'auto',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.96)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          const isSelected = val === value;

          return (
            <div
              key={val}
              onClick={() => handleSelect(val)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'var(--muted)';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--foreground)';
                }
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '9999px',
                fontSize: '0.92rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? 'var(--primary)' : 'var(--foreground)',
                background: isSelected ? 'rgba(93,112,82,0.12)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                transition: 'all 0.15s ease',
                marginBottom: '2px',
              }}
            >
              <span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label}
              </span>
              {isSelected && <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginLeft: 8 }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

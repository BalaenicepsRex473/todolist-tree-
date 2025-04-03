import React from 'react';
import './textinput.css';
import closeIcon from './Close_Circle.svg';

const TextInput = ({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  disabled = false,
  type = 'text',
  onClear,
  color = '#4B5563'
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: '' } });
    }
  };

  const inputStyle = {
    '--input-text-color': color,
  };

  return (
    <div className="text-input-wrapper" style={inputStyle}>
      <div className="text-input-container">
        <input
          type={type}
          className="text-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {label && <div className="text-input-label">{label}</div>}
        {value && (
          <button
            className="clear-button" 
            onClick={handleClear}
            type="button"
          >
            <img src={closeIcon} alt="Clear" width="20" height="20" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput; 
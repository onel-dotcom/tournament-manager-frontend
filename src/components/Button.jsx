function Button({ children, variant = 'primary', fullWidth = false, style = {}, ...props }) {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '24px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      backgroundColor: '#1a365d',
      color: 'white',
    },
    success: {
      backgroundColor: '#48bb78',
      color: 'white',
    },
    neutral: {
      backgroundColor: '#eee',
      color: '#111',
    },
    outline: {
      backgroundColor: '#fff',
      color: '#1a365d',
      border: '1px solid #1a365d',
    },
  };

  const mergedStyle = {
    ...baseStyle,
    ...(variants[variant] || variants.primary),
    ...style,
  };

  return (
    <button
      {...props}
      style={mergedStyle}
      className={props.className || 'btn-hover'}
    >
      {children}
    </button>
  );
}

export default Button;


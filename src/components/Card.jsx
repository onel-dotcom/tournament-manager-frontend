function Card({ children, style = {}, width = '95%', maxWidth, padding = '25px' }) {
  const baseStyle = {
    width,
    maxWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    padding,
    borderRadius: '25px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#000',
    margin: '10px 0',
  };

  return (
    <div style={{ ...baseStyle, ...style }}>
      {children}
    </div>
  );
}

export default Card;


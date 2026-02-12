function MainLayout({ backgroundStyle, children }) {
  return (
    <div style={backgroundStyle}>
      {children}
    </div>
  );
}

export default MainLayout;


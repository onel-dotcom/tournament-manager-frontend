function LandingPage({ mainFont, onStart }) {
  return (
    <div style={{ width: '90%', maxWidth: '450px', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '36px 36px 32px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.3)', fontFamily: mainFont, margin: '10px 0' }}>
      
      {/* LOGO */}
      <img src="/images/logo.png" alt="Logo" style={{ width: '180px', marginBottom: '10px', mixBlendMode: 'multiply' }} />

      <p style={{ color: '#000', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', fontWeight: '500' }}>
        Benvenuto nell'app Tournament Manager. <br/><br/>
        Organizza i tuoi eventi sportivi con facilità: crea la tua lista di squadre personalizzata e genera automaticamente un tabellone a eliminazione diretta partendo dai quarti di finale. <br/><br/>
        Gestisci i risultati in tempo reale e osserva i vincitori avanzare verso la finale!
      </p>

      <button 
        onClick={onStart}
        className="btn-hover" 
        style={{ padding: '15px 50px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '40px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', fontFamily: mainFont }}
      >
        INIZIA
      </button>
    </div>
  );
}

export default LandingPage;


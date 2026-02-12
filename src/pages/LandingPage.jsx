import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

function LandingPage({ mainFont, onStart }) {
  return (
    <Card
      width="90%"
      maxWidth="450px"
      padding="36px 36px 32px"
      style={{ borderRadius: '40px', textAlign: 'center', fontFamily: mainFont }}
    >
      
      {/* LOGO */}
      <img src="/images/logo.png" alt="Logo" style={{ width: '180px', marginBottom: '10px', mixBlendMode: 'multiply' }} />

      <p style={{ color: '#000', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', fontWeight: '500' }}>
        Benvenuto nell'app Tournament Manager. <br/><br/>
        Organizza i tuoi eventi sportivi con facilità: crea la tua lista di squadre personalizzata e genera automaticamente un tabellone a eliminazione diretta partendo dai quarti di finale. <br/><br/>
        Gestisci i risultati in tempo reale e osserva i vincitori avanzare verso la finale!
      </p>

      <Button 
        onClick={onStart}
        style={{ padding: '15px 50px', borderRadius: '40px', fontSize: '1.1rem', fontWeight: '900', fontFamily: mainFont }}
      >
        INIZIA
      </Button>
    </Card>
  );
}

export default LandingPage;


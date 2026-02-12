function BracketPage({ tournamentName, matches, onBack, openScoreModal }) {
  return (
    <div style={{ width: '95%', maxWidth: '900px', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '16px 18px 12px', borderRadius: '25px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#000', margin: '10px 0' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <button 
          onClick={onBack}
          style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '18px', border: '1px solid #999', background: 'white', fontSize: '0.8rem', fontWeight: '500' }}
        >
          ← Indietro
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <img src="/images/logo.png" alt="Logo" style={{ width: '140px', mixBlendMode: 'multiply' }} />
        </div>
        <div style={{ width: '90px' }}></div>
      </div>

      <h2 style={{ textAlign: 'center', color: '#1a365d', fontSize: '1.5rem', marginBottom: '6px' }}>{tournamentName}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '18px', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', opacity: '0.7' }}>Quarti</h5>
          {matches.filter(m => m.round == 1).map(m => (
            <div key={m.id} style={{ padding: '10px', marginBottom: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.5)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
              <p style={{fontWeight: 'bold', marginBottom: '8px'}}>{m.team1_name} vs {m.team2_name}</p>
              {m.winner_id
                ? <span style={{ color: '#2f855a', fontWeight: '900', fontSize: '1.1rem' }}>{m.score1} - {m.score2}</span>
                : <button onClick={() => openScoreModal(m)} style={{fontSize: '10px', padding: '6px 15px', borderRadius: '20px', cursor:'pointer', border: '1px solid #1a365d', background: '#fff', fontWeight: 'bold'}}>RISULTATO</button>}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', opacity: '0.7' }}>Semifinali</h5>
          {matches.filter(m => m.round == 2).map(m => (
            <div key={m.id} style={{ padding: '14px', marginBottom: '14px', borderRadius: '15px', background: 'rgba(255,255,255,0.6)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.4)' }}>
              <p style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '1.05rem'}}>{m.team1_name || '??'} vs {m.team2_name || '??'}</p>
              {m.team1_id && m.team2_id && !m.winner_id && (
                <button onClick={() => openScoreModal(m)} style={{fontSize: '10px', padding: '8px 20px', borderRadius: '20px', cursor:'pointer', border: '1px solid #1a365d', background: '#fff', fontWeight: 'bold'}}>RISULTATO</button>
              )}
              {m.winner_id && <span style={{ color: '#2f855a', fontWeight: '900', fontSize: '1.2rem' }}>{m.score1} - {m.score2}</span>}
            </div>
          ))}
        </div>

        <div style={{ flex: 1.4 }}>
          <h5 style={{ textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', opacity: '0.7' }}>Finale</h5>
          {matches.filter(m => m.round == 3).map(m => (
            <div key={m.id} style={{ padding: '28px', borderRadius: '30px', background: 'rgba(43, 108, 176, 0.1)', textAlign: 'center', border: '3px solid rgba(43, 108, 176, 0.4)', boxShadow: '0 10px 30px rgba(43,108,176,0.2)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>{m.team1_name || '???'} <br/> vs <br/> {m.team2_name || '???'}</h3>
              {m.team1_id && m.team2_id && !m.winner_id && (
                <button onClick={() => openScoreModal(m)} style={{ background: '#2b6cb0', color: 'white', padding: '15px 35px', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                  GIOCA FINALE
                </button>
              )}
              {m.winner_id && (
                <div style={{ marginTop: '10px' }}>
                  <h1 style={{ color: '#2f855a', fontSize: '2.5rem', fontWeight: '900' }}>{m.score1} - {m.score2}</h1>
                  <div style={{fontSize: '4rem', margin: '15px 0'}}>🏆</div>
                  <h2 style={{ color: '#1a365d', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {m.winner_id == m.team1_id ? m.team1_name : m.team2_name} <br/> CAMPIONE!
                  </h2>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BracketPage;


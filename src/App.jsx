import { useState, useEffect } from 'react'

function App() {
  // --- STATI DELL'APPLICAZIONE ---
  const [isStarted, setIsStarted] = useState(false);
  const [teams, setTeams] = useState([])
  const [newTeamName, setNewTeamName] = useState('')
  const [selectedTeams, setSelectedTeams] = useState([])
  const [activeTournamentId, setActiveTournamentId] = useState(null)
  const [matches, setMatches] = useState([])
  const [history, setHistory] = useState([])
  const [tournamentName, setTournamentName] = useState('')

  const [modal, setModal] = useState({
    show: false,
    type: 'confirm', 
    title: '',
    message: '',
    onConfirm: null,
    matchData: null 
  })

  const [scoreInput, setScoreInput] = useState({ s1: '', s2: '' })

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const mainFont = "'GoogleSansCustom', sans-serif";

  // --- LOGICA SFONDO DINAMICO ---
  const getBackground = () => {
    if (!isStarted) return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/images/bg-landing.png")`;
    return activeTournamentId 
      ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("/images/bg-tournament.png")` 
      : `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url("/images/bg-home.png")`;
  };

  const backgroundStyle = {
    backgroundImage: getBackground(),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: mainFont,
    transition: 'background-image 0.8s ease-in-out',
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/teams/read.php`)
      setTeams(await res.json())
    } catch (e) { console.error(e) }
  }
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tournaments/read_history.php`)
      setHistory(await res.json())
    } catch (e) { console.error(e) }
  }
  const fetchBracket = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tournaments/read_bracket.php?id=${id}`)
      setMatches(await res.json())
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchTeams(); fetchHistory(); }, [])

  const handleAddTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName) return
    await fetch(`${API_BASE_URL}/teams/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTeamName })
    })
    setNewTeamName(''); fetchTeams();
  }

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setModal({
      show: true,
      type: 'confirm',
      title: 'Elimina Squadra',
      message: 'Sei sicuro di voler rimuovere questa squadra?',
      onConfirm: () => confirmDelete(id)
    })
  }

  const confirmDelete = async (id) => {
    const res = await fetch(`${API_BASE_URL}/teams/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
    const result = await res.json()
    if(res.ok) { 
      fetchTeams(); setModal({ show: false });
    } else { 
      setModal({ show: true, type: 'alert', title: 'Attenzione', message: result.message });
    }
  }

  const handleCreateTournament = async () => {
    if (selectedTeams.length !== 8) {
      setModal({ show: true, type: 'alert', title: 'Configurazione', message: 'Seleziona esattamente 8 squadre!' });
      return;
    }
    const res = await fetch(`${API_BASE_URL}/tournaments/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tournamentName || "Torneo Pro", teams: selectedTeams })
    })
    const result = await res.json()
    if(result.id) { setActiveTournamentId(result.id); fetchBracket(result.id); }
  }

  const openScoreModal = (match) => {
    setScoreInput({ s1: '', s2: '' });
    setModal({
      show: true,
      type: 'score',
      title: 'Inserisci Risultato',
      matchData: match
    })
  }

  const saveScore = async () => {
    const val1 = parseInt(scoreInput.s1) || 0;
    const val2 = parseInt(scoreInput.s2) || 0;
    const match = modal.matchData;
    if (val1 === val2) {
      setModal({ ...modal, type: 'alert', title: 'Punteggio Errato', message: 'Il pareggio non è ammesso!' });
      return;
    }
    await fetch(`${API_BASE_URL}/tournaments/update_score.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        match_id: match.id, tournament_id: activeTournamentId,
        score1: val1, score2: val2, 
        team1_id: match.team1_id, team2_id: match.team2_id,
        next_match_id: match.next_match_id 
      })
    })
    setModal({ show: false });
    fetchBracket(activeTournamentId); fetchHistory();
  }

  return (
    <div style={backgroundStyle}>
      
      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '30px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#1a365d', marginBottom: '20px', fontSize: '1.5rem' }}>{modal.title}</h3>
            {modal.type !== 'score' && <p style={{ marginBottom: '25px', color: '#444' }}>{modal.message}</p>}
            {modal.type === 'score' && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <label style={{display:'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{modal.matchData.team1_name}</label>
                  <input type="number" min="0" placeholder="0" value={scoreInput.s1} onChange={e => setScoreInput({...scoreInput, s1: e.target.value.replace(/^0+/, '')})} style={{ width: '80px', padding: '15px', textAlign: 'center', borderRadius: '15px', border: '2px solid #1a365d', fontSize: '1.5rem', fontWeight: 'bold' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', paddingTop: '30px' }}>-</div>
                <div>
                  <label style={{display:'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{modal.matchData.team2_name}</label>
                  <input type="number" min="0" placeholder="0" value={scoreInput.s2} onChange={e => setScoreInput({...scoreInput, s2: e.target.value.replace(/^0+/, '')})} style={{ width: '80px', padding: '15px', textAlign: 'center', borderRadius: '15px', border: '2px solid #1a365d', fontSize: '1.5rem', fontWeight: 'bold' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              {modal.type === 'confirm' && (
                <>
                  <button onClick={modal.onConfirm} style={{ padding: '12px 25px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>ELIMINA</button>
                  <button onClick={() => setModal({show: false})} style={{ padding: '12px 25px', backgroundColor: '#eee', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>ANNULLA</button>
                </>
              )}
              {modal.type === 'alert' && <button onClick={() => setModal({show: false})} style={{ padding: '12px 40px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}>OK</button>}
              {modal.type === 'score' && (
                <>
                  <button onClick={saveScore} className="btn-hover" style={{ padding: '12px 35px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>SALVA</button>
                  <button onClick={() => setModal({show: false})} style={{ padding: '12px 35px', backgroundColor: '#eee', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>ANNULLA</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- LOGICA DI NAVIGAZIONE --- */}
      
      {!isStarted ? (
        /* 1. PAGINA INIZIALE (LANDING PAGE) */
        <div style={{ width: '90%', maxWidth: '450px', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '36px 36px 32px', borderRadius: '40px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.3)', fontFamily: mainFont, margin: '10px 0' }}>
          
          {/* LOGO */}
          <img src="/images/logo.png" alt="Logo" style={{ width: '180px', marginBottom: '10px', mixBlendMode: 'multiply' }} />
          
          <p style={{ color: '#000', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px', fontWeight: '500' }}>
            Benvenuto nell'app Tournament Manager. <br/><br/>
            Organizza i tuoi eventi sportivi con facilità: crea la tua lista di squadre personalizzata e genera automaticamente un tabellone a eliminazione diretta partendo dai quarti di finale. <br/><br/>
            Gestisci i risultati in tempo reale e osserva i vincitori avanzare verso la finale!
          </p>
          <button 
            onClick={() => setIsStarted(true)} 
            className="btn-hover" 
            style={{ padding: '15px 50px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '40px', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', fontFamily: mainFont }}
          >
            INIZIA
          </button>
        </div>
      ) : !activeTournamentId ? (
        /* 2. GESTIONE E CONFIGURAZIONE (HOMEPAGE) */
        <div style={{ width: '95%', maxWidth: '850px', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '25px', borderRadius: '25px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#000', margin: '40px 0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
             <img src="/images/logo.png" alt="Logo" style={{ width: '130px', mixBlendMode: 'multiply' }} />
          </div>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem' }}>Gestione Squadre</h4>
            <form onSubmit={handleAddTeam} style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Nome Squadra..." value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)', paddingLeft: '15px' }} />
              <button type="submit" className="btn-hover" style={{ padding: '8px 20px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: mainFont }}>AGGIUNGI</button>
            </form>
          </div>

          <div style={{ padding: '10px' }}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '15px'}}>Configura Torneo</h3>
            <input type="text" placeholder="Nome del Torneo..." value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)', paddingLeft: '15px', boxSizing: 'border-box' }} />
            <p style={{fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold'}}>Seleziona 8 partecipanti ({selectedTeams.length}/8):</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {teams.map(t => (
                <div key={t.id} onClick={() => setSelectedTeams(prev => prev.includes(t.id) ? prev.filter(i => i !== t.id) : prev.length < 8 ? [...prev, t.id] : prev)}
                     style={{ position: 'relative', padding: '12px', background: selectedTeams.includes(t.id) ? 'rgba(43, 108, 176, 0.8)' : 'rgba(255, 255, 255, 0.5)', color: selectedTeams.includes(t.id) ? 'white' : '#000', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  {t.name}
                  <button onClick={(e) => openDeleteModal(e, t.id)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
            </div>
            <button onClick={handleCreateTournament} className="btn-hover" style={{ marginTop: '25px', width: '100%', padding: '15px', backgroundColor: selectedTeams.length === 8 ? '#48bb78' : 'rgba(0,0,0,0.2)', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}>GENERA TABELLONE</button>
          </div>

          <h4 style={{ marginTop: '30px', opacity: '0.7', fontSize: '0.9rem' }}>Storico Vincitori 🏆</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            {history.map(h => (
              <div key={h.id} style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <strong>{h.name}</strong>: <span style={{ color: '#1a365d' }}>{h.winner_name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 3. VISTA TABELLONE */
        <div style={{ width: '95%', maxWidth: '900px', backgroundColor: 'rgba(255, 255, 255, 0.45)', padding: '16px 18px 12px', borderRadius: '25px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#000', margin: '10px 0' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <button 
              onClick={() => {setActiveTournamentId(null); fetchHistory();}} 
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
                  {m.winner_id ? <span style={{ color: '#2f855a', fontWeight: '900', fontSize: '1.1rem' }}>{m.score1} - {m.score2}</span> : <button onClick={() => openScoreModal(m)} style={{fontSize: '10px', padding: '6px 15px', borderRadius: '20px', cursor:'pointer', border: '1px solid #1a365d', background: '#fff', fontWeight: 'bold'}}>RISULTATO</button>}
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <h5 style={{ textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', opacity: '0.7' }}>Semifinali</h5>
              {matches.filter(m => m.round == 2).map(m => (
                <div key={m.id} style={{ padding: '14px', marginBottom: '14px', borderRadius: '15px', background: 'rgba(255,255,255,0.6)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.4)' }}>
                  <p style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '1.05rem'}}>{m.team1_name || '??'} vs {m.team2_name || '??'}</p>
                  {m.team1_id && m.team2_id && !m.winner_id && <button onClick={() => openScoreModal(m)} style={{fontSize: '10px', padding: '8px 20px', borderRadius: '20px', cursor:'pointer', border: '1px solid #1a365d', background: '#fff', fontWeight: 'bold'}}>RISULTATO</button>}
                  {m.winner_id && <span style={{ color: '#2f855a', fontWeight: '900', fontSize: '1.2rem' }}>{m.score1} - {m.score2}</span>}
                </div>
              ))}
            </div>

            <div style={{ flex: 1.4 }}>
              <h5 style={{ textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase', opacity: '0.7' }}>Finale</h5>
              {matches.filter(m => m.round == 3).map(m => (
                <div key={m.id} style={{ padding: '28px', borderRadius: '30px', background: 'rgba(43, 108, 176, 0.1)', textAlign: 'center', border: '3px solid rgba(43, 108, 176, 0.4)', boxShadow: '0 10px 30px rgba(43,108,176,0.2)' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>{m.team1_name || '???'} <br/> vs <br/> {m.team2_name || '???'}</h3>
                  {m.team1_id && m.team2_id && !m.winner_id && <button onClick={() => openScoreModal(m)} style={{ background: '#2b6cb0', color: 'white', padding: '15px 35px', border: 'none', borderRadius: '40px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>GIOCA FINALE</button>}
                  {m.winner_id && (
                     <div style={{ marginTop: '10px' }}>
                        <h1 style={{ color: '#2f855a', fontSize: '2.5rem', fontWeight: '900' }}>{m.score1} - {m.score2}</h1>
                        <div style={{fontSize: '4rem', margin: '15px 0'}}>🏆</div>
                        <h2 style={{ color: '#1a365d', textTransform: 'uppercase', letterSpacing: '1px' }}>{m.winner_id == m.team1_id ? m.team1_name : m.team2_name} <br/> CAMPIONE!</h2>
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
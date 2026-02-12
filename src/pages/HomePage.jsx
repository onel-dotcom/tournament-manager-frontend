import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';

function HomePage({
  mainFont,
  teams,
  history,
  selectedTeams,
  newTeamName,
  tournamentName,
  handleAddTeam,
  setNewTeamName,
  setTournamentName,
  setSelectedTeams,
  handleCreateTournament,
  openDeleteModal
}) {
  return (
    <Card style={{ maxWidth: '850px', margin: '40px 0' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/images/logo.png" alt="Logo" style={{ width: '130px', mixBlendMode: 'multiply' }} />
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.2)' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '0.9rem' }}>Gestione Squadre</h4>
        <form onSubmit={handleAddTeam} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Nome Squadra..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)', paddingLeft: '15px' }}
          />
          <Button
            type="submit"
            style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.8rem', fontFamily: mainFont }}
          >
            AGGIUNGI
          </Button>
        </form>
      </div>

      <div style={{ padding: '10px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Configura Torneo</h3>
        <input
          type="text"
          placeholder="Nome del Torneo..."
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.1)', paddingLeft: '15px', boxSizing: 'border-box' }}
        />
        <p style={{ fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
          Seleziona 8 partecipanti ({selectedTeams.length}/8):
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
          {teams.map((t) => (
            <div
              key={t.id}
              onClick={() =>
                setSelectedTeams((prev) =>
                  prev.includes(t.id)
                    ? prev.filter((i) => i !== t.id)
                    : prev.length < 8
                    ? [...prev, t.id]
                    : prev
                )
              }
              style={{
                position: 'relative',
                padding: '12px',
                background: selectedTeams.includes(t.id) ? 'rgba(43, 108, 176, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                color: selectedTeams.includes(t.id) ? 'white' : '#000',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}
            >
              {t.name}
              <button
                onClick={(e) => openDeleteModal(e, t.id)}
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={handleCreateTournament}
          variant={selectedTeams.length === 8 ? 'success' : 'primary'}
          fullWidth
          style={{
            marginTop: '25px',
            padding: '15px',
            borderRadius: '30px',
          }}
        >
          GENERA TABELLONE
        </Button>
      </div>

      <h4 style={{ marginTop: '30px', opacity: '0.7', fontSize: '0.9rem' }}>Storico Vincitori 🏆</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
        {history.map((h) => (
          <div
            key={h.id}
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.3)',
              fontSize: '0.8rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <strong>{h.name}</strong>: <span style={{ color: '#1a365d' }}>{h.winner_name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default HomePage;


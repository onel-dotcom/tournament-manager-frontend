import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import BracketPage from './pages/BracketPage.jsx';
import Modal from './components/Modal.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import { getTeams, createTeam, deleteTeam } from './lib/teamsApi.js';
import { getHistory, getBracket, createTournament, updateScore } from './lib/tournamentsApi.js';

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
      const data = await getTeams();
      setTeams(data);
    } catch (e) { console.error(e) }
  }
  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (e) { console.error(e) }
  }
  const fetchBracket = async (id) => {
    try {
      const data = await getBracket(id);
      setMatches(data);
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchTeams(); fetchHistory(); }, [])

  const handleAddTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName) return
    await createTeam(newTeamName)
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
    const res = await deleteTeam(id)
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
    const result = await createTournament(tournamentName || "Torneo Pro", selectedTeams)
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
    await updateScore({ 
      match_id: match.id, tournament_id: activeTournamentId,
      score1: val1, score2: val2, 
      team1_id: match.team1_id, team2_id: match.team2_id,
      next_match_id: match.next_match_id 
    })
    setModal({ show: false });
    fetchBracket(activeTournamentId); fetchHistory();
  }

  return (
    <MainLayout backgroundStyle={backgroundStyle}>
      
      <Modal
        modal={modal}
        scoreInput={scoreInput}
        setScoreInput={setScoreInput}
        saveScore={saveScore}
        setModal={setModal}
      />

      {/* --- LOGICA DI NAVIGAZIONE --- */}
      
      {!isStarted ? (
        /* 1. PAGINA INIZIALE (LANDING PAGE) */
        <LandingPage
          mainFont={mainFont}
          onStart={() => setIsStarted(true)}
        />
      ) : !activeTournamentId ? (
        /* 2. GESTIONE E CONFIGURAZIONE (HOMEPAGE) */
        <HomePage
          mainFont={mainFont}
          teams={teams}
          history={history}
          selectedTeams={selectedTeams}
          newTeamName={newTeamName}
          tournamentName={tournamentName}
          handleAddTeam={handleAddTeam}
          setNewTeamName={setNewTeamName}
          setTournamentName={setTournamentName}
          setSelectedTeams={setSelectedTeams}
          handleCreateTournament={handleCreateTournament}
          openDeleteModal={openDeleteModal}
        />
      ) : (
        /* 3. VISTA TABELLONE */
        <BracketPage
          tournamentName={tournamentName}
          matches={matches}
          onBack={() => { setActiveTournamentId(null); fetchHistory(); }}
          openScoreModal={openScoreModal}
        />
      )}
    </MainLayout>
  )
}

export default App
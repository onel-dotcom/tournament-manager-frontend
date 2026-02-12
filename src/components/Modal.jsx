function Modal({ modal, scoreInput, setScoreInput, saveScore, setModal }) {
  if (!modal.show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '30px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        <h3 style={{ color: '#1a365d', marginBottom: '20px', fontSize: '1.5rem' }}>{modal.title}</h3>
        {modal.type !== 'score' && <p style={{ marginBottom: '25px', color: '#444' }}>{modal.message}</p>}
        {modal.type === 'score' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{display:'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{modal.matchData.team1_name}</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={scoreInput.s1}
                onChange={e => setScoreInput({ ...scoreInput, s1: e.target.value.replace(/^0+/, '') })}
                style={{ width: '80px', padding: '15px', textAlign: 'center', borderRadius: '15px', border: '2px solid #1a365d', fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', paddingTop: '30px' }}>-</div>
            <div>
              <label style={{display:'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{modal.matchData.team2_name}</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={scoreInput.s2}
                onChange={e => setScoreInput({ ...scoreInput, s2: e.target.value.replace(/^0+/, '') })}
                style={{ width: '80px', padding: '15px', textAlign: 'center', borderRadius: '15px', border: '2px solid #1a365d', fontSize: '1.5rem', fontWeight: 'bold' }}
              />
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          {modal.type === 'confirm' && (
            <>
              <button
                onClick={modal.onConfirm}
                style={{ padding: '12px 25px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ELIMINA
              </button>
              <button
                onClick={() => setModal({ show: false })}
                style={{ padding: '12px 25px', backgroundColor: '#eee', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
              >
                ANNULLA
              </button>
            </>
          )}
          {modal.type === 'alert' && (
            <button
              onClick={() => setModal({ show: false })}
              style={{ padding: '12px 40px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              OK
            </button>
          )}
          {modal.type === 'score' && (
            <>
              <button
                onClick={saveScore}
                className="btn-hover"
                style={{ padding: '12px 35px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                SALVA
              </button>
              <button
                onClick={() => setModal({ show: false })}
                style={{ padding: '12px 35px', backgroundColor: '#eee', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
              >
                ANNULLA
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;


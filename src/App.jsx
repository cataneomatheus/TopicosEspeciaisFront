import { useState, useEffect } from 'react';
import Field from './components/Field';
import PlayerModal from './components/PlayerModal';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from './services/api';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('');

  const fetchPlayers = async () => {
    try {
      setError(null);
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      setError('Erro ao carregar jogadores. Verifique se o backend esta rodando.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAdd = (slotIndex, position) => {
    setEditingPlayer(null);
    setSelectedSlot(slotIndex);
    setSelectedPosition(position);
    setModalOpen(true);
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setSelectedSlot(player.slotIndex);
    setSelectedPosition(player.position);
    setModalOpen(true);
  };

  const handleRemove = async (id) => {
    try {
      await deletePlayer(id);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao remover jogador.');
    }
  };

  const handleSave = async (playerData) => {
    try {
      if (playerData.id) {
        const updated = await updatePlayer(playerData.id, playerData);
        setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createPlayer(playerData);
        setPlayers((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar jogador.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="app__loading">Carregando time...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Cartola FC</h1>
        <p>Monte seu time dos sonhos</p>
      </header>

      {error && <div className="app__error">{error}</div>}

      <Field
        players={players}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onRemove={handleRemove}
      />

      <PlayerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        player={editingPlayer}
        slotIndex={selectedSlot}
        position={selectedPosition}
      />
    </div>
  );
}

export default App;

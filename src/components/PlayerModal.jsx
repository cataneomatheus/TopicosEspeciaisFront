import { useState, useEffect } from 'react';
import './PlayerModal.css';

export default function PlayerModal({ isOpen, onClose, onSave, player, slotIndex, position }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [number, setNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (player) {
      setName(player.name);
      setAge(String(player.age));
      setNumber(String(player.number || ''));
      setPhotoUrl(player.photoUrl || '');
    } else {
      setName('');
      setAge('');
      setNumber('');
      setPhotoUrl('');
    }
  }, [player, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: player?.id,
      name,
      age: parseInt(age, 10),
      number: parseInt(number, 10) || 0,
      position,
      photoUrl,
      slotIndex,
    });
    onClose();
  };

  const positionLabels = {
    GK: 'Goleiro',
    DEF: 'Zagueiro / Lateral',
    MID: 'Meio-campo',
    FWD: 'Atacante',
    COACH: 'Tecnico',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{player ? 'Editar Jogador' : 'Adicionar Jogador'}</h2>
        <span className="modal__position">{positionLabels[position] || position}</span>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do jogador"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="number">Numero da camisa</label>
            <input
              id="number"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ex: 10"
              min="0"
              max="99"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Idade</label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Idade"
              min="1"
              max="99"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="photo">URL da Foto</label>
            <input
              id="photo"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <div className="modal__actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import './PlayerCard.css';

export default function PlayerCard({ player, position, onAdd, onEdit, onRemove }) {
  if (!player) {
    return (
      <div className="player-card empty" onClick={onAdd}>
        <div className="player-card__add">+</div>
        <span className="player-card__position">{position}</span>
      </div>
    );
  }

  return (
    <div className="player-card filled">
      <div className="player-card__photo">
        <img
          src={player.photoUrl || '/vite.svg'}
          alt={player.name}
          onError={(e) => { e.target.src = '/vite.svg'; }}
        />
      </div>
      <span className="player-card__name">{player.name}</span>
      <span className="player-card__age">{player.age} anos</span>
      <div className="player-card__actions">
        <button className="btn-edit" onClick={() => onEdit(player)} title="Editar">✎</button>
        <button className="btn-remove" onClick={() => onRemove(player.id)} title="Remover">✕</button>
      </div>
    </div>
  );
}

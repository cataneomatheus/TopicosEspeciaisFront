import './CoachCard.css';

export default function CoachCard({ player, onAdd, onEdit, onRemove }) {
  if (!player) {
    return (
      <div className="coach-card empty" onClick={onAdd}>
        <div className="coach-card__add">+</div>
        <span className="coach-card__label">Tecnico</span>
      </div>
    );
  }

  return (
    <div className="coach-card filled">
      <div className="coach-card__photo">
        <img
          src={player.photoUrl || '/vite.svg'}
          alt={player.name}
          onError={(e) => { e.target.src = '/vite.svg'; }}
        />
      </div>
      <div className="coach-card__info">
        <span className="coach-card__name">{player.name}</span>
        <span className="coach-card__age">{player.age} anos</span>
        <span className="coach-card__label">Tecnico</span>
      </div>
      <div className="coach-card__actions">
        <button className="btn-edit" onClick={() => onEdit(player)} title="Editar">✎</button>
        <button className="btn-remove" onClick={() => onRemove(player.id)} title="Remover">✕</button>
      </div>
    </div>
  );
}

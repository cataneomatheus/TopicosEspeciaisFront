import './PlayerList.css';

const POSITION_ORDER = { GK: 0, DEF: 1, MID: 2, FWD: 3, COACH: 4 };
const POSITION_LABELS = { GK: 'Goleiro', DEF: 'Defesa', MID: 'Meio-campo', FWD: 'Ataque', COACH: 'Tecnico' };

export default function PlayerList({ players }) {
  const sorted = [...players].sort((a, b) => {
    const posA = POSITION_ORDER[a.position] ?? 5;
    const posB = POSITION_ORDER[b.position] ?? 5;
    if (posA !== posB) return posA - posB;
    return a.slotIndex - b.slotIndex;
  });

  const groups = {};
  sorted.forEach((p) => {
    if (!groups[p.position]) groups[p.position] = [];
    groups[p.position].push(p);
  });

  return (
    <div className="player-list">
      <h2 className="player-list__title">Relacionados</h2>
      <div className="player-list__count">{players.filter(p => p.position !== 'COACH').length} jogadores</div>

      {Object.entries(groups).map(([position, group]) => (
        <div key={position} className="player-list__group">
          <div className="player-list__group-label">{POSITION_LABELS[position] || position}</div>
          {group.map((player) => (
            <div key={player.id} className="player-list__item">
              <span className="player-list__number">
                {player.position === 'COACH' ? '--' : player.number}
              </span>
              <span className="player-list__name">{player.name}</span>
              <span className={`player-list__pos player-list__pos--${player.position.toLowerCase()}`}>
                {player.position}
              </span>
            </div>
          ))}
        </div>
      ))}

      {players.length === 0 && (
        <div className="player-list__empty">Nenhum jogador escalado</div>
      )}
    </div>
  );
}

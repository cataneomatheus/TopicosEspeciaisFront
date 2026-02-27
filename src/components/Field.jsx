import PlayerCard from './PlayerCard';
import CoachCard from './CoachCard';
import './Field.css';

const SLOT_POSITIONS = {
  0: 'GK',
  1: 'DEF', 2: 'DEF', 3: 'DEF', 4: 'DEF',
  5: 'MID', 6: 'MID', 7: 'MID', 8: 'MID',
  9: 'FWD', 10: 'FWD',
  11: 'COACH',
};

const SLOT_LABELS = {
  0: 'GK',
  1: 'LE', 2: 'ZAG', 3: 'ZAG', 4: 'LD',
  5: 'ME', 6: 'MC', 7: 'MC', 8: 'MD',
  9: 'ATA', 10: 'ATA',
  11: 'TEC',
};

const FIELD_SLOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Field({ players, onAdd, onEdit, onRemove }) {
  const getPlayerBySlot = (slot) => players.find((p) => p.slotIndex === slot);

  return (
    <div className="field-wrapper">
      <div className="field">
        <div className="field__lines">
          <div className="field__center-circle" />
          <div className="field__center-line" />
          <div className="field__penalty-area field__penalty-area--top" />
          <div className="field__goal-area field__goal-area--top" />
          <div className="field__penalty-area field__penalty-area--bottom" />
          <div className="field__goal-area field__goal-area--bottom" />
        </div>

        <div className="field__title">MEU TIME</div>

        {FIELD_SLOTS.map((slot) => (
          <div key={slot} className={`field__slot field__slot--${slot}`}>
            <PlayerCard
              player={getPlayerBySlot(slot)}
              position={SLOT_LABELS[slot]}
              onAdd={() => onAdd(slot, SLOT_POSITIONS[slot])}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>

      {/* Tecnico (COACH) - Slot 11 - fora do campo */}
      <div className="field__coach">
        <CoachCard
          player={getPlayerBySlot(11)}
          onAdd={() => onAdd(11, SLOT_POSITIONS[11])}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}

import PurpleButton from './PurpleButton';
import './ParticipantCard.css';

function ParticipantCard({
  participant,
  statusLabel, 
  isOwner,
  onApprove,
  onReject,
  onRemove,
}) {
  return (
    <li className="participant-card">
      <div className="participant-info">
        <p className="participant-email">
          {participant.email || participant.userId}
        </p>
        <span className="participant-status">
          {statusLabel} {participant.isAdmin && "(Організатор)"}
        </span>
      </div>

      {isOwner && !participant.isAdmin && (
        <div className="participant-actions">
          {participant.status === 0 && ( // Pending
            <>
              <PurpleButton onClick={() => onApprove(participant.id)}>✅</PurpleButton>
              <PurpleButton onClick={() => onReject(participant.id)}>❌</PurpleButton>
            </>
          )}
          <PurpleButton onClick={() => onRemove(participant.id)}>🗑</PurpleButton>
        </div>
      )}
    </li>
  );
}

export default ParticipantCard;
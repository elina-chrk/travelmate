import PurpleButton from './PurpleButton';

function ParticipantCard({
  participant,
  isOwner,
  onApprove,
  onReject,
  onRemove,
}) {
  return (
    <li className="border rounded-xl p-4 bg-gray-50 flex justify-between items-center shadow-sm">
      <div>
        <p className="font-semibold text-purple-800">{participant.email || participant.userId}</p>
        <span className="text-sm text-gray-500">
          {participant.status} {participant.isAdmin && "(Організатор)"}
        </span>
      </div>

      {isOwner && !participant.isAdmin && (
        <div className="flex gap-2">
          {participant.status === "Pending" && (
            <>
              <PurpleButton
                size="sm"
                color="primary"
                onClick={() => onApprove(participant.id)}
              >
                ✅
              </PurpleButton>
              <PurpleButton
                size="sm"
                color="secondary"
                onClick={() => onReject(participant.id)}
              >
                ❌
              </PurpleButton>
            </>
          )}
          <PurpleButton
            size="sm"
            color="danger"
            onClick={() => onRemove(participant.id)}
          >
            🗑
          </PurpleButton>
        </div>
      )}
    </li>
  );
}

export default ParticipantCard;

export default (room) => {
  const {
    id,
    status,
    liveStartAt,
    title,
    snapshotUrl,
    avatarUrl,
    follows,
    online,
    provider,
    domain,
  } = room;

  const show_status = status === 'offline' ? 2 : 1;
  const room_url = `/${domain}`;

  const legacyRoomInfo = {
    room_id: id,
    show_status,
    show_details: '',
    show_time: liveStartAt,
    room_name: title,
    live_snapshot: snapshotUrl,
    owner_avatar: avatarUrl,
    fans: follows,
    online,
    live_provider: provider,
    room_url,
  };

  return legacyRoomInfo;
};

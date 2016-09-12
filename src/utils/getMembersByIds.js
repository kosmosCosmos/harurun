import { members } from '../constants';

export default (ids, group) => {
  if (!['akb48', 'ske48', 'nmb48', 'hkt48', 'ngt48'].includes(group)) {
    throw new Error('Unexcepted group value in getMembersByIds');
  }

  const memberList = members[group];

  const result = ids.map(mid => {
    const m = memberList.find(member => member.mid === mid.toString());
    return m;
  });

  return result;
};

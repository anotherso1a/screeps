export const NormalBody: Record<number, BodyPartConstant[]> = {
  1: [CARRY, WORK, MOVE],
  2: [WORK, WORK, CARRY, MOVE, MOVE],
  3: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  4: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
};

export const CarrierBody: Record<number, BodyPartConstant[]> = {
  1: [CARRY, MOVE],
  2: [CARRY, CARRY, CARRY, MOVE, MOVE],
  3: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
  4: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
};

export const CreepsCount: Record<number, number> = {
  1: 4,
  2: 8,
  3: 12,
  4: 16
};

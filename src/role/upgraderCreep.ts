import { NormalBody } from "constant/body";

export const spawnUpgrader = () => {
  const upgraders = _.filter(Game.creeps, creep => creep.memory.role == "upgrader");
  if (upgraders.length < 1) {
    for (const room in Game.rooms) {
      const level = Game.rooms[room].controller?.level;
      const body = level && NormalBody[level];
      for (const s in Game.spawns) {
        const SPAWN_CODE = Game.spawns[s].spawnCreep(body || [WORK, CARRY, MOVE], "upgrader" + Game.time, {
          memory: { role: "upgrader", working: false }
        });
        if (SPAWN_CODE === ERR_NOT_ENOUGH_ENERGY && !upgraders.length) {
          Game.spawns[s].spawnCreep([WORK, CARRY, MOVE], "upgrader" + Game.time, {
            memory: { role: "upgrader", working: false }
          });
        }
      }
    }
  }
};

export const upgraderCreep = (creep: Creep) => {
  // ηΆζζ§εΆ
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
    creep.say("π harvest");
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }
  if (creep.memory.working) {
    if (creep.room.controller) {
      creep.say("π upgrade");
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    // ζηΏ
    const EnergeSite = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); // ηΏεΊ
    if (EnergeSite) {
      if (creep.harvest(EnergeSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(EnergeSite, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

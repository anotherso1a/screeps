import { NormalBody } from "constant/body";

const StorageList: StructureConstant[] = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER]; // 存储能量的list，优先存放
const BuildList: BuildableStructureConstant[] = [
  STRUCTURE_EXTENSION,
  STRUCTURE_TOWER,
  STRUCTURE_WALL,
  STRUCTURE_ROAD,
  STRUCTURE_RAMPART,
  STRUCTURE_CONTAINER
]; // 施工list
// const RepairList = [STRUCTURE_TOWER, STRUCTURE_WALL, STRUCTURE_ROAD]; // 维修list

/**
 * 判断建筑物是否是 需要存储能量的单位
 * @param structure 建筑物
 * @returns 建筑物是否是StorageList中的值
 */
function isStorageStructure(
  structure: Structure
): structure is StructureSpawn | StructureExtension | StructureTower | StructureContainer {
  return StorageList.includes(structure.structureType);
}

/**
 * 判断建筑物是否是需要被建造的单位
 * @param structure 建筑物
 * @returns 建筑物是否需要被建造
 */
function isBuildStructure(structure: ConstructionSite): structure is ConstructionSite {
  return BuildList.includes(structure.structureType);
}

/**
 * 转移能量
 * @param creep 爬
 * @param target 要被转移能量的目标
 */
function transfer(creep: Creep, target: AnyStructure, options?: MoveToOpts) {
  creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && creep.moveTo(target, options);
}

function build(creep: Creep, target: ConstructionSite, options?: MoveToOpts) {
  creep.build(target) === ERR_NOT_IN_RANGE && creep.moveTo(target, options);
}

export const spawnNormal = () => {
  const normals = _.filter(Game.creeps, creep => creep.memory.role == "normal");
  if (normals.length < 12) {
    for (const room in Game.rooms) {
      const level = Game.rooms[room].controller?.level;
      const body = level && NormalBody[level];
      for (const s in Game.spawns) {
        const SPAWN_CODE = Game.spawns[s].spawnCreep(body || [WORK, CARRY, MOVE], "normal" + Game.time, {
          memory: { role: "normal", working: false }
        });
        if (SPAWN_CODE === ERR_NOT_ENOUGH_ENERGY && !normals.length) {
          Game.spawns[s].spawnCreep([WORK, CARRY, MOVE], "normal" + Game.time, {
            memory: { role: "normal", working: false }
          });
        }
      }
    }
  }
};

export const normalCreep = (creep: Creep) => {
  // 状态控制
  if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.working = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
    creep.memory.working = true;
  }
  // 干活
  if (creep.memory.working) {
    // 有建筑物需要补充能量
    const harvestSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: e => isStorageStructure(e) && e.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (harvestSite) {
      creep.say("🚀 transfer");
      return transfer(creep, harvestSite, { visualizePathStyle: { stroke: "#ffffff" } });
    }
    // 有工地需要搬砖
    const buildSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {
      filter: e => isBuildStructure(e)
    });
    if (buildSite) {
      creep.say("👷 building");
      return build(creep, buildSite);
    }
    // 没事干升级RCL
    if (creep.room.controller) {
      creep.say("🔝 upgrade");
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    // 挖矿
    const EnergeSite = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); // 矿区
    if (EnergeSite) {
      if (creep.harvest(EnergeSite) == ERR_NOT_IN_RANGE) {
        creep.moveTo(EnergeSite, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
};

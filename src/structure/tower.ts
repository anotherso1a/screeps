export const towerWork = () => {
  for (const room in Game.rooms) {
    const tower = Game.rooms[room].find<StructureTower>(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    _.forEach(tower, t => {
      // 近点敌人优先攻击
      const enemy = t.pos.findInRange(FIND_HOSTILE_CREEPS, 20);
      if (enemy.length) {
        return t.attack(enemy[0]);
      }
      // 维修
      const needsRepair = t.pos.findInRange(FIND_MY_STRUCTURES, 20, {
        filter: s => s.hitsMax !== s.hits
      });
      if (needsRepair.length) {
        return t.repair(needsRepair[0]);
      }
      // 回复
      const needsHeal = t.pos.findInRange(FIND_MY_CREEPS, 20, {
        filter: c => c.hitsMax !== c.hits
      });
      if (needsHeal.length) {
        return t.heal(needsHeal[0]);
      }
      // 远处敌人
      const farawayEnemy = t.pos.findInRange(FIND_HOSTILE_CREEPS, 50);
      if (farawayEnemy.length) {
        return t.attack(farawayEnemy[0]);
      }
      // 敌人建筑
      const enemyStructure = t.pos.findInRange(FIND_HOSTILE_STRUCTURES, 50);
      if (enemyStructure.length) {
        return t.attack(enemyStructure[0]);
      }
      return;
    });
  }
};

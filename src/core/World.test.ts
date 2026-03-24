/**
 * World unit tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { World } from './World';
import { Entity } from './Entity';
import { System } from './System';
import type { Component } from './Component';

// Mock components
class PositionComponent implements Component {
  readonly type = 'PositionComponent';
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

class VelocityComponent implements Component {
  readonly type = 'VelocityComponent';
  vx: number;
  vy: number;

  constructor(vx: number = 0, vy: number = 0) {
    this.vx = vx;
    this.vy = vy;
  }
}

// Mock system
class MockSystem extends System {
  updateCalled = false;
  initCalled = false;
  destroyCalled = false;

  update(): void {
    this.updateCalled = true;
  }

  init(): void {
    this.initCalled = true;
  }

  destroy(): void {
    this.destroyCalled = true;
  }
}

describe('World', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('createEntity', () => {
    it('should create new entity', () => {
      const entity = world.createEntity();
      expect(entity).toBeInstanceOf(Entity);
    });

    it('should add entity to world', () => {
      const entity = world.createEntity();
      const entities = world.getEntities();
      expect(entities).toContain(entity);
    });

    it('should create multiple unique entities', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();

      expect(entity1.getId()).not.toBe(entity2.getId());
    });
  });

  describe('addEntity', () => {
    it('should add existing entity to world', () => {
      const entity = new Entity();
      world.addEntity(entity);

      const entities = world.getEntities();
      expect(entities).toContain(entity);
    });
  });

  describe('removeEntity', () => {
    it('should mark entity as inactive', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);

      expect(entity.isActive()).toBe(false);
    });

    it('should remove entity after update', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.update(0);

      const entities = world.getEntities();
      expect(entities).not.toContain(entity);
    });

    it('should not include inactive entities in getEntities', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      world.removeEntity(entity1);

      const entities = world.getEntities();
      expect(entities).not.toContain(entity1);
      expect(entities).toContain(entity2);
    });
  });

  describe('queryEntities', () => {
    it('should return entities with specific components', () => {
      const entity1 = world.createEntity();
      entity1.addComponent(PositionComponent, new PositionComponent(10, 20));

      const entity2 = world.createEntity();
      entity2.addComponent(VelocityComponent, new VelocityComponent(5, 5));

      const entity3 = world.createEntity();
      entity3.addComponent(PositionComponent, new PositionComponent(30, 40));
      entity3.addComponent(VelocityComponent, new VelocityComponent(1, 1));

      const results = world.queryEntities(PositionComponent);
      expect(results).toHaveLength(2);
      expect(results).toContain(entity1);
      expect(results).toContain(entity3);
    });

    it('should return entities with multiple components', () => {
      const entity1 = world.createEntity();
      entity1.addComponent(PositionComponent, new PositionComponent());

      const entity2 = world.createEntity();
      entity2.addComponent(PositionComponent, new PositionComponent());
      entity2.addComponent(VelocityComponent, new VelocityComponent());

      const results = world.queryEntities(PositionComponent, VelocityComponent);
      expect(results).toHaveLength(1);
      expect(results).toContain(entity2);
    });

    it('should return empty array if no matches', () => {
      const entity = world.createEntity();
      entity.addComponent(PositionComponent, new PositionComponent());

      const results = world.queryEntities(VelocityComponent);
      expect(results).toHaveLength(0);
    });

    it('should not include inactive entities', () => {
      const entity = world.createEntity();
      entity.addComponent(PositionComponent, new PositionComponent());
      world.removeEntity(entity);

      const results = world.queryEntities(PositionComponent);
      expect(results).toHaveLength(0);
    });
  });

  describe('addSystem', () => {
    it('should add system to world', () => {
      const system = new MockSystem();
      world.addSystem(system);

      const systems = world.getSystems();
      expect(systems).toContain(system);
    });

    it('should call system init method', () => {
      const system = new MockSystem();
      world.addSystem(system);

      expect(system.initCalled).toBe(true);
    });

    it('should sort systems by priority', () => {
      const system1 = new MockSystem(10);
      const system2 = new MockSystem(5);
      const system3 = new MockSystem(20);

      world.addSystem(system1);
      world.addSystem(system2);
      world.addSystem(system3);

      const systems = world.getSystems();
      expect(systems[0]).toBe(system3); // priority 20
      expect(systems[1]).toBe(system1); // priority 10
      expect(systems[2]).toBe(system2); // priority 5
    });
  });

  describe('removeSystem', () => {
    it('should remove system from world', () => {
      const system = new MockSystem();
      world.addSystem(system);
      const result = world.removeSystem(system);

      expect(result).toBe(true);
      expect(world.getSystems()).not.toContain(system);
    });

    it('should call system destroy method', () => {
      const system = new MockSystem();
      world.addSystem(system);
      world.removeSystem(system);

      expect(system.destroyCalled).toBe(true);
    });

    it('should return false if system not found', () => {
      const system = new MockSystem();
      const result = world.removeSystem(system);

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should call update on all systems', () => {
      const system1 = new MockSystem();
      const system2 = new MockSystem();

      world.addSystem(system1);
      world.addSystem(system2);
      world.update(0.016);

      expect(system1.updateCalled).toBe(true);
      expect(system2.updateCalled).toBe(true);
    });

    it('should clean up inactive entities', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.update(0);

      const entities = world.getEntities();
      expect(entities).not.toContain(entity);
    });
  });

  describe('clear', () => {
    it('should remove all entities', () => {
      world.createEntity();
      world.createEntity();
      world.clear();

      expect(world.getEntities()).toHaveLength(0);
    });

    it('should remove all systems', () => {
      world.addSystem(new MockSystem());
      world.addSystem(new MockSystem());
      world.clear();

      expect(world.getSystems()).toHaveLength(0);
    });

    it('should call destroy on all systems', () => {
      const system1 = new MockSystem();
      const system2 = new MockSystem();

      world.addSystem(system1);
      world.addSystem(system2);
      world.clear();

      expect(system1.destroyCalled).toBe(true);
      expect(system2.destroyCalled).toBe(true);
    });
  });
});

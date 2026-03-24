import { describe, it, expect, beforeEach } from 'vitest';
import { World } from '../../src/core/World';
import { resetEntityCounter } from '../../src/core/Entity';
import type { Entity } from '../../src/core/Entity';
import { System } from '../../src/core/System';
import type { Component } from '../../src/core/Component';

// Mock components
class PositionComponent implements Component {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}
}

class VelocityComponent implements Component {
  constructor(
    public vx: number = 0,
    public vy: number = 0
  ) {}
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
    resetEntityCounter();
  });

  describe('createEntity', () => {
    it('should create new entity', () => {
      const entity = world.createEntity();
      expect(typeof entity).toBe('number');
    });

    it('should add entity to world', () => {
      const entity = world.createEntity();
      expect(world.hasEntity(entity)).toBe(true);
    });

    it('should create multiple unique entities', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();

      expect(entity1).not.toBe(entity2);
    });
  });

  describe('addEntity', () => {
    it('should add existing entity to world', () => {
      const entity: Entity = 999;
      world.addEntity(entity);

      expect(world.hasEntity(entity)).toBe(true);
    });
  });

  describe('removeEntity', () => {
    it('should remove entity after update', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.update(0);

      expect(world.hasEntity(entity)).toBe(false);
    });

    it('should remove entity components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent(10, 20));
      world.removeEntity(entity);
      world.update(0);

      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
    });
  });

  describe('addComponent', () => {
    it('should add component to entity', () => {
      const entity = world.createEntity();
      const component = new PositionComponent(10, 20);

      world.addComponent(entity, PositionComponent, component);

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
    });

    it('should throw error if entity does not exist', () => {
      const entity: Entity = 999;
      const component = new PositionComponent();

      expect(() => {
        world.addComponent(entity, PositionComponent, component);
      }).toThrow('Entity 999 does not exist in world');
    });

    it('should allow adding multiple components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());
      world.addComponent(entity, VelocityComponent, new VelocityComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
      expect(world.hasComponent(entity, VelocityComponent)).toBe(true);
    });

    it('should replace existing component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent(10, 20));
      world.addComponent(entity, PositionComponent, new PositionComponent(30, 40));

      const component = world.getComponent(entity, PositionComponent);
      expect(component?.x).toBe(30);
      expect(component?.y).toBe(40);
    });
  });

  describe('getComponent', () => {
    it('should return component if exists', () => {
      const entity = world.createEntity();
      const component = new PositionComponent(10, 20);
      world.addComponent(entity, PositionComponent, component);

      const result = world.getComponent(entity, PositionComponent);
      expect(result).toBeDefined();
      expect(result?.x).toBe(10);
      expect(result?.y).toBe(20);
    });

    it('should return undefined if component does not exist', () => {
      const entity = world.createEntity();

      const result = world.getComponent(entity, PositionComponent);
      expect(result).toBeUndefined();
    });

    it('should return correct component type', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent(10, 20));
      world.addComponent(entity, VelocityComponent, new VelocityComponent(5, 5));

      const pos = world.getComponent(entity, PositionComponent);
      const vel = world.getComponent(entity, VelocityComponent);

      expect(pos?.x).toBe(10);
      expect(vel?.vx).toBe(5);
    });
  });

  describe('hasComponent', () => {
    it('should return true if component exists', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
    });

    it('should return false if component does not exist', () => {
      const entity = world.createEntity();

      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
    });

    it('should return correct value for multiple components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
      expect(world.hasComponent(entity, VelocityComponent)).toBe(false);
    });
  });

  describe('removeComponent', () => {
    it('should remove component if exists', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());

      const result = world.removeComponent(entity, PositionComponent);

      expect(result).toBe(true);
      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
    });

    it('should return false if component does not exist', () => {
      const entity = world.createEntity();

      const result = world.removeComponent(entity, PositionComponent);
      expect(result).toBe(false);
    });

    it('should only remove specified component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());
      world.addComponent(entity, VelocityComponent, new VelocityComponent());

      world.removeComponent(entity, PositionComponent);

      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
      expect(world.hasComponent(entity, VelocityComponent)).toBe(true);
    });
  });

  describe('getEntityComponents', () => {
    it('should return empty array if no components', () => {
      const entity = world.createEntity();

      const components = world.getEntityComponents(entity);
      expect(components).toEqual([]);
    });

    it('should return all components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());
      world.addComponent(entity, VelocityComponent, new VelocityComponent());

      const components = world.getEntityComponents(entity);
      expect(components).toHaveLength(2);
    });
  });

  describe('query', () => {
    it('should return entities with specific component', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, PositionComponent, new PositionComponent());

      const entity2 = world.createEntity();
      world.addComponent(entity2, VelocityComponent, new VelocityComponent());

      const entity3 = world.createEntity();
      world.addComponent(entity3, PositionComponent, new PositionComponent());

      const results = world.query(PositionComponent);
      expect(results).toHaveLength(2);
      expect(results).toContain(entity1);
      expect(results).toContain(entity3);
    });

    it('should return entities with multiple components', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, PositionComponent, new PositionComponent());

      const entity2 = world.createEntity();
      world.addComponent(entity2, PositionComponent, new PositionComponent());
      world.addComponent(entity2, VelocityComponent, new VelocityComponent());

      const results = world.query(PositionComponent, VelocityComponent);
      expect(results).toHaveLength(1);
      expect(results).toContain(entity2);
    });

    it('should return empty array if no matches', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());

      const results = world.query(VelocityComponent);
      expect(results).toHaveLength(0);
    });

    it('should not include removed entities', () => {
      const entity = world.createEntity();
      world.addComponent(entity, PositionComponent, new PositionComponent());
      world.removeEntity(entity);
      world.update(0);

      const results = world.query(PositionComponent);
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
      expect(systems[0]).toBe(system3);
      expect(systems[1]).toBe(system1);
      expect(systems[2]).toBe(system2);
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

    it('should clean up removed entities', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.update(0);

      expect(world.hasEntity(entity)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all entities', () => {
      world.createEntity();
      world.createEntity();
      world.clear();

      expect(world.getEntities().size).toBe(0);
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

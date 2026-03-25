import { describe, it, expect, beforeEach } from 'vitest';
import { World } from '../../src/core/world';
import { resetEntityCounter } from '../../src/core/entity';
import type { Entity } from '../../src/core/entity';
import type { Component } from '../../src/core/component';

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
    it('should remove entity after cleanup', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.cleanup();

      expect(world.hasEntity(entity)).toBe(false);
    });

    it('should remove entity components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent(10, 20));
      world.removeEntity(entity);
      world.cleanup();

      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
    });
  });

  describe('addComponent', () => {
    it('should add component to entity', () => {
      const entity = world.createEntity();
      const component = new PositionComponent(10, 20);

      world.addComponent(entity, component);

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
    });

    it('should throw error if entity does not exist', () => {
      const entity: Entity = 999;
      const component = new PositionComponent();

      expect(() => {
        world.addComponent(entity, component);
      }).toThrow('Entity 999 does not exist in world');
    });

    it('should allow adding multiple components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());
      world.addComponent(entity, new VelocityComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
      expect(world.hasComponent(entity, VelocityComponent)).toBe(true);
    });

    it('should replace existing component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent(10, 20));
      world.addComponent(entity, new PositionComponent(30, 40));

      const component = world.getComponent(entity, PositionComponent);
      if (component) {
        expect(component.x).toBe(30);
        expect(component.y).toBe(40);
      }
    });
  });

  describe('getComponent', () => {
    it('should return component if exists', () => {
      const entity = world.createEntity();
      const component = new PositionComponent(10, 20);
      world.addComponent(entity, component);

      const result = world.getComponent(entity, PositionComponent);
      expect(result).toBeDefined();
      if (result) {
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
      }
    });

    it('should return undefined if component does not exist', () => {
      const entity = world.createEntity();

      const result = world.getComponent(entity, PositionComponent);
      expect(result).toBeUndefined();
    });

    it('should return correct component type', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent(10, 20));
      world.addComponent(entity, new VelocityComponent(5, 5));

      const pos = world.getComponent(entity, PositionComponent);
      const vel = world.getComponent(entity, VelocityComponent);

      if (pos && vel) {
        expect(pos.x).toBe(10);
        expect(vel.vx).toBe(5);
      }
    });
  });

  describe('hasComponent', () => {
    it('should return true if component exists', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
    });

    it('should return false if component does not exist', () => {
      const entity = world.createEntity();

      expect(world.hasComponent(entity, PositionComponent)).toBe(false);
    });

    it('should return correct value for multiple components', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());

      expect(world.hasComponent(entity, PositionComponent)).toBe(true);
      expect(world.hasComponent(entity, VelocityComponent)).toBe(false);
    });
  });

  describe('removeComponent', () => {
    it('should remove component if exists', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());

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
      world.addComponent(entity, new PositionComponent());
      world.addComponent(entity, new VelocityComponent());

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
      world.addComponent(entity, new PositionComponent());
      world.addComponent(entity, new VelocityComponent());

      const components = world.getEntityComponents(entity);
      expect(components).toHaveLength(2);
    });
  });

  describe('query', () => {
    it('should return entities with specific component', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, new PositionComponent());

      const entity2 = world.createEntity();
      world.addComponent(entity2, new VelocityComponent());

      const entity3 = world.createEntity();
      world.addComponent(entity3, new PositionComponent());

      const results = world.query(PositionComponent);
      expect(results).toHaveLength(2);
      expect(results).toContain(entity1);
      expect(results).toContain(entity3);
    });

    it('should return entities with multiple components', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, new PositionComponent());

      const entity2 = world.createEntity();
      world.addComponent(entity2, new PositionComponent());
      world.addComponent(entity2, new VelocityComponent());

      const results = world.query(PositionComponent, VelocityComponent);
      expect(results).toHaveLength(1);
      expect(results).toContain(entity2);
    });

    it('should return empty array if no matches', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());

      const results = world.query(VelocityComponent);
      expect(results).toHaveLength(0);
    });

    it('should not include removed entities', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new PositionComponent());
      world.removeEntity(entity);
      world.cleanup();

      const results = world.query(PositionComponent);
      expect(results).toHaveLength(0);
    });
  });

  describe('cleanup', () => {
    it('should remove entities marked for removal', () => {
      const entity = world.createEntity();
      world.removeEntity(entity);
      world.cleanup();

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
  });
});

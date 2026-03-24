import { describe, it, expect, beforeEach } from 'vitest';
import { MovementSystem } from '../../src/systems/MovementSystem';
import { World } from '../../src/core/World';
import { Position } from '../../src/components/Position';
import { Velocity } from '../../src/components/Velocity';

describe('MovementSystem', () => {
  let world: World;
  let system: MovementSystem;

  beforeEach(() => {
    world = new World();
    system = new MovementSystem();
  });

  describe('constructor', () => {
    it('should create movement system with default priority 100', () => {
      expect(system.priority).toBe(100);
    });

    it('should create movement system with custom priority', () => {
      const customSystem = new MovementSystem(50);
      expect(customSystem.priority).toBe(50);
    });
  });

  describe('update', () => {
    it('should update position based on velocity and deltaTime', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(0, 0));
      world.addComponent(entity, new Velocity(100, 50));

      system.update(world, 1.0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(100);
      expect(position?.y).toBe(50);
    });

    it('should accumulate position changes over multiple frames', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(0, 0));
      world.addComponent(entity, new Velocity(100, 50));

      system.update(world, 1.0);
      system.update(world, 1.0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(200);
      expect(position?.y).toBe(100);
    });

    it('should handle fractional deltaTime', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(0, 0));
      world.addComponent(entity, new Velocity(60, 30));

      // 1/60th of a second (one frame at 60 FPS)
      system.update(world, 1 / 60);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBeCloseTo(1, 5);
      expect(position?.y).toBeCloseTo(0.5, 5);
    });

    it('should handle negative velocity', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(100, 100));
      world.addComponent(entity, new Velocity(-50, -25));

      system.update(world, 1.0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(50);
      expect(position?.y).toBe(75);
    });

    it('should update multiple entities independently', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, new Position(0, 0));
      world.addComponent(entity1, new Velocity(100, 0));

      const entity2 = world.createEntity();
      world.addComponent(entity2, new Position(0, 0));
      world.addComponent(entity2, new Velocity(0, 50));

      system.update(world, 1.0);

      const position1 = world.getComponent(entity1, Position);
      const position2 = world.getComponent(entity2, Position);

      expect(position1?.x).toBe(100);
      expect(position1?.y).toBe(0);
      expect(position2?.x).toBe(0);
      expect(position2?.y).toBe(50);
    });

    it('should not update entities without Velocity component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(10, 20));

      system.update(world, 1.0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(10);
      expect(position?.y).toBe(20);
    });

    it('should not update entities without Position component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Velocity(100, 50));

      // Should not throw error
      expect(() => system.update(world, 1.0)).not.toThrow();
    });

    it('should handle zero velocity', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(100, 50));
      world.addComponent(entity, new Velocity(0, 0));

      system.update(world, 1.0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(100);
      expect(position?.y).toBe(50);
    });

    it('should handle empty world', () => {
      expect(() => system.update(world, 1.0)).not.toThrow();
    });
  });
});

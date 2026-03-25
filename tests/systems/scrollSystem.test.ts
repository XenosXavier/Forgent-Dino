import { describe, it, expect, beforeEach } from 'vitest';
import { ScrollSystem } from '../../src/systems/scrollSystem';
import { World } from '../../src/core/world';
import { Position } from '../../src/components/position';
import { Sprite } from '../../src/components/sprite';

describe('ScrollSystem', () => {
  let world: World;
  let system: ScrollSystem;
  const canvasWidth = 600;

  beforeEach(() => {
    world = new World();
    system = new ScrollSystem(canvasWidth);
  });

  describe('constructor', () => {
    it('should create scroll system with default priority 50', () => {
      expect(system.priority).toBe(50);
    });

    it('should create scroll system with custom priority', () => {
      const customSystem = new ScrollSystem(canvasWidth, 75);
      expect(customSystem.priority).toBe(75);
    });
  });

  describe('update', () => {
    it('should not move entity within screen bounds', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(100, 50));
      world.addComponent(entity, new Sprite(50, 30, '#000000'));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(100);
    });

    it('should wrap entity when completely off left side', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(-51, 50));
      world.addComponent(entity, new Sprite(50, 30, '#000000'));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(canvasWidth);
    });

    it('should not wrap entity partially off screen', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(-25, 50));
      world.addComponent(entity, new Sprite(50, 30, '#000000'));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(-25);
    });

    it('should wrap entity exactly at boundary', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(-50, 50));
      world.addComponent(entity, new Sprite(50, 30, '#000000'));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(canvasWidth);
    });

    it('should handle multiple entities independently', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, new Position(-51, 50));
      world.addComponent(entity1, new Sprite(50, 30, '#000000'));

      const entity2 = world.createEntity();
      world.addComponent(entity2, new Position(100, 50));
      world.addComponent(entity2, new Sprite(50, 30, '#000000'));

      system.update(world, 0);

      const position1 = world.getComponent(entity1, Position);
      const position2 = world.getComponent(entity2, Position);

      expect(position1?.x).toBe(canvasWidth);
      expect(position2?.x).toBe(100);
    });

    it('should not affect entities without Sprite component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(-51, 50));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(-51);
    });

    it('should not affect entities without Position component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Sprite(50, 30, '#000000'));

      expect(() => system.update(world, 0)).not.toThrow();
    });

    it('should handle empty world', () => {
      expect(() => system.update(world, 0)).not.toThrow();
    });

    it('should handle different sprite widths', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(-101, 50));
      world.addComponent(entity, new Sprite(100, 30, '#000000'));

      system.update(world, 0);

      const position = world.getComponent(entity, Position);
      expect(position?.x).toBe(canvasWidth);
    });
  });
});

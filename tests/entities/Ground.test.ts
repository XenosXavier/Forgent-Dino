import { describe, it, expect, beforeEach } from 'vitest';
import { createGround, DEFAULT_GROUND_CONFIG } from '../../src/entities/Ground';
import { World } from '../../src/core/World';
import { Position } from '../../src/components/Position';
import { Velocity } from '../../src/components/Velocity';
import { Sprite } from '../../src/components/Sprite';

describe('Ground Entity', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('createGround', () => {
    it('should create two ground entities', () => {
      const grounds = createGround(world);

      expect(grounds).toHaveLength(2);
      expect(world.hasEntity(grounds[0]!)).toBe(true);
      expect(world.hasEntity(grounds[1]!)).toBe(true);
    });

    it('should create grounds with default configuration', () => {
      const grounds = createGround(world);
      const [ground1, ground2] = grounds;

      const pos1 = world.getComponent(ground1!, Position);
      const vel1 = world.getComponent(ground1!, Velocity);
      const sprite1 = world.getComponent(ground1!, Sprite);

      expect(pos1).toBeDefined();
      expect(vel1).toBeDefined();
      expect(sprite1).toBeDefined();

      expect(pos1!.x).toBe(0);
      expect(pos1!.y).toBe(DEFAULT_GROUND_CONFIG.y);
      expect(vel1!.vx).toBe(DEFAULT_GROUND_CONFIG.scrollSpeed);
      expect(vel1!.vy).toBe(0);
      expect(sprite1!.width).toBe(DEFAULT_GROUND_CONFIG.width);
      expect(sprite1!.height).toBe(DEFAULT_GROUND_CONFIG.height);
      expect(sprite1!.color).toBe(DEFAULT_GROUND_CONFIG.color);

      const pos2 = world.getComponent(ground2!, Position);
      expect(pos2).toBeDefined();
      expect(pos2!.x).toBe(DEFAULT_GROUND_CONFIG.width);
      expect(pos2!.y).toBe(DEFAULT_GROUND_CONFIG.y);
    });

    it('should create grounds with custom configuration', () => {
      const config = {
        width: 800,
        height: 20,
        y: 150,
        scrollSpeed: -300,
        color: '#FF0000',
      };

      const grounds = createGround(world, config);
      const [ground1, ground2] = grounds;

      const pos1 = world.getComponent(ground1!, Position);
      const vel1 = world.getComponent(ground1!, Velocity);
      const sprite1 = world.getComponent(ground1!, Sprite);

      expect(pos1).toBeDefined();
      expect(vel1).toBeDefined();
      expect(sprite1).toBeDefined();

      expect(pos1!.x).toBe(0);
      expect(pos1!.y).toBe(150);
      expect(vel1!.vx).toBe(-300);
      expect(sprite1!.width).toBe(800);
      expect(sprite1!.height).toBe(20);
      expect(sprite1!.color).toBe('#FF0000');

      const pos2 = world.getComponent(ground2!, Position);
      expect(pos2).toBeDefined();
      expect(pos2!.x).toBe(800);
    });

    it('should position second ground immediately after first ground', () => {
      const config = {
        width: 600,
        height: 12,
        y: 138,
        scrollSpeed: -200,
        color: '#535353',
      };

      const grounds = createGround(world, config);
      const [ground1, ground2] = grounds;

      const pos1 = world.getComponent(ground1!, Position);
      const sprite1 = world.getComponent(ground1!, Sprite);
      const pos2 = world.getComponent(ground2!, Position);

      expect(pos1).toBeDefined();
      expect(sprite1).toBeDefined();
      expect(pos2).toBeDefined();

      // Second ground starts where first ground ends
      expect(pos2!.x).toBe(pos1!.x + sprite1!.width);
    });

    it('should give both grounds same velocity', () => {
      const grounds = createGround(world);
      const [ground1, ground2] = grounds;

      const vel1 = world.getComponent(ground1!, Velocity);
      const vel2 = world.getComponent(ground2!, Velocity);

      expect(vel1).toBeDefined();
      expect(vel2).toBeDefined();

      expect(vel1!.vx).toBe(vel2!.vx);
      expect(vel1!.vy).toBe(vel2!.vy);
    });

    it('should give both grounds same sprite dimensions', () => {
      const grounds = createGround(world);
      const [ground1, ground2] = grounds;

      const sprite1 = world.getComponent(ground1!, Sprite);
      const sprite2 = world.getComponent(ground2!, Sprite);

      expect(sprite1).toBeDefined();
      expect(sprite2).toBeDefined();

      expect(sprite1!.width).toBe(sprite2!.width);
      expect(sprite1!.height).toBe(sprite2!.height);
      expect(sprite1!.color).toBe(sprite2!.color);
    });
  });
});

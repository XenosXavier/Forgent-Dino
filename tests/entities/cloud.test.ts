import { describe, it, expect, beforeEach } from 'vitest';
import { createClouds, DEFAULT_CLOUD_CONFIG } from '../../src/entities/cloud';
import { World } from '../../src/core/world';
import { Position } from '../../src/components/position';
import { Velocity } from '../../src/components/velocity';
import { Sprite } from '../../src/components/sprite';

describe('Cloud Entity', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('createClouds', () => {
    it('should create clouds with default count (3-5)', () => {
      const clouds = createClouds(world);

      expect(clouds.length).toBeGreaterThanOrEqual(3);
      expect(clouds.length).toBeLessThanOrEqual(5);

      // Verify all clouds exist in world
      for (const cloud of clouds) {
        expect(world.hasEntity(cloud)).toBe(true);
      }
    });

    it('should create specific number of clouds when count is provided', () => {
      const count = 4;
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, count);

      expect(clouds).toHaveLength(count);
    });

    it('should create clouds with default configuration', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 3);
      const cloud = clouds[0]!;

      const pos = world.getComponent(cloud, Position);
      const vel = world.getComponent(cloud, Velocity);
      const sprite = world.getComponent(cloud, Sprite);

      expect(pos).toBeDefined();
      expect(vel).toBeDefined();
      expect(sprite).toBeDefined();

      // Verify velocity matches parallax speed (0.5x ground speed)
      expect(vel!.vx).toBe(DEFAULT_CLOUD_CONFIG.scrollSpeed);
      expect(vel!.vy).toBe(0);

      // Verify sprite dimensions
      expect(sprite!.width).toBe(DEFAULT_CLOUD_CONFIG.width);
      expect(sprite!.height).toBe(DEFAULT_CLOUD_CONFIG.height);
      expect(sprite!.color).toBe(DEFAULT_CLOUD_CONFIG.color);
    });

    it('should create clouds with custom configuration', () => {
      const config = {
        width: 50,
        height: 20,
        scrollSpeed: -80,
        color: '#FFFFFF',
        canvasWidth: 600,
        canvasHeight: 150,
      };

      const clouds = createClouds(world, config, 3);
      const cloud = clouds[0]!;

      const vel = world.getComponent(cloud, Velocity);
      const sprite = world.getComponent(cloud, Sprite);

      expect(vel!.vx).toBe(-80);
      expect(sprite!.width).toBe(50);
      expect(sprite!.height).toBe(20);
      expect(sprite!.color).toBe('#FFFFFF');
    });

    it('should position clouds in upper half of screen', () => {
      const config = {
        ...DEFAULT_CLOUD_CONFIG,
        canvasHeight: 150,
      };

      const clouds = createClouds(world, config, 5);

      for (const cloud of clouds) {
        const pos = world.getComponent(cloud, Position);
        const sprite = world.getComponent(cloud, Sprite);

        expect(pos).toBeDefined();
        expect(sprite).toBeDefined();

        // Clouds should be in upper half (y < canvasHeight/2)
        expect(pos!.y).toBeGreaterThanOrEqual(20); // Min distance from top
        expect(pos!.y).toBeLessThan(config.canvasHeight / 2);
      }
    });

    it('should distribute clouds horizontally across canvas', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 4);

      const xPositions = clouds.map((cloud) => {
        const pos = world.getComponent(cloud, Position);
        return pos!.x;
      });

      // Verify clouds are distributed (not all at same X)
      const uniqueX = new Set(xPositions);
      expect(uniqueX.size).toBeGreaterThan(1);

      // Verify all clouds are within canvas bounds
      for (const x of xPositions) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(DEFAULT_CLOUD_CONFIG.canvasWidth);
      }
    });

    it('should give all clouds same velocity', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 4);

      const velocities = clouds.map((cloud) => {
        const vel = world.getComponent(cloud, Velocity);
        return vel!.vx;
      });

      // All clouds should have same horizontal velocity
      const uniqueVelocities = new Set(velocities);
      expect(uniqueVelocities.size).toBe(1);
      expect(velocities[0]).toBe(DEFAULT_CLOUD_CONFIG.scrollSpeed);
    });

    it('should give all clouds same sprite dimensions', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 4);

      for (const cloud of clouds) {
        const sprite = world.getComponent(cloud, Sprite);

        expect(sprite).toBeDefined();
        expect(sprite!.width).toBe(DEFAULT_CLOUD_CONFIG.width);
        expect(sprite!.height).toBe(DEFAULT_CLOUD_CONFIG.height);
        expect(sprite!.color).toBe(DEFAULT_CLOUD_CONFIG.color);
      }
    });

    it('should create clouds with different Y positions', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 5);

      const yPositions = clouds.map((cloud) => {
        const pos = world.getComponent(cloud, Position);
        return pos!.y;
      });

      // Most clouds should have different Y positions (randomness)
      // At least 2 different Y positions among 5 clouds
      const uniqueY = new Set(yPositions);
      expect(uniqueY.size).toBeGreaterThanOrEqual(2);
    });

    it('should handle minimum cloud count', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 1);

      expect(clouds).toHaveLength(1);
      expect(world.hasEntity(clouds[0]!)).toBe(true);
    });

    it('should handle maximum cloud count', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 10);

      expect(clouds).toHaveLength(10);

      for (const cloud of clouds) {
        expect(world.hasEntity(cloud)).toBe(true);
      }
    });

    it('should create clouds with zero vertical velocity', () => {
      const clouds = createClouds(world, DEFAULT_CLOUD_CONFIG, 3);

      for (const cloud of clouds) {
        const vel = world.getComponent(cloud, Velocity);
        expect(vel!.vy).toBe(0);
      }
    });
  });
});

/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Engine } from '../../src/core/engine';
import { World } from '../../src/core/world';
import { MovementSystem } from '../../src/systems/movementSystem';
import { ScrollSystem } from '../../src/systems/scrollSystem';
import { RenderSystem } from '../../src/systems/renderSystem';
import { createGround } from '../../src/entities/ground';
import { createClouds } from '../../src/entities/cloud';
import { Position } from '../../src/components/position';
import { Velocity } from '../../src/components/velocity';
import { Sprite } from '../../src/components/sprite';

describe('Game Loop Integration', () => {
  let world: World;
  let movementSystem: MovementSystem;
  let scrollSystem: ScrollSystem;
  let renderSystem: RenderSystem;
  let mockCtx: CanvasRenderingContext2D;

  beforeEach(() => {
    world = new World();

    // Mock canvas context
    mockCtx = {
      canvas: { width: 600, height: 150 },
      fillStyle: '',
      fillRect: vi.fn(),
      drawImage: vi.fn(),
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Create systems
    movementSystem = new MovementSystem(100);
    scrollSystem = new ScrollSystem(600, 50);
    renderSystem = new RenderSystem(mockCtx, -100);
  });

  describe('System Integration', () => {
    it('should update positions through movement system', () => {
      const grounds = createGround(world);
      const ground1 = grounds[0]!;

      const initialPos = world.getComponent(ground1, Position)!;
      const initialX = initialPos.x;

      // Run movement system (1 second)
      movementSystem.update(world, 1.0);

      const finalPos = world.getComponent(ground1, Position)!;
      expect(finalPos.x).toBe(initialX - 200); // scrollSpeed = -200
    });

    it('should wrap entities through scroll system', () => {
      const grounds = createGround(world);
      const ground1 = grounds[0]!;

      // Move ground off-screen
      const pos = world.getComponent(ground1, Position)!;
      pos.x = -1201; // Past boundary (width = 1200)

      // Run scroll system
      scrollSystem.update(world, 0.016);

      // Should wrap to right side
      const finalPos = world.getComponent(ground1, Position)!;
      expect(finalPos.x).toBeGreaterThanOrEqual(600);
    });

    it('should render entities through render system', () => {
      createGround(world); // 2 grounds
      createClouds(world, undefined, 3); // 3 clouds

      // Run render system
      renderSystem.update(world, 0.016);

      // Should render background + entities
      const fillRectSpy = mockCtx.fillRect as unknown as ReturnType<typeof vi.fn>;
      expect(fillRectSpy).toHaveBeenCalled();
      expect(fillRectSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    it('should process all systems in sequence', () => {
      createGround(world);

      const entities = Array.from(world.getEntities());
      const ground1 = entities[0]!;
      const initialPos = world.getComponent(ground1, Position)!;
      const initialX = initialPos.x;

      // Simulate one frame (all systems)
      movementSystem.update(world, 1 / 60); // 16.67ms
      scrollSystem.update(world, 1 / 60);
      renderSystem.update(world, 1 / 60);

      // Position should have moved
      const finalPos = world.getComponent(ground1, Position)!;
      expect(finalPos.x).toBeLessThan(initialX);
    });
  });

  describe('Entity Integration', () => {
    it('should handle ground and clouds together', () => {
      createGround(world); // 2 entities
      createClouds(world, undefined, 3); // 3 entities

      expect(world.getEntities().size).toBe(5);

      // All should have Position and Velocity
      for (const entity of world.getEntities()) {
        expect(world.hasComponent(entity, Position)).toBe(true);
        expect(world.hasComponent(entity, Velocity)).toBe(true);
        expect(world.hasComponent(entity, Sprite)).toBe(true);
      }
    });

    it('should maintain different velocities for parallax effect', () => {
      const grounds = createGround(world);
      const clouds = createClouds(world, undefined, 3);

      const groundVel = world.getComponent(grounds[0]!, Velocity)!;
      const cloudVel = world.getComponent(clouds[0]!, Velocity)!;

      // Clouds should move at 0.5x ground speed
      expect(cloudVel.vx).toBe(-100);
      expect(groundVel.vx).toBe(-200);
      expect(Math.abs(cloudVel.vx)).toBeLessThan(Math.abs(groundVel.vx));
    });

    it('should position entities correctly on creation', () => {
      const grounds = createGround(world);
      const clouds = createClouds(world, undefined, 3);

      // Grounds should be side-by-side
      const ground1Pos = world.getComponent(grounds[0]!, Position)!;
      const ground2Pos = world.getComponent(grounds[1]!, Position)!;
      const groundSprite = world.getComponent(grounds[0]!, Sprite)!;

      expect(ground2Pos.x).toBe(ground1Pos.x + groundSprite.width);

      // Clouds should be in upper half
      for (const cloud of clouds) {
        const cloudPos = world.getComponent(cloud, Position)!;
        expect(cloudPos.y).toBeGreaterThanOrEqual(20);
        expect(cloudPos.y).toBeLessThan(150 / 2);
      }
    });
  });

  describe('Engine Integration', () => {
    it('should manage systems in priority order', () => {
      const engine = new Engine(world);

      engine.addSystem(new MovementSystem(100)); // High priority
      engine.addSystem(new ScrollSystem(600, 50)); // Medium priority
      engine.addSystem(new RenderSystem(mockCtx, -100)); // Low priority

      const systems = engine.getSystems();

      expect(systems[0]?.priority).toBe(100);
      expect(systems[1]?.priority).toBe(50);
      expect(systems[2]?.priority).toBe(-100);
    });

    it('should start and stop correctly', () => {
      const engine = new Engine(world);
      engine.addSystem(new MovementSystem());

      expect(engine.isRunning()).toBe(false);

      engine.start();
      expect(engine.isRunning()).toBe(true);

      engine.stop();
      expect(engine.isRunning()).toBe(false);
    });

    it('should handle multiple start/stop cycles', () => {
      const engine = new Engine(world);
      engine.addSystem(new RenderSystem(mockCtx));

      for (let i = 0; i < 3; i++) {
        engine.start();
        expect(engine.isRunning()).toBe(true);
        engine.stop();
        expect(engine.isRunning()).toBe(false);
      }
    });
  });

  describe('Performance', () => {
    it('should handle many updates efficiently', () => {
      createGround(world);
      createClouds(world, undefined, 5);

      const startTime = performance.now();
      const iterations = 1000;

      // Run systems many times
      for (let i = 0; i < iterations; i++) {
        movementSystem.update(world, 1 / 60);
        scrollSystem.update(world, 1 / 60);
        renderSystem.update(world, 1 / 60);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgFrameTime = totalTime / iterations;

      // Should complete quickly (< 1ms per frame on average)
      expect(avgFrameTime).toBeLessThan(1);
    });

    it('should maintain entity count over time', () => {
      createGround(world);
      createClouds(world, undefined, 3);

      const initialCount = world.getEntities().size;

      // Run many frames
      for (let i = 0; i < 100; i++) {
        movementSystem.update(world, 1 / 60);
        scrollSystem.update(world, 1 / 60);
      }

      expect(world.getEntities().size).toBe(initialCount);
    });
  });

  describe('World Cleanup', () => {
    it('should handle entity removal', () => {
      const grounds = createGround(world);
      const ground1 = grounds[0]!;

      expect(world.hasEntity(ground1)).toBe(true);

      world.removeEntity(ground1);
      world.cleanup();

      expect(world.hasEntity(ground1)).toBe(false);
    });

    it('should remove entity components on cleanup', () => {
      const grounds = createGround(world);
      const ground1 = grounds[0]!;

      expect(world.hasComponent(ground1, Position)).toBe(true);

      world.removeEntity(ground1);
      world.cleanup();

      expect(world.hasComponent(ground1, Position)).toBe(false);
    });
  });
});

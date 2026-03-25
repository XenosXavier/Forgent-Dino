import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RenderSystem } from '../../src/systems/renderSystem';
import { World } from '../../src/core/world';
import { Position } from '../../src/components/position';
import { Sprite } from '../../src/components/sprite';

describe('RenderSystem', () => {
  let world: World;
  let mockCtx: CanvasRenderingContext2D;
  let system: RenderSystem;
  let clearRectSpy: ReturnType<typeof vi.fn>;
  let fillRectSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    world = new World();

    // Create mock canvas context
    clearRectSpy = vi.fn();
    fillRectSpy = vi.fn();

    mockCtx = {
      canvas: { width: 600, height: 150 },
      clearRect: clearRectSpy,
      fillRect: fillRectSpy,
      fillStyle: '',
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    system = new RenderSystem(mockCtx);
  });

  describe('constructor', () => {
    it('should create render system with default priority -100', () => {
      expect(system.priority).toBe(-100);
    });

    it('should create render system with custom priority', () => {
      const customSystem = new RenderSystem(mockCtx, -50);
      expect(customSystem.priority).toBe(-50);
    });
  });

  describe('update', () => {
    it('should fill canvas with white background before rendering', () => {
      system.update(world, 0);

      expect(mockCtx.fillStyle).toBe('#ffffff');
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150);
      expect(fillRectSpy).toHaveBeenCalled();
    });

    it('should render entity with Position and Sprite', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(10, 20));
      world.addComponent(entity, new Sprite(50, 30, '#FF0000'));

      system.update(world, 0);

      expect(mockCtx.fillStyle).toBe('#FF0000');
      expect(fillRectSpy).toHaveBeenCalledWith(10, 20, 50, 30);
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150); // White background
    });

    it('should render multiple entities', () => {
      const entity1 = world.createEntity();
      world.addComponent(entity1, new Position(10, 20));
      world.addComponent(entity1, new Sprite(50, 30, '#FF0000'));

      const entity2 = world.createEntity();
      world.addComponent(entity2, new Position(100, 50));
      world.addComponent(entity2, new Sprite(40, 60, '#00FF00'));

      system.update(world, 0);

      expect(fillRectSpy).toHaveBeenCalledTimes(3); // 1 background + 2 entities
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150); // White background
      expect(fillRectSpy).toHaveBeenCalledWith(10, 20, 50, 30);
      expect(fillRectSpy).toHaveBeenCalledWith(100, 50, 40, 60);
    });

    it('should not render entities without Position component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Sprite(50, 30, '#FF0000'));

      system.update(world, 0);

      // Should only render white background, not the entity
      expect(fillRectSpy).toHaveBeenCalledTimes(1);
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150);
    });

    it('should not render entities without Sprite component', () => {
      const entity = world.createEntity();
      world.addComponent(entity, new Position(10, 20));

      system.update(world, 0);

      // Should only render white background, not the entity
      expect(fillRectSpy).toHaveBeenCalledTimes(1);
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150);
    });

    it('should handle empty world', () => {
      system.update(world, 0);

      // Should render white background only
      expect(fillRectSpy).toHaveBeenCalledTimes(1);
      expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 600, 150);
    });
  });
});

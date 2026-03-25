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

    it('should render sprite with image when image is loaded', () => {
      const drawImageSpy = vi.spyOn(mockCtx, 'drawImage');

      // Create mock image that is loaded
      const mockImage = {
        complete: true,
        naturalWidth: 100,
        src: '',
      } as HTMLImageElement;

      // Mock Image constructor
      global.Image = vi.fn(() => mockImage) as unknown as typeof Image;

      const entity = world.createEntity();
      world.addComponent(entity, new Position(10, 20));
      world.addComponent(
        entity,
        new Sprite(50, 30, '#FF0000', 'test.png', 5, 10, 100, 50)
      );

      system.update(world, 0);

      // Should use drawImage with source rectangle
      expect(drawImageSpy).toHaveBeenCalledWith(
        mockImage,
        5, // sourceX
        10, // sourceY
        100, // sourceWidth
        50, // sourceHeight
        10, // destX
        20, // destY
        50, // destWidth
        30 // destHeight
      );
    });

    it('should fallback to fillRect when image not loaded', () => {
      // Create mock image that is NOT loaded
      const mockImage = {
        complete: false,
        naturalWidth: 0,
        src: '',
      } as HTMLImageElement;

      global.Image = vi.fn(() => mockImage) as unknown as typeof Image;

      const entity = world.createEntity();
      world.addComponent(entity, new Position(10, 20));
      world.addComponent(
        entity,
        new Sprite(50, 30, '#FF0000', 'test.png')
      );

      system.update(world, 0);

      // Should fallback to fillRect
      expect(mockCtx.fillStyle).toBe('#FF0000');
      expect(fillRectSpy).toHaveBeenCalledWith(10, 20, 50, 30);
    });

    it('should use sprite dimensions as default source dimensions', () => {
      const drawImageSpy = vi.spyOn(mockCtx, 'drawImage');

      // Create mock loaded image
      const mockImage = {
        complete: true,
        naturalWidth: 100,
        src: '',
      } as HTMLImageElement;

      global.Image = vi.fn(() => mockImage) as unknown as typeof Image;

      const entity = world.createEntity();
      world.addComponent(entity, new Position(15, 25));
      world.addComponent(
        entity,
        new Sprite(60, 40, '#00FF00', 'test.png', 10, 20) // No sourceWidth/Height
      );

      system.update(world, 0);

      // Should use sprite width/height as source dimensions
      expect(drawImageSpy).toHaveBeenCalledWith(
        mockImage,
        10, // sourceX
        20, // sourceY
        60, // sourceWidth (defaults to sprite.width)
        40, // sourceHeight (defaults to sprite.height)
        15, // destX
        25, // destY
        60, // destWidth
        40 // destHeight
      );
    });
  });
});

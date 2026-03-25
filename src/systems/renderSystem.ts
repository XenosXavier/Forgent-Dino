/**
 * RenderSystem - Renders entities with Position and Sprite components
 * Responsible for drawing sprites on canvas
 * Supports both solid color fill and sprite sheet rendering
 */

import { System } from '../core/system';
import type { World } from '../core/world';
import { Position } from '../components/position';
import { Sprite } from '../components/sprite';

/**
 * RenderSystem renders all entities that have Position and Sprite components
 */
export class RenderSystem extends System {
  private ctx: CanvasRenderingContext2D;
  private imageCache: Map<string, HTMLImageElement>;

  /**
   * Create a new RenderSystem
   * @param ctx Canvas 2D rendering context
   * @param priority System execution priority (default: -100, renders last)
   */
  constructor(ctx: CanvasRenderingContext2D, priority: number = -100) {
    super(priority);
    this.ctx = ctx;
    this.imageCache = new Map();
  }

  /**
   * Load and cache an image
   * @param imagePath Path to image
   * @returns HTMLImageElement or undefined if not loaded yet
   */
  private loadImage(imagePath: string): HTMLImageElement | undefined {
    if (this.imageCache.has(imagePath)) {
      return this.imageCache.get(imagePath);
    }

    // Create new image and start loading
    const image = new Image();
    image.src = imagePath;
    this.imageCache.set(imagePath, image);
    return image;
  }

  /**
   * Update and render all entities with Position and Sprite components
   * @param world Game world
   * @param _deltaTime Time since last frame (unused in rendering)
   */
  update(world: World, _deltaTime: number): void {
    // Clear canvas with white background (Chrome Dino style)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Query all entities with Position and Sprite components
    const entities = world.query(Position, Sprite);

    // Render each entity
    for (const entity of entities) {
      const position = world.getComponent(entity, Position);
      const sprite = world.getComponent(entity, Sprite);

      // Skip if components are missing (shouldn't happen after query)
      if (!position || !sprite) continue;

      // Check if sprite uses image rendering
      if (sprite.imagePath) {
        const image = this.loadImage(sprite.imagePath);

        // Render image if loaded, otherwise use fallback color
        if (image && image.complete && image.naturalWidth > 0) {
          // Use source rectangle if specified, otherwise use full image
          const sx = sprite.sourceX ?? 0;
          const sy = sprite.sourceY ?? 0;
          const sw = sprite.sourceWidth ?? sprite.width;
          const sh = sprite.sourceHeight ?? sprite.height;

          this.ctx.drawImage(
            image,
            sx,
            sy,
            sw,
            sh,
            position.x,
            position.y,
            sprite.width,
            sprite.height
          );
        } else {
          // Fallback to solid color while image is loading
          this.ctx.fillStyle = sprite.color;
          this.ctx.fillRect(position.x, position.y, sprite.width, sprite.height);
        }
      } else {
        // Render sprite as filled rectangle
        this.ctx.fillStyle = sprite.color;
        this.ctx.fillRect(position.x, position.y, sprite.width, sprite.height);
      }
    }
  }
}

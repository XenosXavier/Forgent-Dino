/**
 * ScrollSystem - Handles infinite scrolling with wraparound
 * Resets entity position when it moves off screen
 */

import { System } from '../core/system';
import type { World } from '../core/world';
import { Position } from '../components/position';
import { Sprite } from '../components/sprite';

/**
 * ScrollSystem manages infinite scrolling by wrapping entities
 */
export class ScrollSystem extends System {
  private canvasWidth: number;

  /**
   * Create a new ScrollSystem
   * @param canvasWidth Canvas width for boundary detection
   * @param priority System execution priority (default: 50, after movement)
   */
  constructor(canvasWidth: number, priority: number = 50) {
    super(priority);
    this.canvasWidth = canvasWidth;
  }

  /**
   * Update entity positions for infinite scrolling
   * When entity moves completely off left side, wrap to right side
   * For seamless looping, find the rightmost entity and position after it
   * @param world Game world
   * @param _deltaTime Time since last frame (unused)
   */
  update(world: World, _deltaTime: number): void {
    // Query all entities with Position and Sprite (scrollable elements)
    const entities = world.query(Position, Sprite);

    for (const entity of entities) {
      const position = world.getComponent(entity, Position);
      const sprite = world.getComponent(entity, Sprite);

      // Skip if components are missing
      if (!position || !sprite) continue;

      // If entity moved completely off left side of screen
      // (right edge at or past left boundary)
      if (position.x + sprite.width <= 0) {
        // Find the rightmost entity with same dimensions (for seamless looping)
        let maxX = this.canvasWidth;

        for (const otherEntity of entities) {
          if (otherEntity === entity) continue;

          const otherPos = world.getComponent(otherEntity, Position);
          const otherSprite = world.getComponent(otherEntity, Sprite);

          // Check if same size (part of same looping group)
          if (
            otherPos &&
            otherSprite &&
            otherSprite.width === sprite.width &&
            otherSprite.height === sprite.height
          ) {
            // Position after the rightmost entity for seamless connection
            const otherRightEdge = otherPos.x + otherSprite.width;
            if (otherRightEdge > maxX) {
              maxX = otherRightEdge;
            }
          }
        }

        // Wrap to position immediately after the rightmost entity
        position.x = maxX;
      }
    }
  }
}

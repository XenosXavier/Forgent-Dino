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
        // Wrap to right side
        position.x = this.canvasWidth;
      }
    }
  }
}

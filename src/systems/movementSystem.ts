/**
 * MovementSystem - Updates entity positions based on velocity
 * Handles physics movement for all entities with Position and Velocity
 */

import { System } from '../core/system';
import type { World } from '../core/world';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';

/**
 * MovementSystem updates position based on velocity over time
 */
export class MovementSystem extends System {
  /**
   * Create a new MovementSystem
   * @param priority System execution priority (default: 100, runs early)
   */
  constructor(priority: number = 100) {
    super(priority);
  }

  /**
   * Update positions based on velocities
   * @param world Game world
   * @param deltaTime Time since last frame in seconds
   */
  update(world: World, deltaTime: number): void {
    // Query all entities with Position and Velocity components
    const entities = world.query(Position, Velocity);

    // Update each entity's position
    for (const entity of entities) {
      const position = world.getComponent(entity, Position);
      const velocity = world.getComponent(entity, Velocity);

      // Skip if components are missing (shouldn't happen after query)
      if (!position || !velocity) continue;

      // Update position: position += velocity * deltaTime
      position.x += velocity.vx * deltaTime;
      position.y += velocity.vy * deltaTime;
    }
  }
}

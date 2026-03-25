/**
 * System - Pure logic that operates on entities with specific components
 * Systems should not store state, only contain logic
 */

import type { World } from './world';

/**
 * Abstract base class for all systems
 * Systems process entities that have specific components
 */
export abstract class System {
  /**
   * System priority for execution order (higher = earlier)
   * Default priority is 0
   */
  readonly priority: number;

  constructor(priority: number = 0) {
    this.priority = priority;
  }

  /**
   * Update system logic (called every frame)
   * @param world Reference to game world
   * @param deltaTime Time since last frame in seconds
   */
  abstract update(world: World, deltaTime: number): void;

  /**
   * Optional: Initialize system resources
   * Called once when system is registered
   */
  init?(world: World): void;

  /**
   * Optional: Cleanup system resources
   * Called when system is removed
   */
  destroy?(): void;
}

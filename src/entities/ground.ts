/**
 * Ground Entity Factory
 * Creates ground entities with scrolling behavior
 */

import type { World } from '../core/world';
import type { Entity } from '../core/entity';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';
import { Sprite } from '../components/sprite';

/**
 * Ground configuration
 */
export interface GroundConfig {
  /**
   * Ground width in pixels
   */
  width: number;

  /**
   * Ground height in pixels
   */
  height: number;

  /**
   * Ground Y position (distance from top)
   */
  y: number;

  /**
   * Scroll speed in pixels per second (negative = left)
   */
  scrollSpeed: number;

  /**
   * Ground color
   */
  color: string;
}

/**
 * Default ground configuration
 * Uses Chrome Dino sprite sheet for ground texture
 */
export const DEFAULT_GROUND_CONFIG: GroundConfig = {
  width: 600,
  height: 12,
  y: 138,
  scrollSpeed: -200,
  color: '#535353', // Fallback color if image fails to load
};

/**
 * Create ground entities with looping scroll behavior
 * Creates two ground segments side-by-side for seamless looping
 * Uses Chrome Dino sprite sheet for ground texture
 * @param world Game world
 * @param config Ground configuration
 * @returns Array of ground entity IDs [ground1, ground2]
 */
export function createGround(
  world: World,
  config: GroundConfig = DEFAULT_GROUND_CONFIG
): Entity[] {
  // Chrome Dino sprite sheet coordinates for ground
  const spriteSheetPath = 'assets/offline-sprite-1x.png';
  const groundSourceX = 2;
  const groundSourceY = 54;
  const groundSourceWidth = 1200;
  const groundSourceHeight = 14;

  // Create first ground segment
  const ground1 = world.createEntity();
  world.addComponent(ground1, new Position(0, config.y));
  world.addComponent(ground1, new Velocity(config.scrollSpeed, 0));
  world.addComponent(
    ground1,
    new Sprite(
      config.width,
      config.height,
      config.color,
      spriteSheetPath,
      groundSourceX,
      groundSourceY,
      groundSourceWidth,
      groundSourceHeight
    )
  );

  // Create second ground segment (positioned to the right)
  const ground2 = world.createEntity();
  world.addComponent(ground2, new Position(config.width, config.y));
  world.addComponent(ground2, new Velocity(config.scrollSpeed, 0));
  world.addComponent(
    ground2,
    new Sprite(
      config.width,
      config.height,
      config.color,
      spriteSheetPath,
      groundSourceX,
      groundSourceY,
      groundSourceWidth,
      groundSourceHeight
    )
  );

  return [ground1, ground2];
}

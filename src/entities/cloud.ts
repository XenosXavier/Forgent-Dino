/**
 * Cloud Entity Factory
 * Creates cloud entities with parallax scrolling behavior
 */

import type { World } from '../core/world';
import type { Entity } from '../core/entity';
import { Position } from '../components/position';
import { Velocity } from '../components/velocity';
import { Sprite } from '../components/sprite';

/**
 * Cloud configuration
 */
export interface CloudConfig {
  /**
   * Cloud width in pixels
   */
  width: number;

  /**
   * Cloud height in pixels
   */
  height: number;

  /**
   * Scroll speed in pixels per second (negative = left)
   * Default is 0.5x of ground speed for parallax effect
   */
  scrollSpeed: number;

  /**
   * Cloud color
   */
  color: string;

  /**
   * Canvas width (for spawn positioning)
   */
  canvasWidth: number;

  /**
   * Canvas height (for spawn positioning)
   */
  canvasHeight: number;
}

/**
 * Default cloud configuration
 * Clouds scroll at 0.5x ground speed for parallax depth effect
 */
export const DEFAULT_CLOUD_CONFIG: CloudConfig = {
  width: 46,
  height: 14,
  scrollSpeed: -100, // 0.5x of ground speed (-200)
  color: '#cccccc',
  canvasWidth: 600,
  canvasHeight: 150,
};

/**
 * Generate random Y position for cloud
 * Clouds appear in upper half of screen
 * @param canvasHeight Canvas height
 * @param cloudHeight Cloud height
 * @returns Random Y coordinate
 */
function getRandomCloudY(canvasHeight: number, cloudHeight: number): number {
  const minY = 20; // Minimum distance from top
  const maxY = canvasHeight / 2 - cloudHeight; // Upper half of screen
  return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
}

/**
 * Generate evenly distributed X positions for clouds
 * @param canvasWidth Canvas width
 * @param count Number of clouds
 * @returns Array of X coordinates
 */
function getCloudXPositions(canvasWidth: number, count: number): number[] {
  const positions: number[] = [];
  const spacing = canvasWidth / count;

  for (let i = 0; i < count; i++) {
    // Distribute clouds with some randomness
    const baseX = i * spacing;
    const randomOffset = Math.random() * spacing * 0.5;
    positions.push(Math.floor(baseX + randomOffset));
  }

  return positions;
}

/**
 * Create cloud entities with parallax scrolling behavior
 * Creates 3-5 cloud instances at random positions
 * Clouds scroll slower than ground for depth effect
 * Uses Chrome Dino sprite sheet for cloud texture
 * @param world Game world
 * @param config Cloud configuration
 * @param count Number of clouds to create (default: random 3-5)
 * @returns Array of cloud entity IDs
 */
export function createClouds(
  world: World,
  config: CloudConfig = DEFAULT_CLOUD_CONFIG,
  count?: number
): Entity[] {
  // Chrome Dino sprite sheet coordinates for cloud
  const spriteSheetPath = 'assets/offline-sprite-1x.png';
  const cloudSourceX = 86;
  const cloudSourceY = 2;
  const cloudSourceWidth = 46;
  const cloudSourceHeight = 14;

  // Random cloud count between 3-5 if not specified
  const cloudCount = count ?? Math.floor(Math.random() * 3) + 3;

  const clouds: Entity[] = [];
  const xPositions = getCloudXPositions(config.canvasWidth, cloudCount);

  for (let i = 0; i < cloudCount; i++) {
    const cloud = world.createEntity();
    const x = xPositions[i]!;
    const y = getRandomCloudY(config.canvasHeight, config.height);

    world.addComponent(cloud, new Position(x, y));
    world.addComponent(cloud, new Velocity(config.scrollSpeed, 0));
    world.addComponent(
      cloud,
      new Sprite(
        config.width,
        config.height,
        config.color,
        spriteSheetPath,
        cloudSourceX,
        cloudSourceY,
        cloudSourceWidth,
        cloudSourceHeight
      )
    );

    clouds.push(cloud);
  }

  return clouds;
}

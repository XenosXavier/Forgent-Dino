/**
 * Position Component - Stores 2D position coordinates
 * Pure data component in ECS architecture
 */

import type { Component } from '../core/Component';

/**
 * Position component stores entity's position in 2D space
 */
export class Position implements Component {
  /**
   * X coordinate in pixels
   */
  x: number;

  /**
   * Y coordinate in pixels
   */
  y: number;

  /**
   * Create a new Position component
   * @param x X coordinate (default: 0)
   * @param y Y coordinate (default: 0)
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

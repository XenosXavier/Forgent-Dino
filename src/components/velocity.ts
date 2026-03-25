/**
 * Velocity Component - Stores 2D velocity vector
 * Pure data component in ECS architecture
 */

import type { Component } from '../core/component';

/**
 * Velocity component stores entity's velocity in 2D space
 */
export class Velocity implements Component {
  /**
   * Velocity in X direction (pixels per second)
   */
  vx: number;

  /**
   * Velocity in Y direction (pixels per second)
   */
  vy: number;

  /**
   * Create a new Velocity component
   * @param vx X velocity in pixels/second (default: 0)
   * @param vy Y velocity in pixels/second (default: 0)
   */
  constructor(vx: number = 0, vy: number = 0) {
    this.vx = vx;
    this.vy = vy;
  }
}

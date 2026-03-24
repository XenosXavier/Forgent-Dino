/**
 * Sprite Component - Stores sprite rendering information
 * Pure data component in ECS architecture
 */

import type { Component } from '../core/Component';

/**
 * Sprite component stores rendering information for an entity
 * Supports both solid color fill and sprite sheet rendering
 */
export class Sprite implements Component {
  /**
   * Sprite width in pixels (destination size)
   */
  width: number;

  /**
   * Sprite height in pixels (destination size)
   */
  height: number;

  /**
   * Fill color for solid rendering (used when no image provided)
   */
  color: string;

  /**
   * Image path for sprite sheet rendering (optional)
   */
  imagePath?: string;

  /**
   * Source X coordinate in sprite sheet (optional)
   */
  sourceX?: number;

  /**
   * Source Y coordinate in sprite sheet (optional)
   */
  sourceY?: number;

  /**
   * Source width in sprite sheet (optional, defaults to width)
   */
  sourceWidth?: number;

  /**
   * Source height in sprite sheet (optional, defaults to height)
   */
  sourceHeight?: number;

  /**
   * Create a new Sprite component
   * @param width Sprite width in pixels
   * @param height Sprite height in pixels
   * @param color Fill color (default: '#000000')
   * @param imagePath Optional image path for sprite sheet
   * @param sourceX Optional source X in sprite sheet
   * @param sourceY Optional source Y in sprite sheet
   * @param sourceWidth Optional source width (defaults to width)
   * @param sourceHeight Optional source height (defaults to height)
   */
  constructor(
    width: number,
    height: number,
    color: string = '#000000',
    imagePath?: string,
    sourceX?: number,
    sourceY?: number,
    sourceWidth?: number,
    sourceHeight?: number
  ) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.imagePath = imagePath;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.sourceWidth = sourceWidth;
    this.sourceHeight = sourceHeight;
  }
}

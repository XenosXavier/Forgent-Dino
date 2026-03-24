/**
 * Core type definitions for Dino game
 */

/**
 * Canvas rendering context type
 */
export type CanvasContext = CanvasRenderingContext2D;

/**
 * Canvas dimensions (fixed size)
 */
export interface CanvasDimensions {
  width: number;
  height: number;
}

/**
 * Game constants
 */
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 150;

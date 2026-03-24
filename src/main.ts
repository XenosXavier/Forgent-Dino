/**
 * Dino Game - Main Entry Point
 * Chrome offline dinosaur game recreation
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, type CanvasContext } from './types';

/**
 * Initialize canvas and rendering context
 */
function initializeCanvas(): CanvasContext {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  // Verify canvas dimensions
  if (canvas.width !== CANVAS_WIDTH || canvas.height !== CANVAS_HEIGHT) {
    throw new Error(
      `Canvas dimensions must be ${CANVAS_WIDTH}x${CANVAS_HEIGHT}px`
    );
  }

  const ctx = canvas.getContext('2d', {
    alpha: false, // No transparency needed
    desynchronized: true, // Better performance
  });

  if (!ctx) {
    throw new Error('Failed to get 2D rendering context');
  }

  return ctx;
}

/**
 * Draw test rectangle to verify rendering
 */
function drawTestRectangle(ctx: CanvasContext): void {
  // Clear canvas with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw test rectangle
  ctx.fillStyle = '#535353';
  ctx.fillRect(250, 50, 100, 50);

  // Draw text
  ctx.fillStyle = '#000000';
  ctx.font = '16px monospace';
  ctx.fillText('Canvas Initialized', 220, 130);
}

/**
 * Main entry point
 */
function main(): void {
  console.log('Dino game initializing...');

  try {
    const ctx = initializeCanvas();
    drawTestRectangle(ctx);
    console.log('Canvas initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

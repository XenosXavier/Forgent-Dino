/**
 * Dino Game - Main Entry Point
 * Chrome offline dinosaur game recreation with ECS architecture
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, type CanvasContext } from './types';
import { Engine } from './core/Engine';
import { World } from './core/World';
import { RenderSystem } from './systems/RenderSystem';
import { MovementSystem } from './systems/MovementSystem';
import { ScrollSystem } from './systems/ScrollSystem';
import { createGround } from './entities/Ground';

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
 * Main entry point
 */
function main(): void {
  console.log('🎮 Dino game initializing with ECS architecture...');

  try {
    // Initialize canvas
    const ctx = initializeCanvas();

    // Create ECS world
    const world = new World();

    // Create engine with 60 FPS target
    const engine = new Engine(world, { targetFps: 60, maxDeltaTime: 0.1 });

    // Add systems in priority order
    // Higher priority = runs first
    engine.addSystem(new MovementSystem(100)); // Update positions first
    engine.addSystem(new ScrollSystem(CANVAS_WIDTH, 50)); // Handle scrolling
    engine.addSystem(new RenderSystem(ctx, -100)); // Render last

    // Create ground entities with infinite scrolling
    createGround(world);

    // Start game loop
    engine.start();

    console.log('✅ Game initialized successfully');
    console.log(`⚙️ Systems: ${engine.getSystems().length}`);
    console.log(`🌍 Entities: ${world.getEntities().size}`);
  } catch (error) {
    console.error('❌ Failed to initialize game:', error);
  }
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

/**
 * Engine - Game loop manager
 * Manages the main game loop using requestAnimationFrame
 */

import { World } from './World';

/**
 * Engine configuration options
 */
export interface EngineConfig {
  /**
   * Target frames per second (default: 60)
   */
  targetFps?: number;

  /**
   * Maximum delta time cap in seconds (default: 0.1)
   * Prevents spiral of death when tab is inactive
   */
  maxDeltaTime?: number;
}

/**
 * Engine class manages the game loop
 * Uses requestAnimationFrame for 60 FPS target
 */
export class Engine {
  private world: World;
  private running: boolean;
  private lastTime: number;
  private animationFrameId: number | null;
  private readonly maxDeltaTime: number;

  // Statistics
  private frameCount: number;
  private accumulatedTime: number;
  private currentFps: number;

  constructor(world: World, config: EngineConfig = {}) {
    this.world = world;
    this.running = false;
    this.lastTime = 0;
    this.animationFrameId = null;

    // Configuration
    this.maxDeltaTime = config.maxDeltaTime ?? 0.1; // 100ms cap

    // Statistics
    this.frameCount = 0;
    this.accumulatedTime = 0;
    this.currentFps = 0;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) {
      console.warn('Engine is already running');
      return;
    }

    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running) {
      console.warn('Engine is not running');
      return;
    }

    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Check if engine is running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Get current FPS
   */
  getFps(): number {
    return this.currentFps;
  }

  /**
   * Get reference to world
   */
  getWorld(): World {
    return this.world;
  }

  /**
   * Main game loop (called by requestAnimationFrame)
   * @param currentTime Current timestamp from requestAnimationFrame
   */
  private gameLoop = (currentTime: number): void => {
    if (!this.running) return;

    // Calculate delta time in seconds
    let deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death
    if (deltaTime > this.maxDeltaTime) {
      deltaTime = this.maxDeltaTime;
    }

    // Update FPS counter
    this.updateFpsCounter(deltaTime);

    // Update world (all systems)
    this.world.update(deltaTime);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  /**
   * Update FPS counter statistics
   * @param deltaTime Time since last frame
   */
  private updateFpsCounter(deltaTime: number): void {
    this.frameCount++;
    this.accumulatedTime += deltaTime;

    // Update FPS every second
    if (this.accumulatedTime >= 1.0) {
      this.currentFps = Math.round(this.frameCount / this.accumulatedTime);
      this.frameCount = 0;
      this.accumulatedTime = 0;
    }
  }
}

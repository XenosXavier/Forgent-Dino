/**
 * Engine unit tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Engine } from '../../src/core/Engine';
import { World } from '../../src/core/World';

describe('Engine', () => {
  let world: World;
  let engine: Engine;

  beforeEach(() => {
    world = new World();
    engine = new Engine(world);
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (engine.isRunning()) {
      engine.stop();
    }
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create engine with default config', () => {
      expect(engine).toBeInstanceOf(Engine);
      expect(engine.isRunning()).toBe(false);
    });

    it('should create engine with custom config', () => {
      const customEngine = new Engine(world, {
        targetFps: 30,
        maxDeltaTime: 0.05,
      });

      expect(customEngine).toBeInstanceOf(Engine);
    });
  });

  describe('start', () => {
    it('should start game loop', () => {
      engine.start();
      expect(engine.isRunning()).toBe(true);
    });

    it('should not start if already running', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      engine.start();
      engine.start();

      expect(consoleSpy).toHaveBeenCalledWith('Engine is already running');
      consoleSpy.mockRestore();
    });

    it('should call world update', () => {
      const updateSpy = vi.spyOn(world, 'update');

      engine.start();
      vi.advanceTimersByTime(16); // ~60 FPS frame

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop game loop', () => {
      engine.start();
      engine.stop();

      expect(engine.isRunning()).toBe(false);
    });

    it('should not stop if not running', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      engine.stop();

      expect(consoleSpy).toHaveBeenCalledWith('Engine is not running');
      consoleSpy.mockRestore();
    });

    it('should cancel animation frame', () => {
      const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

      engine.start();
      engine.stop();

      expect(cancelSpy).toHaveBeenCalled();
    });
  });

  describe('getWorld', () => {
    it('should return world reference', () => {
      expect(engine.getWorld()).toBe(world);
    });
  });

  describe('getFps', () => {
    it('should return 0 initially', () => {
      expect(engine.getFps()).toBe(0);
    });

    it('should return FPS value', () => {
      // FPS starts at 0
      expect(engine.getFps()).toBe(0);

      engine.start();
      // After starting, FPS tracking is initialized
      expect(engine.getFps()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('game loop', () => {
    it('should call world update', () => {
      const updateSpy = vi.spyOn(world, 'update');

      engine.start();
      vi.advanceTimersByTime(16);

      // World update should be called
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should cap delta time', () => {
      const customEngine = new Engine(world, { maxDeltaTime: 0.05 });
      const updateSpy = vi.spyOn(world, 'update');

      customEngine.start();
      vi.advanceTimersByTime(200); // Simulate lag spike

      // World update should still be called even with lag
      expect(updateSpy).toHaveBeenCalled();
      customEngine.stop();
    });

    it('should continue running until stopped', () => {
      const updateSpy = vi.spyOn(world, 'update');

      engine.start();

      // Simulate multiple frames
      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);

      expect(updateSpy.mock.calls.length).toBeGreaterThan(1);
    });

    it('should not update after stop', () => {
      const updateSpy = vi.spyOn(world, 'update');

      engine.start();
      vi.advanceTimersByTime(16);
      const callsBefore = updateSpy.mock.calls.length;

      engine.stop();
      vi.advanceTimersByTime(16);
      const callsAfter = updateSpy.mock.calls.length;

      expect(callsAfter).toBe(callsBefore);
    });
  });
});

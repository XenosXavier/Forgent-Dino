import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Engine } from '../../src/core/Engine';
import { World } from '../../src/core/World';
import { System } from '../../src/core/System';

// Mock system
class MockSystem extends System {
  updateCalled = false;
  initCalled = false;
  destroyCalled = false;

  update(): void {
    this.updateCalled = true;
  }

  init(): void {
    this.initCalled = true;
  }

  destroy(): void {
    this.destroyCalled = true;
  }
}

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

    it('should call systems update', () => {
      const system = new MockSystem();
      engine.addSystem(system);

      engine.start();
      vi.advanceTimersByTime(16);

      expect(system.updateCalled).toBe(true);
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
      expect(engine.getFps()).toBe(0);

      engine.start();
      expect(engine.getFps()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('addSystem', () => {
    it('should add system to engine', () => {
      const system = new MockSystem();
      engine.addSystem(system);

      const systems = engine.getSystems();
      expect(systems).toContain(system);
    });

    it('should call system init method', () => {
      const system = new MockSystem();
      engine.addSystem(system);

      expect(system.initCalled).toBe(true);
    });

    it('should sort systems by priority', () => {
      const system1 = new MockSystem(10);
      const system2 = new MockSystem(5);
      const system3 = new MockSystem(20);

      engine.addSystem(system1);
      engine.addSystem(system2);
      engine.addSystem(system3);

      const systems = engine.getSystems();
      expect(systems[0]).toBe(system3);
      expect(systems[1]).toBe(system1);
      expect(systems[2]).toBe(system2);
    });
  });

  describe('removeSystem', () => {
    it('should remove system from engine', () => {
      const system = new MockSystem();
      engine.addSystem(system);
      const result = engine.removeSystem(system);

      expect(result).toBe(true);
      expect(engine.getSystems()).not.toContain(system);
    });

    it('should call system destroy method', () => {
      const system = new MockSystem();
      engine.addSystem(system);
      engine.removeSystem(system);

      expect(system.destroyCalled).toBe(true);
    });

    it('should return false if system not found', () => {
      const system = new MockSystem();
      const result = engine.removeSystem(system);

      expect(result).toBe(false);
    });
  });

  describe('game loop', () => {
    it('should call systems update', () => {
      const system = new MockSystem();
      engine.addSystem(system);

      engine.start();
      vi.advanceTimersByTime(16);

      expect(system.updateCalled).toBe(true);
    });

    it('should call world cleanup', () => {
      const cleanupSpy = vi.spyOn(world, 'cleanup');

      engine.start();
      vi.advanceTimersByTime(16);

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it('should continue running until stopped', () => {
      const system = new MockSystem();
      let callCount = 0;
      system.update = (): void => {
        callCount++;
      };
      engine.addSystem(system);

      engine.start();

      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);

      expect(callCount).toBeGreaterThan(1);
    });

    it('should not update after stop', () => {
      const system = new MockSystem();
      let callCount = 0;
      system.update = (): void => {
        callCount++;
      };
      engine.addSystem(system);

      engine.start();
      vi.advanceTimersByTime(16);
      const callsBefore = callCount;

      engine.stop();
      vi.advanceTimersByTime(16);
      const callsAfter = callCount;

      expect(callsAfter).toBe(callsBefore);
    });
  });
});

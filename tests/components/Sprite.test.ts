import { describe, it, expect } from 'vitest';
import { Sprite } from '../../src/components/sprite';

describe('Sprite Component', () => {
  describe('constructor', () => {
    it('should create sprite with specified dimensions and default color', () => {
      const sprite = new Sprite(50, 100);

      expect(sprite.width).toBe(50);
      expect(sprite.height).toBe(100);
      expect(sprite.color).toBe('#000000');
    });

    it('should create sprite with specified dimensions and color', () => {
      const sprite = new Sprite(64, 64, '#FF0000');

      expect(sprite.width).toBe(64);
      expect(sprite.height).toBe(64);
      expect(sprite.color).toBe('#FF0000');
    });

    it('should handle different color formats', () => {
      const sprite1 = new Sprite(32, 32, 'red');
      const sprite2 = new Sprite(32, 32, 'rgb(255, 0, 0)');
      const sprite3 = new Sprite(32, 32, '#F00');

      expect(sprite1.color).toBe('red');
      expect(sprite2.color).toBe('rgb(255, 0, 0)');
      expect(sprite3.color).toBe('#F00');
    });

    it('should handle floating point dimensions', () => {
      const sprite = new Sprite(10.5, 20.7, '#00FF00');

      expect(sprite.width).toBe(10.5);
      expect(sprite.height).toBe(20.7);
    });
  });

  describe('mutation', () => {
    it('should allow sprite properties modification', () => {
      const sprite = new Sprite(100, 100, '#000000');

      sprite.width = 200;
      sprite.height = 150;
      sprite.color = '#FFFFFF';

      expect(sprite.width).toBe(200);
      expect(sprite.height).toBe(150);
      expect(sprite.color).toBe('#FFFFFF');
    });
  });
});

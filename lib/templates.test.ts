import { describe, it, expect } from 'vitest';
import { escapeStr, escapeHtmlAttr } from './templates';

describe('String Escaping Helpers', () => {
  describe('escapeStr', () => {
    it('returns the same string if there are no single quotes', () => {
      expect(escapeStr('hello world')).toBe('hello world');
      expect(escapeStr('double "quotes" are fine')).toBe('double "quotes" are fine');
    });

    it('escapes a single quote', () => {
      expect(escapeStr("it's a beautiful day")).toBe("it\\'s a beautiful day");
    });

    it('escapes multiple single quotes', () => {
      expect(escapeStr("you're going to love what's next")).toBe("you\\'re going to love what\\'s next");
      expect(escapeStr("'''")).toBe("\\'\\'\\'");
    });

    it('handles empty strings', () => {
      expect(escapeStr('')).toBe('');
    });
  });

  describe('escapeHtmlAttr', () => {
    it('returns the same string if there are no double quotes', () => {
      expect(escapeHtmlAttr('hello world')).toBe('hello world');
      expect(escapeHtmlAttr("single 'quotes' are fine")).toBe("single 'quotes' are fine");
    });

    it('escapes a single double quote', () => {
      expect(escapeHtmlAttr('He said "hello')).toBe('He said &quot;hello');
    });

    it('escapes multiple double quotes', () => {
      expect(escapeHtmlAttr('class="btn" id="main"')).toBe('class=&quot;btn&quot; id=&quot;main&quot;');
      expect(escapeHtmlAttr('"""')).toBe('&quot;&quot;&quot;');
    });

    it('handles empty strings', () => {
      expect(escapeHtmlAttr('')).toBe('');
    });
  });
});

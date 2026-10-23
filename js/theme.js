/**
 * theme.js - Gestor de Temas (Claro, Oscuro, Auto) y Paleta Circular Universal
 */
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('daycounter_theme') || 'auto';
    this.currentColor = localStorage.getItem('daycounter_color') || 'default';
    this.reducedMotion = localStorage.getItem('daycounter_motion') === 'reduce';
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.applyColor(this.currentColor);
    this.applyMotion(this.reducedMotion);

    // Escuchar cambio de tema del sistema operativo
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('daycounter_theme', theme);

    let active = theme;
    if (theme === 'auto') {
      active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', active);

    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-btn') === theme);
    });
  }

  applyColor(color) {
    this.currentColor = color;
    localStorage.setItem('daycounter_color', color);

    const hexInput = document.getElementById('hexColorInput');
    const colorInput = document.getElementById('customColorInput');
    const previewCircle = document.getElementById('colorWheelPreview');

    // Desactivar o activar swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.classList.toggle('active', swatch.getAttribute('data-color') === color);
    });

    if (color === 'default' || !color) {
      document.documentElement.style.removeProperty('--app-primary');
      document.documentElement.style.removeProperty('--app-primary-hover');
      document.documentElement.style.removeProperty('--app-primary-soft');
      document.documentElement.style.removeProperty('--app-primary-soft-border');
      
      // EL TEXTO NUNCA SE SOBREESCRIBE
      document.documentElement.style.removeProperty('--app-text');

      if (hexInput) hexInput.value = '#6D28D9';
      if (colorInput) colorInput.value = '#6d28d9';
      if (previewCircle) previewCircle.style.background = '#6d28d9';
    } else {
      // Garantizar que --app-text queda intacto
      document.documentElement.style.removeProperty('--app-text');

      document.documentElement.style.setProperty('--app-primary', color);
      document.documentElement.style.setProperty('--app-primary-hover', color);
      document.documentElement.style.setProperty('--app-primary-soft', color + '22');
      document.documentElement.style.setProperty('--app-primary-soft-border', color + '44');

      if (hexInput) hexInput.value = color.toUpperCase();
      if (previewCircle) previewCircle.style.background = color;
      if (colorInput && /^#[0-9A-Fa-f]{6}$/.test(color)) {
        colorInput.value = color;
      }
    }
  }

  applyMotion(reduce) {
    this.reducedMotion = Boolean(reduce);
    localStorage.setItem('daycounter_motion', this.reducedMotion ? 'reduce' : 'normal');
    document.documentElement.classList.toggle('reduce-motion', this.reducedMotion);
  }
}

window.themeManager = new ThemeManager();

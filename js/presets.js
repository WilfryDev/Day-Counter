/**
 * presets.js - Gestor de Eventos y Presets Predefinidos y Personalizados
 */
class PresetManager {
  constructor() {
    this.customKey = 'daycounter_custom_presets';
  }

  getStandardPresets() {
    const today = new Date();
    const curYear = today.getFullYear();
    const todayStr = TimeCalculator.formatDate(today);

    return [
      {
        id: "newyear",
        name: "Año Nuevo",
        icon: "🎆",
        getDates: () => {
          const nextYear = curYear + 1;
          return { start: todayStr, end: `${nextYear}-01-01`, label: `Hasta el 1 de Enero de ${nextYear}` };
        }
      },
      {
        id: "christmas",
        name: "Navidad",
        icon: "🎄",
        getDates: () => {
          let targetYear = curYear;
          const xDate = new Date(curYear, 11, 25);
          if (today > xDate) targetYear++;
          return { start: todayStr, end: `${targetYear}-12-25`, label: `Hasta el 25 de Diciembre` };
        }
      },
      {
        id: "yearstart",
        name: "Inicio de Este Año",
        icon: "📅",
        getDates: () => {
          return { start: `${curYear}-01-01`, end: todayStr, label: `Desde el 1 de Enero de ${curYear}` };
        }
      },
      {
        id: "yearend",
        name: "Fin de Año",
        icon: "🏁",
        getDates: () => {
          return { start: todayStr, end: `${curYear}-12-31`, label: `Hasta el 31 de Diciembre` };
        }
      },
      {
        id: "30daysago",
        name: "Hace 30 Días",
        icon: "⏳",
        getDates: () => {
          const past = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
          return { start: TimeCalculator.formatDate(past), end: todayStr, label: "Últimos 30 días" };
        }
      },
      {
        id: "100daysago",
        name: "Hace 100 Días",
        icon: "⏮️",
        getDates: () => {
          const past = new Date(today.getTime() - (100 * 24 * 60 * 60 * 1000));
          return { start: TimeCalculator.formatDate(past), end: todayStr, label: "100 días atrás" };
        }
      },
      {
        id: "100daysnext",
        name: "En 100 Días",
        icon: "⏭️",
        getDates: () => {
          const future = new Date(today.getTime() + (100 * 24 * 60 * 60 * 1000));
          return { start: todayStr, end: TimeCalculator.formatDate(future), label: "100 días al futuro" };
        }
      },
      {
        id: "valentine",
        name: "San Valentín",
        icon: "💘",
        getDates: () => {
          let targetYear = curYear;
          const vDate = new Date(curYear, 1, 14);
          if (today > vDate) targetYear++;
          return { start: todayStr, end: `${targetYear}-02-14`, label: "14 de Febrero" };
        }
      },
      {
        id: "halloween",
        name: "Halloween",
        icon: "🎃",
        getDates: () => {
          let targetYear = curYear;
          const hDate = new Date(curYear, 9, 31);
          if (today > hDate) targetYear++;
          return { start: todayStr, end: `${targetYear}-10-31`, label: "31 de Octubre" };
        }
      }
    ];
  }

  getCustomPresets() {
    try {
      return JSON.parse(localStorage.getItem(this.customKey) || '[]');
    } catch (e) {
      return [];
    }
  }

  saveCustomPreset(name, start, end) {
    if (!name || !start || !end) return false;
    const presets = this.getCustomPresets();
    presets.push({
      id: "custom_" + Date.now(),
      name: name.trim(),
      start,
      end,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(this.customKey, JSON.stringify(presets));
    return true;
  }

  deleteCustomPreset(id) {
    let presets = this.getCustomPresets();
    presets = presets.filter(p => p.id !== id);
    localStorage.setItem(this.customKey, JSON.stringify(presets));
  }
}

window.presetManager = new PresetManager();

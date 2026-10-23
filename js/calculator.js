/**
 * calculator.js - Motor matemático de cálculo cronológico y precisión temporal
 */
class TimeCalculator {
  static formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  static parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) {
      return null;
    }
    return date;
  }

  /**
   * Cuenta la cantidad de días hábiles (Lunes a Viernes) entre dos fechas
   */
  static countBusinessDays(startDate, endDate, includeStart = true) {
    let start = new Date(startDate.getTime());
    let end = new Date(endDate.getTime());
    let isNegative = false;

    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
      isNegative = true;
    }

    let count = 0;
    let cur = new Date(start.getTime());

    // Si no incluye el día inicial, avanzamos 1 día
    if (!includeStart) {
      cur.setDate(cur.getDate() + 1);
    }

    while (cur <= end) {
      const dayOfWeek = cur.getDay(); // 0: Dom, 6: Sáb
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return isNegative ? -count : count;
  }

  /**
   * Calcula la diferencia completa entre dos fechas
   */
  static calculateDifference(startStr, endStr, options = {}) {
    const { includeStart = true, onlyBusinessDays = false } = options;
    const startDate = this.parseDate(startStr);
    const endDate = this.parseDate(endStr);

    if (!startDate || !endDate) {
      return { valid: false, error: "invalid_date" };
    }

    // Diferencia básica en milisegundos
    const diffTime = endDate.getTime() - startDate.getTime();
    let totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let displayDays = 0;
    let isSameDay = totalDays === 0;
    let isFuture = totalDays < 0; // La fecha final es menor que la inicial

    if (onlyBusinessDays) {
      displayDays = this.countBusinessDays(startDate, endDate, includeStart);
      isFuture = displayDays < 0;
    } else {
      if (isSameDay) {
        displayDays = includeStart ? 1 : 0;
      } else if (isFuture) {
        displayDays = Math.abs(totalDays);
      } else {
        displayDays = includeStart ? totalDays + 1 : totalDays;
      }
    }

    const absDays = Math.abs(displayDays);
    const weeks = (absDays / 7).toFixed(1);
    const fullWeeks = Math.floor(absDays / 7);
    const remainingDays = absDays % 7;
    const approxMonths = (absDays / 30.4375).toFixed(1);
    const totalHours = absDays * 24;
    const totalMinutes = absDays * 24 * 60;

    return {
      valid: true,
      startDate: startStr,
      endDate: endStr,
      includeStart,
      onlyBusinessDays,
      isSameDay,
      isFuture,
      days: displayDays,
      absDays,
      breakdown: {
        weeks,
        fullWeeks,
        remainingDays,
        approxMonths,
        hours: totalHours,
        minutes: totalMinutes
      }
    };
  }

  /**
   * Sumar o restar días a una fecha determinada
   */
  static addOrSubtractDays(dateStr, daysToAdd) {
    const d = this.parseDate(dateStr);
    if (!d) return null;
    d.setDate(d.getDate() + parseInt(daysToAdd, 10));
    return this.formatDate(d);
  }

  /**
   * Obtiene el porcentaje de avance del año en curso
   */
  static getYearProgress() {
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const elapsed = now.getTime() - start.getTime();
    const total = end.getTime() - start.getTime();
    const percentage = ((elapsed / total) * 100).toFixed(1);
    const remainingDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      year,
      percentage: Math.min(100, Math.max(0, parseFloat(percentage))),
      remainingDays
    };
  }
}

// Exponer motor global API
window.ContadorAPI = {
  calculate(start, end, include = true, businessDays = false) {
    return TimeCalculator.calculateDifference(start, end, {
      includeStart: include,
      onlyBusinessDays: businessDays
    });
  },
  addDays(date, days) {
    return TimeCalculator.addOrSubtractDays(date, days);
  },
  yearProgress() {
    return TimeCalculator.getYearProgress();
  }
};

window.TimeCalculator = TimeCalculator;

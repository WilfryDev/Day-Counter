document.addEventListener('DOMContentLoaded', () => {
  window.themeManager.init();
  window.I18N.updateDOM();

  let today = new Date();
  let selectedMonth = today.getMonth();
  let selectedYear = today.getFullYear();
  let viewYear = selectedYear;

  const mpTrigger = document.getElementById('mpTrigger');
  const mpPopover = document.getElementById('mpPopover');
  const mpValue = document.getElementById('mpValue');
  const mpGrid = document.getElementById('mpGrid');
  const mpYearLabel = document.getElementById('mpYear');
  const mpPrev = document.getElementById('mpPrev');
  const mpNext = document.getElementById('mpNext');
  const dayInput = document.getElementById('initialDay');

  const customCalContainer = document.getElementById('customCalContainer');
  const customCalTrigger = document.getElementById('customCalTrigger');
  const customCalValue = document.getElementById('customCalValue');
  const finalDateInput = document.getElementById('finalDate');
  const customCalPopover = document.getElementById('customCalPopover');
  const calMonthYearTitle = document.getElementById('calMonthYearTitle');
  const calPrevMonth = document.getElementById('calPrevMonth');
  const calNextMonth = document.getElementById('calNextMonth');
  const calWeekdaysRow = document.getElementById('calWeekdays');
  const calDaysGrid = document.getElementById('calDaysGrid');
  const calBtnClear = document.getElementById('calBtnClear');
  const calBtnToday = document.getElementById('calBtnToday');

  const includeCheck = document.getElementById('includeStartDay');
  const businessDaysCheck = document.getElementById('onlyBusinessDays');
  const resultNumber = document.getElementById('resultNumber');
  const resultLabel = document.getElementById('resultLabel');
  const resultHint = document.getElementById('resultHint');
  const resultStatusPill = document.getElementById('resultStatusPill');

  const breakdownRow = document.getElementById('breakdownRow');
  const bdWeeks = document.getElementById('bdWeeks');
  const bdMonths = document.getElementById('bdMonths');
  const bdHours = document.getElementById('bdHours');

  let calSelectedDate = new Date(today.getTime());
  let calViewMonth = calSelectedDate.getMonth();
  let calViewYear = calSelectedDate.getFullYear();

  function formatDisplayDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }

  finalDateInput.value = TimeCalculator.formatDate(today);
  if (customCalValue) customCalValue.textContent = formatDisplayDate(today);
  dayInput.value = today.getDate();

  function renderMonthPicker() {
    const lang = I18N.getCurrentLang();
    const months = I18N.translations[lang].months;
    const monthsShort = I18N.translations[lang].monthsShort;

    mpValue.textContent = `${months[selectedMonth]} ${selectedYear}`;
    mpYearLabel.textContent = viewYear;
    mpGrid.innerHTML = '';

    monthsShort.forEach((m, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'month-btn';
      btn.textContent = m;
      if (idx === selectedMonth && viewYear === selectedYear) btn.classList.add('selected');
      if (idx === today.getMonth() && viewYear === today.getFullYear()) btn.classList.add('current');

      btn.onclick = () => {
        window.soundEngine.playPop();
        selectedMonth = idx;
        selectedYear = viewYear;
        mpPopover.hidden = true;
        mpTrigger.classList.remove('open');
        renderMonthPicker();
        calculate();
      };
      mpGrid.appendChild(btn);
    });
  }

  mpTrigger.onclick = (e) => {
    e.stopPropagation();
    window.soundEngine.playClick();
    if (mpPopover.hidden) {
      viewYear = selectedYear;
      renderMonthPicker();
      mpPopover.hidden = false;
      mpTrigger.classList.add('open');
      if (customCalPopover) {
        customCalPopover.hidden = true;
        customCalTrigger.classList.remove('open');
      }
    } else {
      mpPopover.hidden = true;
      mpTrigger.classList.remove('open');
    }
  };

  mpPrev.onclick = (e) => {
    e.stopPropagation();
    window.soundEngine.playClick();
    viewYear--;
    renderMonthPicker();
  };

  mpNext.onclick = (e) => {
    e.stopPropagation();
    window.soundEngine.playClick();
    viewYear++;
    renderMonthPicker();
  };

  const weekdaysByLang = {
    es: ["L", "M", "X", "J", "V", "S", "D"],
    en: ["M", "T", "W", "T", "F", "S", "S"],
    fr: ["L", "M", "M", "J", "V", "S", "D"],
    de: ["M", "D", "M", "D", "F", "S", "S"],
    pt: ["S", "T", "Q", "Q", "S", "S", "D"],
    it: ["L", "M", "M", "G", "V", "S", "D"]
  };

  function renderCustomCalendar() {
    if (!customCalPopover) return;
    const lang = I18N.getCurrentLang();
    const months = I18N.translations[lang].months;
    const weekdays = weekdaysByLang[lang] || weekdaysByLang.es;

    calMonthYearTitle.textContent = `${months[calViewMonth]} de ${calViewYear}`;

    calWeekdaysRow.innerHTML = '';
    weekdays.forEach(wd => {
      const sp = document.createElement('span');
      sp.textContent = wd;
      calWeekdaysRow.appendChild(sp);
    });

    calDaysGrid.innerHTML = '';

    const firstDayIndex = (new Date(calViewYear, calViewMonth, 1).getDay() + 6) % 7;
    const daysInCurrentMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calViewYear, calViewMonth, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDayNum = daysInPrevMonth - i;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn other-month';
      btn.textContent = prevDayNum;
      btn.onclick = () => {
        window.soundEngine.playClick();
        if (calViewMonth === 0) {
          calViewMonth = 11;
          calViewYear--;
        } else {
          calViewMonth--;
        }
        selectCustomDate(new Date(calViewYear, calViewMonth, prevDayNum));
      };
      calDaysGrid.appendChild(btn);
    }

    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn';
      btn.textContent = day;

      const isToday = (day === today.getDate() && calViewMonth === today.getMonth() && calViewYear === today.getFullYear());
      const isSelected = (day === calSelectedDate.getDate() && calViewMonth === calSelectedDate.getMonth() && calViewYear === calSelectedDate.getFullYear());

      if (isToday) btn.classList.add('today');
      if (isSelected) btn.classList.add('selected');

      btn.onclick = () => {
        window.soundEngine.playPop();
        selectCustomDate(new Date(calViewYear, calViewMonth, day));
      };
      calDaysGrid.appendChild(btn);
    }

    const totalSlots = firstDayIndex + daysInCurrentMonth;
    const nextDaysNeeded = (7 - (totalSlots % 7)) % 7;
    for (let nextDay = 1; nextDay <= nextDaysNeeded; nextDay++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day-btn other-month';
      btn.textContent = nextDay;
      btn.onclick = () => {
        window.soundEngine.playClick();
        if (calViewMonth === 11) {
          calViewMonth = 0;
          calViewYear++;
        } else {
          calViewMonth++;
        }
        selectCustomDate(new Date(calViewYear, calViewMonth, nextDay));
      };
      calDaysGrid.appendChild(btn);
    }
  }

  function selectCustomDate(date) {
    calSelectedDate = new Date(date.getTime());
    calViewMonth = calSelectedDate.getMonth();
    calViewYear = calSelectedDate.getFullYear();

    finalDateInput.value = TimeCalculator.formatDate(calSelectedDate);
    if (customCalValue) customCalValue.textContent = formatDisplayDate(calSelectedDate);

    customCalPopover.hidden = true;
    customCalTrigger.classList.remove('open');
    calculate();
  }

  if (customCalTrigger) {
    customCalTrigger.onclick = (e) => {
      e.stopPropagation();
      window.soundEngine.playClick();
      if (customCalPopover.hidden) {
        calViewMonth = calSelectedDate.getMonth();
        calViewYear = calSelectedDate.getFullYear();
        renderCustomCalendar();
        customCalPopover.hidden = false;
        customCalTrigger.classList.add('open');
        if (mpPopover) {
          mpPopover.hidden = true;
          mpTrigger.classList.remove('open');
        }
      } else {
        customCalPopover.hidden = true;
        customCalTrigger.classList.remove('open');
      }
    };
  }

  if (calPrevMonth) {
    calPrevMonth.onclick = (e) => {
      e.stopPropagation();
      window.soundEngine.playClick();
      if (calViewMonth === 0) {
        calViewMonth = 11;
        calViewYear--;
      } else {
        calViewMonth--;
      }
      renderCustomCalendar();
    };
  }

  if (calNextMonth) {
    calNextMonth.onclick = (e) => {
      e.stopPropagation();
      window.soundEngine.playClick();
      if (calViewMonth === 11) {
        calViewMonth = 0;
        calViewYear++;
      } else {
        calViewMonth++;
      }
      renderCustomCalendar();
    };
  }

  if (calBtnToday) {
    calBtnToday.onclick = (e) => {
      e.stopPropagation();
      window.soundEngine.playSuccess();
      selectCustomDate(new Date());
    };
  }

  if (calBtnClear) {
    calBtnClear.onclick = (e) => {
      e.stopPropagation();
      window.soundEngine.playClick();
      selectCustomDate(new Date());
    };
  }

  document.addEventListener('click', (e) => {
    if (mpContainer && !mpContainer.contains(e.target)) {
      mpPopover.hidden = true;
      mpTrigger.classList.remove('open');
    }
    if (customCalContainer && !customCalContainer.contains(e.target)) {
      customCalPopover.hidden = true;
      customCalTrigger.classList.remove('open');
    }
  });

  function calculate() {
    const dayVal = parseInt(dayInput.value, 10);
    const lang = I18N.getCurrentLang();

    if (!dayVal || dayVal < 1 || dayVal > 31) {
      resultNumber.textContent = '0';
      resultLabel.textContent = I18N.t('daysPassed');
      resultHint.textContent = I18N.t('hint');
      resultStatusPill.textContent = I18N.t('waitingDay');
      breakdownRow.style.display = 'none';
      return;
    }

    const startStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayVal).padStart(2, '0')}`;
    const endStr = finalDateInput.value;

    const res = TimeCalculator.calculateDifference(startStr, endStr, {
      includeStart: includeCheck.checked,
      onlyBusinessDays: businessDaysCheck ? businessDaysCheck.checked : false
    });

    if (!res.valid) {
      resultNumber.textContent = '0';
      resultHint.textContent = I18N.t('invalid');
      resultStatusPill.textContent = "Error";
      breakdownRow.style.display = 'none';
      return;
    }

    resultNumber.textContent = res.days;

    if (res.isSameDay) {
      resultStatusPill.textContent = I18N.t('todayPill');
      resultLabel.textContent = res.days === 1 ? `1 ${I18N.t('day')}` : I18N.t('sameDay');
      resultHint.textContent = I18N.t('includeDay');
    } else if (res.isFuture) {
      resultStatusPill.textContent = I18N.t('futurePill');
      resultLabel.textContent = businessDaysCheck && businessDaysCheck.checked
        ? I18N.t('businessDaysRemaining')
        : I18N.t('daysRemaining');
      resultHint.textContent = `${res.absDays} ${I18N.t('daysRemaining')}`;
    } else {
      resultStatusPill.textContent = I18N.t('pastPill');
      resultLabel.textContent = businessDaysCheck && businessDaysCheck.checked
        ? I18N.t('businessDaysPassed')
        : I18N.t('daysPassed');
      resultHint.textContent = `${res.absDays} ${I18N.t('daysPassed')}`;
    }

    breakdownRow.style.display = 'flex';
    bdWeeks.textContent = res.breakdown.weeks;
    bdMonths.textContent = res.breakdown.approxMonths;
    bdHours.textContent = res.breakdown.hours.toLocaleString();

    if (res.days === 0 || res.days === 100) {
      window.soundEngine.playFanfare();
    }
  }

  dayInput.addEventListener('input', () => {
    calculate();
  });

  includeCheck.addEventListener('change', () => {
    window.soundEngine.playPop();
    calculate();
  });

  if (businessDaysCheck) {
    businessDaysCheck.addEventListener('change', () => {
      window.soundEngine.playPop();
      calculate();
    });
  }

  document.getElementById('setStartToday').onclick = () => {
    window.soundEngine.playClick();
    const now = new Date();
    selectedYear = now.getFullYear();
    selectedMonth = now.getMonth();
    dayInput.value = now.getDate();
    renderMonthPicker();
    calculate();
  };

  document.getElementById('setEndToday').onclick = () => {
    window.soundEngine.playClick();
    selectCustomDate(new Date());
  };

  function updateYearProgress() {
    const prog = TimeCalculator.getYearProgress();
    const fill = document.getElementById('yearProgressFill');
    const label = document.getElementById('yearProgressText');
    if (fill) fill.style.width = `${prog.percentage}%`;
    if (label) {
      label.textContent = `${prog.year}: ${prog.percentage}% completado (${prog.remainingDays} días restantes)`;
    }
  }
  updateYearProgress();

  function applyPreset(start, end) {
    window.soundEngine.playSuccess();
    const [sY, sM, sD] = start.split('-').map(Number);
    selectedYear = sY;
    selectedMonth = sM - 1;
    dayInput.value = sD;

    const [eY, eM, eD] = end.split('-').map(Number);
    selectCustomDate(new Date(eY, eM - 1, eD));

    renderMonthPicker();
    calculate();
    showToast("Preset aplicado con éxito");
  }

  function renderPresets() {
    const strip = document.getElementById('quickPresetsBar');
    const modalList = document.getElementById('standardPresetsList');
    const std = window.presetManager.getStandardPresets();

    if (strip) {
      strip.innerHTML = '';
      std.slice(0, 5).forEach(p => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'preset-chip';
        chip.innerHTML = `${p.icon} <span>${p.name}</span>`;
        chip.onclick = () => {
          const d = p.getDates();
          applyPreset(d.start, d.end);
        };
        strip.appendChild(chip);
      });

      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'preset-chip more-btn';
      more.innerHTML = `➕ <span>${I18N.t('presets')}</span>`;
      more.onclick = () => {
        window.soundEngine.playClick();
        document.getElementById('presetsModal').hidden = false;
      };
      strip.appendChild(more);
    }

    if (modalList) {
      modalList.innerHTML = '';
      std.forEach(p => {
        const d = p.getDates();
        const item = document.createElement('div');
        item.className = 'preset-list-item';
        item.innerHTML = `
          <div class="preset-item-info">
            <span class="preset-item-icon">${p.icon}</span>
            <div>
              <div class="preset-item-name">${p.name}</div>
              <div class="preset-item-date">${d.label}</div>
            </div>
          </div>
          <span class="preset-item-badge">${I18N.t('apply')}</span>
        `;
        item.onclick = () => {
          applyPreset(d.start, d.end);
          document.getElementById('presetsModal').hidden = true;
        };
        modalList.appendChild(item);
      });
    }

    renderCustomPresetsList();
  }

  function renderCustomPresetsList() {
    const container = document.getElementById('customPresetsList');
    if (!container) return;
    const customs = window.presetManager.getCustomPresets();

    if (customs.length === 0) {
      container.innerHTML = `<div style="font-size:13px; color:var(--text-muted); padding:8px 0;">${I18N.t('noCustomPresets')}</div>`;
      return;
    }

    container.innerHTML = '';
    customs.forEach(cp => {
      const item = document.createElement('div');
      item.className = 'preset-list-item';
      item.innerHTML = `
        <div class="preset-item-info">
          <span class="preset-item-icon">⭐</span>
          <div>
            <div class="preset-item-name">${cp.name}</div>
            <div class="preset-item-date">${cp.start} ➔ ${cp.end}</div>
          </div>
        </div>
        <button type="button" class="preset-delete-btn" title="${I18N.t('delete')}" style="background:none; border:none; cursor:pointer;">🗑️</button>
      `;
      item.onclick = () => {
        applyPreset(cp.start, cp.end);
        document.getElementById('presetsModal').hidden = true;
      };
      const delBtn = item.querySelector('.preset-delete-btn');
      delBtn.onclick = (e) => {
        e.stopPropagation();
        window.soundEngine.playClick();
        window.presetManager.deleteCustomPreset(cp.id);
        renderCustomPresetsList();
        showToast("Preset eliminado");
      };
      container.appendChild(item);
    });
  }

  const savePresetBtn = document.getElementById('saveCustomPresetBtn');
  if (savePresetBtn) {
    savePresetBtn.onclick = () => {
      window.soundEngine.playPop();
      const input = document.getElementById('newPresetName');
      const name = input.value.trim();
      if (!name) {
        showToast("Ingresa un nombre para el preset");
        return;
      }
      const dayVal = dayInput.value || 1;
      const startStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayVal).padStart(2, '0')}`;
      const endStr = finalDateInput.value;

      window.presetManager.saveCustomPreset(name, startStr, endStr);
      input.value = '';
      renderCustomPresetsList();
      showToast("¡Preset guardado!");
    };
  }

  const bindModal = (openBtnId, modalId, closeBtnId) => {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (openBtn && modal) {
      openBtn.onclick = () => {
        window.soundEngine.playClick();
        modal.hidden = false;
      };
    }
    if (closeBtn && modal) {
      closeBtn.onclick = () => {
        window.soundEngine.playClick();
        modal.hidden = true;
      };
    }
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.hidden = true;
      };
    }
  };

  bindModal('settingsBtn', 'settingsModal', 'closeSettings');
  bindModal('openPresetsNav', 'presetsModal', 'closePresets');
  bindModal('footerOpenPresets', 'presetsModal', 'closePresets');
  bindModal('openGuideNav', 'guideModal', 'closeGuide');
  bindModal('footerOpenGuide', 'guideModal', 'closeGuide');
  bindModal('footerOpenTos', 'tosModal', 'closeTos');

  document.querySelectorAll('.lang-select-input').forEach(sel => {
    sel.addEventListener('change', (e) => {
      window.soundEngine.playPop();
      window.I18N.setLanguage(e.target.value);
      renderMonthPicker();
      renderCustomCalendar();
      calculate();
      renderPresets();
      updateYearProgress();
    });
  });

  window.onLanguageChanged = () => {
    renderMonthPicker();
    renderCustomCalendar();
    calculate();
    renderPresets();
    updateYearProgress();
  };

  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.onclick = () => {
      window.soundEngine.playClick();
      window.themeManager.applyTheme(btn.getAttribute('data-theme-btn'));
    };
  });

  const customColorInput = document.getElementById('customColorInput');
  const hexColorInput = document.getElementById('hexColorInput');

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      window.themeManager.applyColor(e.target.value);
    });
  }

  if (hexColorInput) {
    hexColorInput.addEventListener('change', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        window.themeManager.applyColor(val);
      }
    });
  }

  document.getElementById('resetColorDefault').onclick = () => {
    window.soundEngine.playClick();
    window.themeManager.applyColor('default');
  };

  document.querySelectorAll('.color-swatch').forEach(sw => {
    sw.onclick = () => {
      window.soundEngine.playClick();
      window.themeManager.applyColor(sw.getAttribute('data-color'));
    };
  });

  const soundToggle = document.getElementById('soundToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const testSoundBtn = document.getElementById('testSoundBtn');

  if (soundToggle) {
    soundToggle.checked = window.soundEngine.enabled;
    soundToggle.addEventListener('change', (e) => {
      window.soundEngine.setEnabled(e.target.checked);
      if (e.target.checked) window.soundEngine.playSuccess();
    });
  }

  if (volumeSlider) {
    volumeSlider.value = window.soundEngine.volume;
    volumeSlider.addEventListener('input', (e) => {
      window.soundEngine.setVolume(e.target.value);
    });
  }

  if (testSoundBtn) {
    testSoundBtn.onclick = () => {
      window.soundEngine.playFanfare();
    };
  }

  function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    const text = document.getElementById('toastText');
    if (toast && text) {
      text.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    }
  }

  document.getElementById('copyResultBtn').onclick = () => {
    window.soundEngine.playSuccess();
    const dayVal = dayInput.value || 1;
    const startStr = `${dayVal}/${selectedMonth + 1}/${selectedYear}`;
    const endStr = customCalValue ? customCalValue.textContent : finalDateInput.value;
    const resText = `⏳ Contador de Días: ${resultNumber.textContent} ${resultLabel.textContent} (Desde ${startStr} hasta ${endStr})`;
    
    navigator.clipboard.writeText(resText).then(() => {
      showToast("¡Resultado copiado al portapapeles!");
    });
  };

  document.getElementById('shareLinkBtn').onclick = () => {
    window.soundEngine.playSuccess();
    const dayVal = dayInput.value || 1;
    const startStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayVal).padStart(2, '0')}`;
    const endStr = finalDateInput.value;
    const url = `${window.location.origin}${window.location.pathname}?start=${startStr}&end=${endStr}&include=${includeCheck.checked}`;
    
    navigator.clipboard.writeText(url).then(() => {
      showToast("¡Enlace único copiado al portapapeles!");
    });
  };

  const promoBanner = document.getElementById('promoBanner');
  const closePromoBtn = document.getElementById('closePromoBtn');
  const bannerIcon = document.getElementById('bannerIcon');
  const bannerText = document.getElementById('bannerText');
  const bannerBtn = document.getElementById('bannerBtn');
  const bannerDismissed = localStorage.getItem('daycounter_banner_dismissed') === 'true';

  if (window.BANNER_CONFIG && window.BANNER_CONFIG.enabled && !bannerDismissed && promoBanner) {
    if (bannerIcon && window.BANNER_CONFIG.icon) bannerIcon.textContent = window.BANNER_CONFIG.icon;
    if (bannerText && window.BANNER_CONFIG.text) bannerText.textContent = window.BANNER_CONFIG.text;
    if (bannerBtn) {
      if (window.BANNER_CONFIG.buttonText) bannerBtn.textContent = window.BANNER_CONFIG.buttonText;
      if (window.BANNER_CONFIG.buttonUrl) bannerBtn.href = window.BANNER_CONFIG.buttonUrl;
    }
    promoBanner.style.display = 'flex';
  }

  if (closePromoBtn) {
    closePromoBtn.onclick = () => {
      window.soundEngine.playClick();
      if (promoBanner) promoBanner.style.display = 'none';
      localStorage.setItem('daycounter_banner_dismissed', 'true');
    };
  }

  function processQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const startParam = params.get('start') || params.get('inicio');
    const endParam = params.get('end') || params.get('fin');
    const incParam = params.get('include');
    const busParam = params.get('business');

    if (startParam) {
      const parts = startParam.split('-');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0], 10);
        selectedMonth = parseInt(parts[1], 10) - 1;
        dayInput.value = parseInt(parts[2], 10);
      }
    }

    if (endParam) {
      finalDateInput.value = endParam;
      const [eY, eM, eD] = endParam.split('-').map(Number);
      selectCustomDate(new Date(eY, eM - 1, eD));
    }

    if (incParam !== null) {
      includeCheck.checked = (incParam === 'true' || incParam === '1');
    }

    if (busParam !== null && businessDaysCheck) {
      businessDaysCheck.checked = (busParam === 'true' || busParam === '1');
    }

    if (params.get('format') === 'json') {
      const startStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayInput.value || 1).padStart(2, '0')}`;
      const jsonRes = TimeCalculator.calculateDifference(startStr, finalDateInput.value, {
        includeStart: includeCheck.checked,
        onlyBusinessDays: businessDaysCheck ? businessDaysCheck.checked : false
      });
      document.body.innerHTML = `<pre style="font-family:monospace; padding:24px; background:#0f172a; color:#38bdf8; font-size:14px; margin:0; min-height:100vh;">${JSON.stringify(jsonRes, null, 2)}</pre>`;
      return true;
    }
    return false;
  }

  const isJson = processQueryParams();
  if (!isJson) {
    renderMonthPicker();
    renderCustomCalendar();
    renderPresets();
    calculate();
  }
});

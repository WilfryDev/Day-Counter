(function() {
  function initDayCounterWidgets() {
    const widgets = document.querySelectorAll('.day-counter-widget:not([data-initialized])');
    widgets.forEach(w => {
      w.setAttribute('data-initialized', 'true');
      const start = w.getAttribute('data-start') || '2026-01-01';
      const end = w.getAttribute('data-end') || '';
      const title = encodeURIComponent(w.getAttribute('data-title') || 'Contador de Días');
      const theme = w.getAttribute('data-theme') || 'auto';
      const color = encodeURIComponent(w.getAttribute('data-color') || '');
      const business = w.getAttribute('data-business') || 'false';

      const scriptTag = document.currentScript || Array.from(document.querySelectorAll('script')).pop();
      const baseUrl = scriptTag ? scriptTag.src.replace(/\/js\/embed\.js.*$/, '') : '.';
      const iframeUrl = `${baseUrl}/embed.html?start=${start}&end=${end}&title=${title}&theme=${theme}&color=${color}&business=${business}`;

      const iframe = document.createElement('iframe');
      iframe.src = iframeUrl;
      iframe.style.width = '100%';
      iframe.style.maxWidth = '360px';
      iframe.style.height = '185px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '20px';
      iframe.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('loading', 'lazy');

      w.appendChild(iframe);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDayCounterWidgets);
  } else {
    initDayCounterWidgets();
  }
})();

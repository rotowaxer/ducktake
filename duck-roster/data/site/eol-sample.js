// A made-up roster drawn the way Employee Online's month view looks (its colours, sizes and layout,
// measured from the real page on 20 Oct 2026). Used by the website and store/shots.html.
//   <div data-eol-grid></div>           the 4-week grid, Mon 19 Oct to Sun 15 Nov 2026
//   <span data-eol="D 08:30 - 17:00">   one shift bubble
(() => {
  const WEEKS = [
    ['D 08:30 - 17:00 @ Biochem', 'D 08:30 - 17:00 @ Biochem', 'A 06:30 - 15:00', 'P 15:00 - 23:30', 'P 15:00 - 23:30', 'DO', 'DO'],
    ['N 23:00 - 07:00', 'N 23:00 - 07:00', 'N 23:00 - 07:00', 'DO', 'DO', 'A 07:00 - 15:30', 'OC 17:00 - 06:30'],
    ['ADO 8hr', 'D 08:30 - 17:00 @ Serology', 'D 08:30 - 17:00 @ Serology', 'A 06:30 - 15:00', 'CONF EXT', 'DO', 'DO'],
    ['P 15:00 - 23:30', 'P 15:00 - 23:30', 'DO', 'D 08:30 - 17:00 @ Biochem|OC 17:00 - 06:30', 'D 08:30 - 17:00 @ Biochem', 'A 07:00 - 15:30', 'DO'],
  ];
  const FIRST = new Date(2026, 9, 19), TODAY = 20;
  const KIND = { D: 'day', A: 'day', P: 'evening', N: 'night', OC: 'oncall', DO: 'rest', ADO: 'ado', CONF: 'noneff' };
  const CSS = `
.eol-grid{border-collapse:collapse;width:770px;table-layout:fixed;background:#fff;font-family:Inter,"Segoe UI",Arial,sans-serif;color:#000;text-align:left}
.eol-grid th{background:#ddd;color:#413f37;font:600 13px/24px Inter,"Segoe UI",Arial,sans-serif;padding:2px 4px;border:1px solid #ddd;text-align:center}
.eol-grid td{border:1px solid #ddd;vertical-align:top;padding:2px;height:138px}
.eol-grid td.eol-today{background:#fff9b5}
.eol-dn{font:600 14px/17px Inter,"Segoe UI",Arial,sans-serif;padding:2px 4px 4px}
.eol-ev{position:relative;display:block;margin:0 2px 8px;padding:7px;border-radius:4px;font:400 12.24px/15px Inter,"Segoe UI",Arial,sans-serif;text-align:left;white-space:nowrap}
.eol-ev b{display:block;font-weight:700}
.eol-ev i{position:absolute;right:4px;bottom:4px;width:9px;height:9px;border-radius:50%;background:#c2187f;box-shadow:inset 0 0 0 2px #e26ab6}
.eol-day,.eol-evening{background:#30bd2f;color:#000}
.eol-night{background:#1a851a;color:#fff}
.eol-oncall{background:#aed5ae;color:#000}
.eol-rest,.eol-ado{background:#7b7b7b;color:#fff}
.eol-noneff{background:#bbb79c;color:#000}`;
  document.head.insertAdjacentHTML('beforeend', '<style>' + CSS + '</style>');

  const esc = s => s.replace(/[&<>"]/g, c => '&#' + c.charCodeAt(0) + ';');
  function bubble(text) {
    const m = text.match(/^(.+?) (\d\d:\d\d - \d\d:\d\d)(?: (@ .+))?$/);
    const code = m ? m[1] : text;
    const kind = KIND[code.split(' ')[0]] || 'day';
    const body = m ? '<b>' + esc(code) + '</b>' + m[2] + (m[3] ? '<br>' + esc(m[3]) : '') + '<i></i>' : '<b>' + esc(text) + '</b>';
    return '<span class="eol-ev eol-' + kind + '">' + body + '</span>';
  }

  for (const el of document.querySelectorAll('[data-eol]')) el.outerHTML = bubble(el.dataset.eol);
  for (const el of document.querySelectorAll('[data-eol-grid]')) {
    let html = '<table class="eol-grid"><tr>' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => '<th>' + d + '</th>').join('') + '</tr>';
    WEEKS.forEach((week, w) => {
      html += '<tr>' + week.map((cell, c) => {
        const day = new Date(FIRST.getFullYear(), FIRST.getMonth(), FIRST.getDate() + w * 7 + c).getDate();
        return '<td' + (w === 0 && day === TODAY ? ' class="eol-today"' : '') + '><div class="eol-dn">' + day + '</div>' + cell.split('|').map(bubble).join('') + '</td>';
      }).join('') + '</tr>';
    });
    el.innerHTML = html + '</table>';
    // Scale the 770px grid to the space inside whatever box it sits in (clientWidth includes the box's padding).
    const fit = () => {
      const box = el.parentElement, cs = getComputedStyle(box);
      el.style.zoom = Math.min(1, (box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) / 770);
    };
    if (!el.hasAttribute('data-eol-full')) { fit(); addEventListener('resize', fit); }
  }
})();

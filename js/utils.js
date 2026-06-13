// ===== Random Helpers =====
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== localStorage Helpers =====
function loadBestScore(key) {
  try {
    return parseInt(localStorage.getItem('mgh_' + key)) || 0;
  } catch (e) { return 0; }
}

function saveBestScore(key, score) {
  try {
    const prev = loadBestScore(key);
    if (score > prev) localStorage.setItem('mgh_' + key, score);
  } catch (e) {}
}

// ===== Modal =====
function showModal({ emoji, title, message, buttons }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  let btnsHTML = '';
  if (buttons) {
    btnsHTML = buttons.map((b, i) =>
      `<button class="btn ${b.cls || 'btn-primary'}" data-idx="${i}">${b.text}</button>`
    ).join('');
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-emoji">${emoji || ''}</div>
      <div class="modal-title">${title || ''}</div>
      <div class="modal-msg">${message || ''}</div>
      ${btnsHTML}
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function close() {
    overlay.style.animation = 'fadeOut 0.15s ease forwards';
    setTimeout(() => overlay.remove(), 150);
  }

  if (buttons) {
    overlay.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        close();
        if (buttons[idx].onClick) buttons[idx].onClick();
      });
    });
  }

  document.body.appendChild(overlay);
  return { close };
}

// ===== Confetti =====
function showConfetti(count = 60) {
  const colors = ['#FFB5C2','#B5EAD7','#C7CEEA','#FFDAC1','#E2F0CB','#B5D8EB','#FFF1B0','#FF9AA2'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = -(Math.random() * 20 + 10) + 'px';
    piece.style.width = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    piece.style.background = pickRandom(colors);
    piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
    piece.style.animationDelay = Math.random() * 0.6 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
}

// ===== Swipe Detection =====
function detectSwipe(element, callback, threshold = 30) {
  let startX, startY, startTime;
  element.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });
  element.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    const dt = Date.now() - startTime;
    startX = startY = null;
    if (dt > 800) return;
    const absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) < threshold) return;
    if (absDx > absDy) {
      callback(dx > 0 ? 'right' : 'left');
    } else {
      callback(dy > 0 ? 'down' : 'up');
    }
  });
}

// ===== Time Format =====
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ===== Show D-pad for touch devices =====
function setupDpad(handlers) {
  const dpad = document.querySelector('.dpad');
  if (!dpad) return;
  // Show dpad on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    dpad.classList.add('visible');
  }

  const mappings = {
    'dpad-up': 'up',
    'dpad-down': 'down',
    'dpad-left': 'left',
    'dpad-right': 'right',
  };

  dpad.querySelectorAll('.dpad-btn').forEach(btn => {
    const dir = mappings[btn.className.match(/dpad-\w+/)[0]];
    if (!dir) return;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      btn.style.transform = 'scale(0.9)';
      if (handlers[dir]) handlers[dir]();
    });
    btn.addEventListener('pointerup', (e) => {
      e.preventDefault();
      btn.style.transform = '';
    });
    btn.addEventListener('pointerleave', (e) => {
      btn.style.transform = '';
    });
  });
}

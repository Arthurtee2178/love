// Move & scale the "I love you masha" block on scroll (index page)
const loveBlock = document.querySelector('.love-block');
if (loveBlock) {
  // we'll use requestAnimationFrame for smooth transforms
  let lastScroll = window.scrollY;
  let ticking = false;

  function update() {
    ticking = false;
    const scrollY = window.scrollY;
    lastScroll = scrollY;

    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // compute how far the block can move up before its top hits a top gap
  const computed = getComputedStyle(loveBlock);
  const rect = loveBlock.getBoundingClientRect();
  const blockHeight = rect.height;

  const topGap = Math.max(12, Math.min(48, vh * 0.03)); // px; small responsive gap

  // Starting top when top:50% and translateY(0):
  const startTop = (vh * 0.5) - (blockHeight / 2);
  // Desired top is topGap. Compute the maximum negative translateY needed:
  // startTop + translateY = topGap => translateY = topGap - startTop
  let maxNegative = topGap - startTop; // this will be negative when startTop > topGap
  if (maxNegative > 0) maxNegative = 0; // never positive

  // how strongly scroll maps to movement (tweakable)
  const factor = 0.35;
  const desired = -scrollY * factor;

  // clamp desired between maxNegative (most negative) and 0
  const translateY = Math.max(maxNegative, Math.min(0, desired));

    // small scale effect, clamped
    const scale = 1 + Math.min(scrollY / 1400, 1.8);

    loveBlock.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${scale})`;
    // keep bottom defined so layout remains predictable on resize
    loveBlock.style.bottom = computed.bottom || '9vh';
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  // run once to initialize position
  update();
}

// Falling hearts on poem pages
(function enableFallingHearts(){
  const body = document.body;
  if (!body.classList.contains('falling')) return; // only on pages opted-in

  const colors = ['pink','red','purple','yellow'];

  function createHeart(){
    const el = document.createElement('div');
    el.className = 'falling-heart';
    // random variant
    const sizeClass = Math.random() < 0.6 ? '' : ' small';
    const color = colors[Math.floor(Math.random()*colors.length)];
    el.className += sizeClass + ' ' + color;

    // random start position around viewport width
    const left = Math.random() * 100; // vw
    el.style.left = left + 'vw';

    // random duration
    const duration = 6 + Math.random()*6; // 6s to 12s
    el.style.animationDuration = duration + 's';

    // horizontal drift via transform translateX during animation can be approximated
    // apply small random horizontal offset via CSS variable if needed

    document.body.appendChild(el);

    // remove after animation plus small buffer
    setTimeout(()=> el.remove(), (duration + 0.5) * 1000);
  }

  // spawn hearts at a gentle rate
  let spawnInterval = setInterval(createHeart, 650);

  // slow down spawns when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    } else if (!spawnInterval) {
      spawnInterval = setInterval(createHeart, 650);
    }
  });

})();

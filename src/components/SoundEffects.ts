/**
 * Web Audio API Synth Effects for ZapFolder Premium Photobooth UX
 */

let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playTick() {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {
    console.warn('Audio feedback failed to play', e);
  }
}

export function playAlert() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    // Play two rapid, clear attention-grabbing digital photobooth chimes (C6 - G6)
    [0, 0.08].forEach((delay, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      const freq = idx === 0 ? 1046.50 : 1568.00; // C6 to G6
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  } catch (e) {
    console.warn('Audio alert failed to play', e);
  }
}

export function playSuccess() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    // Magic retro arcade winning arpeggio: C5, E5, G5, B5, C6 (Ascending arpeggio)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
    
    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const playDelay = idx * 0.06;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + playDelay);
      
      gain.gain.setValueAtTime(0.08, now + playDelay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + playDelay + 0.4);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + playDelay);
      osc.stop(now + playDelay + 0.45);
    });
  } catch (e) {
    console.warn('Audio success failed to play', e);
  }
}

export function playCancel() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    // Descending sad error tone
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    
    osc1.frequency.setValueAtTime(261.63, now); // C4
    osc1.frequency.linearRampToValueAtTime(130.81, now + 0.22); // C3
    
    osc2.frequency.setValueAtTime(258, now);
    osc2.frequency.linearRampToValueAtTime(128, now + 0.22);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    osc1.stop(now + 0.22);
    osc2.stop(now + 0.22);
  } catch (e) {
    console.warn('Audio cancel failed to play', e);
  }
}

/**
 * Synthesizes a crisp physical camera shutter release noise ("K-CHICK!")
 * Coupled with a high-pass noise burst and quick metal click.
 */
export function playCameraShutter() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // 1. Shutter metallic click (sine high-freq chirp)
    const oscchirp = audioCtx.createOscillator();
    const gainchirp = audioCtx.createGain();
    oscchirp.type = 'triangle';
    oscchirp.frequency.setValueAtTime(2000, now);
    oscchirp.frequency.exponentialRampToValueAtTime(300, now + 0.08);

    gainchirp.gain.setValueAtTime(0.2, now);
    gainchirp.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    oscchirp.connect(gainchirp);
    gainchirp.connect(audioCtx.destination);
    oscchirp.start(now);
    oscchirp.stop(now + 0.1);

    // 2. Air/Mechanical slide (Noisy friction simulated via triangle modulated buffer)
    const oscnoise = audioCtx.createOscillator();
    const gainnoise = audioCtx.createGain();
    oscnoise.type = 'sawtooth';
    oscnoise.frequency.setValueAtTime(120, now + 0.04);
    oscnoise.frequency.linearRampToValueAtTime(60, now + 0.15);

    gainnoise.gain.setValueAtTime(0.12, now + 0.04);
    gainnoise.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscnoise.connect(gainnoise);
    gainnoise.connect(audioCtx.destination);
    oscnoise.start(now + 0.04);
    oscnoise.stop(now + 0.16);

    // 3. Polaroid mechanical motor wind advance ("Zzzzhp")
    const oscmotor = audioCtx.createOscillator();
    const gainmotor = audioCtx.createGain();
    oscmotor.type = 'sawtooth';
    oscmotor.frequency.setValueAtTime(150, now + 0.18);
    oscmotor.frequency.linearRampToValueAtTime(380, now + 0.45);

    gainmotor.gain.setValueAtTime(0.05, now + 0.18);
    gainmotor.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    oscmotor.connect(gainmotor);
    gainmotor.connect(audioCtx.destination);
    oscmotor.start(now + 0.18);
    oscmotor.stop(now + 0.47);

  } catch (err) {
    console.warn('Audio shutter simulation failed', err);
  }
}

/**
 * Synthesizes a quick series of thermal ticket printing clicks
 * for a physical photo strip dispenser aesthetic feedback.
 */
export function playPrinterTicket() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Play 5 tiny, ultra-short mechanical squeaks
    for (let i = 0; i < 6; i++) {
      const delay = i * 0.07;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 - (i * 120), now + delay);
      
      gain.gain.setValueAtTime(0.03, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.04);
    }
  } catch (err) {
    console.warn('Audio printer feedback failed', err);
  }
}


import confetti from 'canvas-confetti';

/** Two-burst confetti tinted with the picked team's accent color. */
export function fireTribeConfetti(teamColor: string) {
  const colors = [teamColor, '#00D26A', '#FFFFFF'];
  const baseOpts: confetti.Options = {
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    gravity: 0.9,
    ticks: 200,
    scalar: 1.05,
    colors,
  };

  confetti({ ...baseOpts, origin: { x: 0.15, y: 0.7 }, angle: 60 });
  confetti({ ...baseOpts, origin: { x: 0.85, y: 0.7 }, angle: 120 });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.6 },
      colors,
      shapes: ['circle'],
    });
  }, 250);
}

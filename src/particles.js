import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export async function initParticles(id) {
  const el = document.getElementById(id);
  if (!el) return;
  await loadSlim(tsParticles);
  await tsParticles.load({
    id,
    options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      background: { color: "transparent" },
      particles: {
        number: { value: 60, density: { enable: true, area: 900 } },
        color: { value: "#3DFFA2" },
        shape: { type: "circle" },
        opacity: { value: { min: 0.15, max: 0.5 } },
        size: { value: { min: 1, max: 3 } },
        links: {
          enable: true,
          distance: 140,
          color: "#3DFFA2",
          opacity: 0.18,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" }
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.4 } },
          push: { quantity: 3 }
        }
      },
      detectRetina: true,
      reduceMotion: true
    }
  });
}

import { initParticles } from "./particles.js";
import { initTerminal } from "./terminal.js";
import "./style.css";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initParticles("particles");
  initTerminal();

  /* header réduit au scroll */
  const header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* barre de progression */
  const bar = document.getElementById("progressBar");
  function updateProgress() {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* scrollspy : active le lien du dock selon la section visible */
  const spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  const sections = Array.prototype.slice
    .call(document.querySelectorAll(".frame[id]"))
    .filter((s) => spyLinks.some((l) => l.dataset.spy === s.id));
  if (spyLinks.length && sections.length) {
    if (!("IntersectionObserver" in window)) {
      spyLinks[0].classList.add("active");
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              spyLinks.forEach((l) =>
                l.classList.toggle("active", l.dataset.spy === entry.target.id)
              );
            }
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -40% 0px" }
      );
      sections.forEach((s) => io.observe(s));
    }
  }

  /* révélations au scroll */
  const reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reveals.length) {
    if (REDUCED || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      reveals.forEach((el) => io.observe(el));
    }
  }
});

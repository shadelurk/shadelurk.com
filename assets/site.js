(() => {
  document.documentElement.classList.remove("no-js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav background after leaving the hero
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // hero slideshow
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll(".hero-dot")];
  const now = document.querySelector(".hero-now");
  const nowV = document.querySelector(".hero-now-v");
  let cur = 0, timer;
  const show = (i) => {
    slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("is-active");
    void dots[cur].offsetWidth; // restart the progress bar
    dots[cur].classList.add("is-active");
    nowV.textContent = slides[cur].dataset.label;
    now.href = slides[cur].dataset.href;
  };
  const play = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(cur + 1), 7000); };
  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); play(); }));
  document.addEventListener("visibilitychange", () => document.hidden ? clearInterval(timer) : play());
  if (slides.length > 1) play();

  // screenshot lightbox
  const box = document.getElementById("lightbox");
  const boxImg = box.querySelector("img");
  document.querySelectorAll(".shot").forEach((b) => b.addEventListener("click", () => {
    boxImg.src = b.dataset.full; boxImg.alt = b.getAttribute("aria-label"); box.showModal();
  }));
  box.addEventListener("click", (e) => { if (e.target !== boxImg) box.close(); });

  // YouTube: load the player only when asked, so the page stays light
  document.querySelectorAll(".yt").forEach((b) => b.addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.className = "yt-embed";
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;
    f.title = b.getAttribute("aria-label");
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    const media = b.closest(".card").querySelector(".card-media");
    media.replaceChildren(f);
    b.remove();
  }));

  // only one trailer plays at a time
  const vids = [...document.querySelectorAll("video")];
  vids.forEach((v) => v.addEventListener("play", () => vids.forEach((o) => o !== v && o.pause())));
})();

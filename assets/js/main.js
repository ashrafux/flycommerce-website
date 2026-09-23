/* ==========================================================================
   FlyCommerce — behaviour layer
   Lenis smooth scroll + GSAP/ScrollTrigger choreography, marquee rails and
   the interactive pieces of the comp (accordion, FAQ, feature lists).
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("js-off");

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var hasGsap = typeof window.gsap !== "undefined";
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

  if (hasGsap && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------------------------------------------
     Content data — the Figma comp renders these as flattened artwork,
     so they are generated here and styled with CSS.
     ------------------------------------------------------------------ */

  var INTEGRATIONS = [
    {
      name: "Google Tag Manager",
      svg:
        '<svg viewBox="0 0 168 39" role="img" aria-label="Google Tag Manager">' +
        '<path d="M18 6 6 18l12 12 5-5-7-7 7-7-5-5Z" fill="#8ab4f8"/>' +
        '<path d="M18 6 30 18 18 30l-5-5 7-7-7-7 5-5Z" fill="#4285f4"/>' +
        '<circle cx="18" cy="30" r="4.4" fill="#246fdb"/>' +
        '<text x="40" y="17" font-family="Lato, sans-serif" font-size="14" fill="#5f6368">Google</text>' +
        '<text x="40" y="32" font-family="Lato, sans-serif" font-size="14" fill="#5f6368">Tag Manager</text>' +
        "</svg>"
    },
    {
      name: "Intuit Mailchimp",
      svg:
        '<svg viewBox="0 0 186 39" role="img" aria-label="Intuit Mailchimp">' +
        '<circle cx="19" cy="19" r="15" fill="#111"/>' +
        '<circle cx="14" cy="15" r="2.4" fill="#fff"/><circle cx="24" cy="15" r="2.4" fill="#fff"/>' +
        '<path d="M12 24c3 3 11 3 14 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<text x="42" y="17" font-family="Sora, sans-serif" font-weight="700" font-size="13" fill="#111">INTUIT</text>' +
        '<text x="42" y="33" font-family="Sora, sans-serif" font-weight="700" font-size="15" fill="#111">mailchimp</text>' +
        "</svg>"
    },
    {
      name: "Analytics",
      svg:
        '<svg viewBox="0 0 148 39" role="img" aria-label="Analytics">' +
        '<rect x="4" y="18" width="7" height="16" rx="3.5" fill="#f9ab00"/>' +
        '<rect x="15" y="10" width="7" height="24" rx="3.5" fill="#f9ab00"/>' +
        '<rect x="26" y="3" width="7" height="31" rx="3.5" fill="#e37400"/>' +
        '<text x="42" y="28" font-family="Lato, sans-serif" font-size="20" fill="#3c4043">Analytics</text>' +
        "</svg>"
    },
    {
      name: "Meta Pixel",
      svg:
        '<svg viewBox="0 0 152 39" role="img" aria-label="Meta Pixel">' +
        '<path d="M18 4 32 12v15l-14 8-14-8V12L18 4Z" fill="#1c2b5b"/>' +
        '<path d="m14 15-4 4.5 4 4.5m8-9 4 4.5-4 4.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text x="42" y="26" font-family="Sora, sans-serif" font-weight="700" font-size="17" fill="#1c2b5b">Meta Pixel</text>' +
        "</svg>"
    },
    {
      name: "webhooks",
      svg:
        '<svg viewBox="0 0 156 39" role="img" aria-label="webhooks">' +
        '<circle cx="12" cy="13" r="6.5" fill="#c73a63"/>' +
        '<circle cx="28" cy="13" r="6.5" fill="#e5457d"/>' +
        '<circle cx="20" cy="28" r="6.5" fill="#8c2f4e"/>' +
        '<path d="M12 13 20 28l8-15" stroke="#c73a63" stroke-width="2.6" fill="none"/>' +
        '<text x="42" y="26" font-family="Sora, sans-serif" font-weight="700" font-size="17" fill="#1f2937">webhooks</text>' +
        "</svg>"
    },
    {
      name: "Live Chat",
      svg:
        '<svg viewBox="0 0 142 39" role="img" aria-label="Live Chat">' +
        '<rect x="4" y="6" width="27" height="27" rx="8" fill="#8b5cf6"/>' +
        '<path d="M12 15h11v7h-5l-4 3.5V22h-2v-7Z" fill="#fff"/>' +
        '<text x="40" y="26" font-family="Sora, sans-serif" font-weight="700" font-size="17" fill="#1f2937">Live Chat</text>' +
        "</svg>"
    },
    {
      name: "Avalara",
      svg:
        '<svg viewBox="0 0 168 39" role="img" aria-label="Avalara">' +
        '<path d="M6 32 18 8l7 14-4 2-3-6-7 14H6Z" fill="#ff6600"/>' +
        '<path d="m22 32 8-16 8 16h-5l-3-6-3 6h-5Z" fill="#1d4ed8"/>' +
        '<text x="44" y="30" font-family="Sora, sans-serif" font-weight="700" font-size="24" fill="#ff6600">Avalara</text>' +
        "</svg>"
    }
  ];

  var THEMES = [
    [
      {
        name: "Pulse.",
        bar: "#5b2ec4",
        nav: "#4a23a8",
        hero: "linear-gradient(120deg,#5fe3c0,#2fd6a8)",
        ink: "#0f3d33",
        accent: "#f59e0b",
        object: "linear-gradient(140deg,#1f2937,#0b1220)",
        cols: 5
      },
      {
        name: "Lumen.",
        bar: "#1f2735",
        nav: "#161d29",
        hero: "linear-gradient(120deg,#5aa9f8,#2f7fe0)",
        ink: "#ffffff",
        accent: "#f97316",
        object: "linear-gradient(140deg,#e2e8f0,#94a3b8)",
        cols: 8
      },
      {
        name: "Nova.",
        bar: "#ffffff",
        nav: "#ffffff",
        hero: "linear-gradient(120deg,#fbd9e4,#f7c4d6)",
        ink: "#7a2946",
        accent: "#be185d",
        object: "radial-gradient(circle at 40% 36%,#ffffff 0 38%,#e6e2dc 39% 100%)",
        cols: 4,
        light: true
      },
      {
        name: "Zeomart",
        bar: "#ffffff",
        nav: "#ffffff",
        hero: "linear-gradient(120deg,#5b2ec4,#3b1e94)",
        ink: "#ffffff",
        accent: "#f59e0b",
        object: "linear-gradient(140deg,#c7d2fe,#6366f1)",
        cols: 6,
        light: true
      }
    ],
    [
      {
        name: "Medicare",
        bar: "#ffffff",
        nav: "#ffffff",
        hero: "linear-gradient(120deg,#22a3e8,#0d7fc4)",
        ink: "#ffffff",
        accent: "#0ea5e9",
        object: "linear-gradient(140deg,#e0f2fe,#7dd3fc)",
        cols: 5,
        light: true
      },
      {
        name: "Zeemart",
        bar: "#ffffff",
        nav: "#ffffff",
        hero: "linear-gradient(120deg,#2563eb,#1d4ed8)",
        ink: "#ffffff",
        accent: "#f59e0b",
        object: "linear-gradient(140deg,#cbd5e1,#64748b)",
        cols: 6,
        light: true
      },
      {
        name: "Fayrune",
        bar: "#ffffff",
        nav: "#ffffff",
        hero: "linear-gradient(120deg,#4d6b52,#3a5540)",
        ink: "#ffffff",
        accent: "#e79a30",
        object: "linear-gradient(140deg,#c98f52,#8a5526)",
        cols: 4,
        light: true
      },
      {
        name: "Zeemart",
        bar: "#1d5b8f",
        nav: "#17496f",
        hero: "linear-gradient(120deg,#e7edf3,#cfd9e4)",
        ink: "#123a63",
        accent: "#f59e0b",
        object: "linear-gradient(140deg,#fde68a,#f59e0b)",
        cols: 5
      }
    ]
  ];

  /* ------------------------------------------------------------------
     Builders
     ------------------------------------------------------------------ */

  function buildIntegrationGroup() {
    return (
      '<div class="marquee__group">' +
      INTEGRATIONS.map(function (logo) {
        return (
          '<span class="integrations__logo" title="' + logo.name + '">' +
          logo.svg +
          "</span>"
        );
      }).join("") +
      "</div>"
    );
  }

  function themeCardMarkup(theme) {
    var tiles = "";
    for (var i = 0; i < theme.cols; i += 1) tiles += "<i></i>";

    return (
      '<article class="theme-card">' +
      '<div class="theme-shot" style="' +
      "--shot-bar:" + theme.bar + ";" +
      "--shot-nav:" + theme.nav + ";" +
      "--shot-hero:" + theme.hero + ";" +
      "--shot-heroink:" + theme.ink + ";" +
      "--shot-accent:" + theme.accent + ";" +
      "--shot-object:" + theme.object + ";" +
      "--shot-cols:" + theme.cols + ';">' +
      '<div class="theme-shot__bar" style="color:' +
      (theme.light ? "#475569" : "rgba(255,255,255,.85)") +
      '"><b style="color:' +
      (theme.light ? "#0f172a" : "#fff") +
      '">' +
      theme.name +
      '</b><i style="background:' +
      (theme.light ? "#eef2f7" : "rgba(255,255,255,.85)") +
      '"></i><span>Cart</span></div>' +
      '<div class="theme-shot__nav" style="color:' +
      (theme.light ? "#64748b" : "rgba(255,255,255,.8)") +
      '"><span>Home</span><span>Shop</span><span>Pages</span><span>Blog</span></div>' +
      '<div class="theme-shot__hero">' +
      "<small>Starting from $99</small>" +
      "<b>" + (theme.headline || "Best Deals of the Season") + "</b>" +
      "<em>Shop Now</em>" +
      '<span class="theme-shot__object"></span>' +
      "</div>" +
      '<div class="theme-shot__strip"><span>Free Shipping</span><span>Money Guarantee</span><span>Online Support</span><span>Flexible Payment</span></div>' +
      '<div class="theme-shot__label">Shop by Category</div>' +
      '<div class="theme-shot__tiles">' + tiles + "</div>" +
      '<div class="theme-shot__tiles">' + tiles + "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function buildThemeGroup(row) {
    return (
      '<div class="marquee__group">' +
      THEMES[row].map(themeCardMarkup).join("") +
      "</div>"
    );
  }

  /* ------------------------------------------------------------------
     Marquee — duplicates its group until it overflows twice, then
     translates one group-width on an infinite GSAP timeline.
     ------------------------------------------------------------------ */

  function initMarquee(el) {
    var track = el.querySelector("[data-marquee-track]");
    if (!track) return;

    var row = track.getAttribute("data-theme-row");
    var groupHtml =
      row === null ? buildIntegrationGroup() : buildThemeGroup(Number(row));

    track.innerHTML = groupHtml;

    var group = track.firstElementChild;
    var groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) return;

    // Enough copies to cover the rail plus one spare for the seamless wrap.
    var copies = Math.max(2, Math.ceil(el.offsetWidth / groupWidth) + 1);
    for (var i = 1; i < copies; i += 1) {
      track.insertAdjacentHTML("beforeend", groupHtml);
    }

    if (reduceMotion || !hasGsap) return;

    var speed = Number(el.getAttribute("data-speed")) || 50; // px per second
    var reverse = el.getAttribute("data-reverse") === "true";
    var duration = groupWidth / speed;

    var tween = gsap.fromTo(
      track,
      { x: reverse ? -groupWidth : 0 },
      {
        x: reverse ? 0 : -groupWidth,
        duration: duration,
        ease: "none",
        repeat: -1
      }
    );

    el.addEventListener("pointerenter", function () {
      gsap.to(tween, { timeScale: 0.25, duration: 0.4 });
    });
    el.addEventListener("pointerleave", function () {
      gsap.to(tween, { timeScale: 1, duration: 0.4 });
    });
  }

  /* ------------------------------------------------------------------
     Smooth scrolling — Lenis driven by the GSAP ticker so ScrollTrigger
     and the scroll position never drift apart.
     ------------------------------------------------------------------ */

  var lenis = null;

  function initLenis() {
    if (reduceMotion || typeof window.Lenis === "undefined") return;

    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    if (hasGsap) {
      lenis.on("scroll", function () {
        if (hasScrollTrigger) ScrollTrigger.update();
      });

      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ------------------------------------------------------------------
     Scroll choreography
     ------------------------------------------------------------------ */

  function initReveals() {
    if (!hasGsap || !hasScrollTrigger || reduceMotion) {
      Array.prototype.forEach.call(
        document.querySelectorAll(".reveal"),
        function (el) {
          el.style.opacity = 1;
          el.style.transform = "none";
        }
      );
      return;
    }

    // Hero headline — a staggered mask-up on load.
    var heroLines = document.querySelectorAll(".hero [data-split]");
    gsap.set(heroLines, { yPercent: 115, opacity: 0 });
    gsap.set(".hero__badge", { scale: 0.4, opacity: 0, rotate: -35 });

    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .to(heroLines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.09
      })
      .to(
        ".hero__badge",
        { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: "back.out(2)" },
        "-=0.6"
      )
      // Deliberately not `.nav__inner > *`: that would include the mobile
      // drawer, and gsap.from would bake its hidden opacity in as an inline
      // style that the .is-open rule can no longer beat.
      .from(
        [".nav .brand", ".nav__links > *", ".nav__actions > *"],
        {
          y: -18,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          // Without this GSAP leaves an identity transform behind, and even
          // an identity transform makes the element a containing block for
          // `position: fixed` — which would re-anchor the mega-menu panel.
          clearProps: "transform"
        },
        0.1
      );

    // Generic reveals.
    Array.prototype.forEach.call(
      document.querySelectorAll(".reveal"),
      function (el) {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        });
      }
    );

    // Step cards drift in from the side and settle at their Figma angle.
    Array.prototype.forEach.call(
      document.querySelectorAll(".step-card"),
      function (card) {
        var angle = gsap.getProperty(card, "rotation");
        gsap.from(card, {
          xPercent: 12,
          opacity: 0,
          rotate: angle + (angle > 0 ? 6 : -6),
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%", once: true }
        });
      }
    );

    // Solution / FAQ / business list items cascade.
    [".solution-list li", ".biz-card", ".faq-item", ".gateway-tile"].forEach(
      function (selector) {
        var groups = {};
        Array.prototype.forEach.call(
          document.querySelectorAll(selector),
          function (el) {
            var parent = el.parentElement;
            var key = parent.getAttribute("data-stagger-key");
            if (!key) {
              key = String(Math.random());
              parent.setAttribute("data-stagger-key", key);
            }
            groups[key] = groups[key] || [];
            groups[key].push(el);
          }
        );

        Object.keys(groups).forEach(function (key) {
          gsap.from(groups[key], {
            y: 22,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: groups[key][0].parentElement,
              start: "top 85%",
              once: true
            }
          });
        });
      }
    );

    // Hero panes get a gentle parallax lift as the page scrolls past.
    gsap.to(".hero-pane--wide", {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero__visual",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });
    gsap.to(".hero-pane--tall", {
      yPercent: -12,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero__visual",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6
      }
    });

    // Page-builder window rises out of the blue band.
    gsap.from(".builder__frame", {
      y: 90,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".builder__frame", start: "top 92%", once: true }
    });

    // "75+" counts up when the themes band arrives.
    var counter = document.querySelector("[data-count]");
    if (counter) {
      var target = Number(counter.getAttribute("data-count"));
      var state = { value: 0 };
      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        once: true,
        onEnter: function () {
          gsap.to(state, {
            value: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () {
              counter.innerHTML =
                Math.round(state.value) + "<sup>+</sup>";
            }
          });
        }
      });
    }

    // Floating badges idle up and down.
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-float]"),
      function (el, i) {
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 12,
          duration: 2.6 + (i % 3) * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.18
        });
      }
    );
  }

  /* ------------------------------------------------------------------
     Pointer tilt on the hero panes
     ------------------------------------------------------------------ */

  function initTilt() {
    if (reduceMotion || !hasGsap || window.matchMedia("(hover: none)").matches) {
      return;
    }

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-tilt]"),
      function (el) {
        var inner = el.querySelector(".hero-pane__inner") || el;

        el.addEventListener("pointermove", function (event) {
          var rect = el.getBoundingClientRect();
          var px = (event.clientX - rect.left) / rect.width - 0.5;
          var py = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(el, {
            rotateX: py * -4,
            rotateY: px * 6,
            transformPerspective: 1200,
            transformOrigin: "center",
            duration: 0.6,
            ease: "power2.out"
          });
          gsap.to(inner, {
            x: px * 16,
            y: py * 12,
            duration: 0.8,
            ease: "power2.out"
          });
        });

        el.addEventListener("pointerleave", function () {
          gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
          gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
        });
      }
    );
  }

  /* ------------------------------------------------------------------
     Interactive components
     ------------------------------------------------------------------ */

  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.getElementById("navBurger");
    if (!nav) return;

    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger) {
      burger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
      });
    }

    // Anchor links route through Lenis so the easing matches the page.
    // A mega-menu trigger is skipped: it owns a panel, and initMegaMenu
    // binds its own click that toggles instead of navigating.
    Array.prototype.forEach.call(
      document.querySelectorAll('a[href^="#"]:not([data-mega] > .nav__link)'),
      function (link) {
        link.addEventListener("click", function (event) {
          var id = link.getAttribute("href");
          if (!id || id === "#") return;
          var target = document.querySelector(id);
          if (!target) return;

          event.preventDefault();
          nav.classList.remove("is-open");
          if (burger) burger.setAttribute("aria-expanded", "false");

          if (lenis) {
            lenis.scrollTo(target, { offset: -102, duration: 1.2 });
          } else {
            var top =
              target.getBoundingClientRect().top + window.scrollY - 102;
            window.scrollTo({ top: top, behavior: "smooth" });
          }
        });
      }
    );
  }

  function initAccordion() {
    var group = document.querySelector("[data-accordion]");
    if (!group) return;

    var panels = Array.prototype.slice.call(
      group.querySelectorAll("[data-cap]")
    );

    var open = function (panel) {
      if (panel.classList.contains("is-open")) return;
      panels.forEach(function (p) {
        p.classList.toggle("is-open", p === panel);
      });
      if (hasScrollTrigger) {
        window.setTimeout(function () {
          ScrollTrigger.refresh();
        }, 800);
      }
    };

    panels.forEach(function (panel) {
      panel.setAttribute("tabindex", "0");
      panel.addEventListener("pointerenter", function () {
        if (window.matchMedia("(hover: hover)").matches) open(panel);
      });
      panel.addEventListener("click", function () {
        open(panel);
      });
      panel.addEventListener("focus", function () {
        open(panel);
      });
      panel.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(panel);
        }
      });
    });
  }

  function initFaq() {
    var grid = document.querySelector("[data-faq]");
    if (!grid) return;

    Array.prototype.forEach.call(
      grid.querySelectorAll(".faq-item"),
      function (item) {
        var btn = item.querySelector(".faq-item__btn");
        if (!btn) return;

        btn.addEventListener("click", function () {
          var willOpen = !item.classList.contains("is-open");

          Array.prototype.forEach.call(
            grid.querySelectorAll(".faq-item"),
            function (other) {
              other.classList.remove("is-open");
              var b = other.querySelector(".faq-item__btn");
              if (b) b.setAttribute("aria-expanded", "false");
            }
          );

          item.classList.toggle("is-open", willOpen);
          btn.setAttribute("aria-expanded", String(willOpen));

          if (hasScrollTrigger) {
            window.setTimeout(function () {
              ScrollTrigger.refresh();
            }, 500);
          }
        });
      }
    );
  }

  function initFeatureLists() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-feature-list]"),
      function (list) {
        var items = Array.prototype.slice.call(
          list.querySelectorAll("[data-feature]")
        );

        items.forEach(function (item) {
          var activate = function () {
            items.forEach(function (other) {
              other.classList.toggle("is-active", other === item);
            });
          };
          item.addEventListener("pointerenter", activate);
          item.addEventListener("click", activate);
        });
      }
    );
  }

  function initPlatformTabs() {
    var tabs = Array.prototype.slice.call(
      document.querySelectorAll(".platform__tab")
    );
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (other) {
          other.classList.toggle("is-active", other === tab);
          other.setAttribute("aria-selected", String(other === tab));
        });

        if (hasGsap && !reduceMotion) {
          gsap.fromTo(
            ".platform__panel",
            { opacity: 0.35, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Features mega menu — hover intent on desktop, tap-to-expand in the
     drawer, and fully operable from the keyboard either way.
     ------------------------------------------------------------------ */

  function initMegaMenu() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll("[data-mega]")
    );
    if (!items.length) return;

    var drawer = function () {
      return window.matchMedia("(max-width: 1080px)").matches;
    };

    items.forEach(function (item) {
      var trigger = item.querySelector(".nav__link");
      var panel = item.querySelector(".mega");
      if (!trigger || !panel) return;

      var openTimer = null;
      var closeTimer = null;

      var clear = function () {
        window.clearTimeout(openTimer);
        window.clearTimeout(closeTimer);
      };

      var setOpen = function (open) {
        clear();
        item.classList.toggle("is-open", open);
        trigger.setAttribute("aria-expanded", String(open));

        if (open && !reduceMotion && hasGsap && !drawer()) {
          gsap.fromTo(
            panel.querySelectorAll(".mm-item, .mm-card"),
            { y: 10, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.42,
              ease: "power2.out",
              stagger: 0.018,
              overwrite: true
            }
          );
        }
      };

      // Hover intent: a short lead-in stops the panel flashing as the
      // pointer crosses the nav, and a longer lead-out lets it travel
      // down into the panel.
      var hoverOpen = function () {
        if (drawer()) return;
        clear();
        openTimer = window.setTimeout(function () {
          setOpen(true);
        }, 90);
      };

      var hoverClose = function () {
        if (drawer()) return;
        clear();
        closeTimer = window.setTimeout(function () {
          setOpen(false);
        }, 220);
      };

      item.addEventListener("pointerenter", function (event) {
        if (event.pointerType === "touch") return;
        hoverOpen();
      });
      item.addEventListener("pointerleave", function (event) {
        if (event.pointerType === "touch") return;
        hoverClose();
      });

      // The trigger is a real link, so a tap/click opens the panel
      // instead of navigating while it is still closed.
      // The trigger is a real link, but while it owns a panel a click
      // toggles that panel rather than navigating.
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(!item.classList.contains("is-open"));
      });

      trigger.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
          var first = panel.querySelector(".mm-item");
          if (first) first.focus();
        }
      });

      item.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;
        setOpen(false);
        trigger.focus();
      });

      // Keep it open while focus is inside, close once focus leaves.
      item.addEventListener("focusin", function () {
        if (!drawer()) setOpen(true);
      });
      item.addEventListener("focusout", function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) setOpen(false);
        }, 0);
      });

      // A click anywhere else dismisses it.
      document.addEventListener("click", function (event) {
        if (!item.contains(event.target)) setOpen(false);
      });

      // Links inside the panel should close it on the way out.
      Array.prototype.forEach.call(
        panel.querySelectorAll("a"),
        function (link) {
          link.addEventListener("click", function () {
            setOpen(false);
          });
        }
      );
    });
  }

  function initNewsletter() {
    var form = document.querySelector(".footer__form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      // No endpoint to post to — keep the page from navigating away.
      event.preventDefault();

      var input = form.querySelector("input");
      var button = form.querySelector("button");
      if (!input || !button) return;

      if (!input.value.trim() || !input.checkValidity()) {
        input.focus();
        return;
      }

      var label = button.textContent;
      button.textContent = "Subscribed";
      button.disabled = true;
      input.value = "";

      window.setTimeout(function () {
        button.textContent = label;
        button.disabled = false;
      }, 2600);
    });
  }

  function initDots() {
    var dots = Array.prototype.slice.call(
      document.querySelectorAll(".business__dots button")
    );
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        dots.forEach(function (other) {
          other.classList.toggle("is-active", other === dot);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */

  function boot() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-marquee]"),
      initMarquee
    );

    initLenis();
    initNav();
    initAccordion();
    initFaq();
    initFeatureLists();
    initPlatformTabs();
    initMegaMenu();
    initNewsletter();
    initDots();
    initReveals();
    initTilt();

    if (hasScrollTrigger) {
      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

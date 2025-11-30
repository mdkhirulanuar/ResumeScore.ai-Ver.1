document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* NAV: mobile toggle */
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link, [data-scroll]");

  if (navToggle && navbar) {
    navToggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetSel = link.getAttribute("href") || link.getAttribute("data-scroll");
      if (targetSel && targetSel.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(targetSel);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
        navbar && navbar.classList.remove("open");
      }
    });
  });

  /* HERO: animate score */
  const scoreNumberEl = document.getElementById("score-number");
  const scoreMeterFillEl = document.getElementById("score-meter-fill");
  const scoreTagEl = document.getElementById("score-tag");
  if (scoreNumberEl && scoreMeterFillEl && scoreTagEl) {
    const targetScore = 87;
    const duration = 1200;
    const startTime = performance.now();

    function animateScore(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(62 + (targetScore - 62) * progress);
      scoreNumberEl.textContent = current.toString();
      scoreMeterFillEl.style.width = `${current}%`;
      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        scoreTagEl.textContent = "Strong match after optimisation";
      }
    }

    requestAnimationFrame(animateScore);
  }

  /* HERO: persona quick-check */
  const personaForm = document.getElementById("persona-form");
  const personaOutput = document.getElementById("persona-output");

  if (personaForm && personaOutput) {
    personaForm.addEventListener("submit", event => {
      event.preventDefault();
      const role = personaForm.querySelector("#persona-role").value.trim();
      const level = personaForm.querySelector("#persona-level").value;

      let message = "";
      if (!role || !level) {
        message =
          "Fill in your target role and current level to see the most common rejection risk for your profile.";
      } else {
        switch (level) {
          case "fresh":
            message = `For fresh graduates targeting ${role}, the biggest reason for rejection is a generic resume that doesn't show relevant projects or skills for the role.`;
            break;
          case "junior":
            message = `For junior candidates targeting ${role}, the biggest risk is not linking your daily tasks to measurable results the hiring manager cares about.`;
            break;
          case "mid":
            message = `For mid-level professionals targeting ${role}, the most common rejection risk is weak positioning of impact, scope, and ownership in your CV.`;
            break;
          case "senior":
            message = `For senior candidates targeting ${role}, the main risk is a CV that focuses on tasks instead of strategy, leadership, and business outcomes.`;
            break;
          default:
            message = `Most rejections happen when your resume does not clearly show why you are the right fit for a ${role} role.`;
        }
      }
      personaOutput.textContent = message;
    });
  }

  /* PRICING: currency toggle */
  const currencyToggle = document.getElementById("currency-toggle");
  const priceValues = document.querySelectorAll(".price-value");
  const toggleLabels = document.querySelectorAll(".toggle-label");

  let currentCurrency = "myr";

  function updateCurrencyDisplay(currency) {
    priceValues.forEach(el => {
      const myr = el.getAttribute("data-myr");
      const usd = el.getAttribute("data-usd");
      if (currency === "usd" && usd) {
        el.textContent = `USD${usd}`;
      } else if (myr) {
        el.textContent = `RM${myr}`;
      }
    });

    toggleLabels.forEach(label => {
      if (label.getAttribute("data-currency") === currency) {
        label.classList.add("active");
      } else {
        label.classList.remove("active");
      }
    });

    if (currencyToggle) {
      const knob = currencyToggle.querySelector(".toggle-knob");
      if (knob) {
        knob.style.transform = currency === "usd" ? "translateX(22px)" : "translateX(0)";
      }
    }
  }

  if (currencyToggle) {
    currencyToggle.addEventListener("click", () => {
      currentCurrency = currentCurrency === "myr" ? "usd" : "myr";
      updateCurrencyDisplay(currentCurrency);
    });
  }

  toggleLabels.forEach(label => {
    label.addEventListener("click", () => {
      const targetCurrency = label.getAttribute("data-currency");
      if (targetCurrency && targetCurrency !== currentCurrency) {
        currentCurrency = targetCurrency;
        updateCurrencyDisplay(currentCurrency);
      }
    });
  });

  /* PRICING: plan select fills form */
  const planButtons = document.querySelectorAll(".plan-select");
  const planSelect = document.getElementById("plan");

  planButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const planId = btn.getAttribute("data-plan-id");
      if (planSelect && planId) {
        planSelect.value = planId;
        const contact = document.getElementById("contact");
        if (contact) {
          contact.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* TESTIMONIAL SLIDER */
  const testimonialsTrack = document.getElementById("testimonials-track");
  if (testimonialsTrack) {
    const testimonials = Array.from(testimonialsTrack.querySelectorAll(".testimonial"));
    const prevBtn = document.querySelector(".slider-arrow.left");
    const nextBtn = document.querySelector(".slider-arrow.right");
    let currentIndex = 0;

    function showTestimonial(index) {
      testimonials.forEach((t, i) => {
        t.classList.toggle("current", i === index);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
      });
    }

    // Auto-advance
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 8000);
  }

  /* FAQ ACCORDION */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        item.classList.toggle("open");
      });
    }
  });

  /* LEAD FORM + WHATSAPP HOOK */
  const leadForm = document.getElementById("lead-form");
  const formResult = document.getElementById("form-result");
  const formResultText = document.getElementById("form-result-text");
  const whatsappLink = document.getElementById("whatsapp-link");

  const STORAGE_KEY = "jobmatch_lead_data";

  function saveLeadToStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore storage errors
    }
  }

  function loadLeadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // Pre-fill if stored
  if (leadForm) {
    const stored = loadLeadFromStorage();
    if (stored) {
      if (stored.name) leadForm.querySelector("#name").value = stored.name;
      if (stored.email) leadForm.querySelector("#email").value = stored.email;
      if (stored.whatsapp) leadForm.querySelector("#whatsapp").value = stored.whatsapp;
      if (stored.targetRole) leadForm.querySelector("#target-role").value = stored.targetRole;
      if (stored.plan) leadForm.querySelector("#plan").value = stored.plan;
    }

    leadForm.addEventListener("submit", event => {
      event.preventDefault();
      const name = leadForm.querySelector("#name").value.trim();
      const email = leadForm.querySelector("#email").value.trim();
      const whatsapp = leadForm.querySelector("#whatsapp").value.trim();
      const targetRole = leadForm.querySelector("#target-role").value.trim();
      const plan = leadForm.querySelector("#plan").value;

      if (!name || !email || !whatsapp || !targetRole || !plan) {
        if (formResultText) {
          formResultText.textContent =
            "Please fill in all fields so we can prepare a clear WhatsApp message for you.";
        }
        return;
      }

      const leadData = { name, email, whatsapp, targetRole, plan };
      saveLeadToStorage(leadData);

      const messageLines = [
        "Hi, I’m interested in your JobMatch AI service.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `WhatsApp: ${whatsapp}`,
        `Target role: ${targetRole}`,
        `Selected package: ${plan}`,
        "",
        "Please share the next steps and payment details. Thank you."
      ];
      const message = messageLines.join("\n");

      // Replace with your real WhatsApp number (no + or leading zero, e.g. 60123456789)
      const receiverNumber = "60123456789";
      const url = `https://wa.me/${receiverNumber}?text=${encodeURIComponent(message)}`;

      if (whatsappLink) {
        whatsappLink.href = url;
        whatsappLink.classList.remove("hidden");
      }
      if (formResultText) {
        formResultText.textContent =
          "Your WhatsApp message is ready. Click the button below to continue and confirm your package.";
      }
      if (formResult) {
        formResult.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* REVEAL ANIMATION ON SCROLL */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("reveal-visible"));
  }

  /* PWA: Service Worker registration */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .catch(err => {
        console.warn("Service worker registration failed", err);
      });
  }
});

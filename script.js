/* ========================================
   IKSA ARCHITECTS — Premium Interactions
   ======================================== */

(function () {
  "use strict";

  // ============================================================
  // 02/03. STICKY HEADER — Transparent → Frosted on scroll
  // ============================================================
  const header = document.getElementById("header");
  const heroSection = document.getElementById("hero");
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");
  const mobileMenuCta = mobileMenu.querySelector(".mobile-menu-cta");

  function toggleMobileMenu() {
    menuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  }

  function closeMobileMenu() {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", toggleMobileMenu);

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  if (mobileMenuCta) {
    mobileMenuCta.addEventListener("click", closeMobileMenu);
  }

  // ============================================================
  // SMOOTH SCROLL — for all anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================================
  // ACTIVE NAV LINK — highlight on scroll
  // ============================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // ============================================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -60px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // 09. BEFORE & AFTER SLIDER
  // ============================================================
  const baSlider = document.getElementById("baSlider");
  const baHandle = document.getElementById("baHandle");
  const baBefore = document.getElementById("baBefore");

  if (baSlider && baHandle && baBefore) {
    let isDragging = false;

    function updateSlider(x) {
      const rect = baSlider.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      position = Math.max(5, Math.min(95, position));
      baHandle.style.left = position + "%";
      baBefore.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    }

    // Mouse events
    baSlider.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(e.clientX);
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch events
    baSlider.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        updateSlider(e.touches[0].clientX);
      },
      { passive: true },
    );

    baSlider.addEventListener(
      "touchmove",
      (e) => {
        if (isDragging) {
          updateSlider(e.touches[0].clientX);
        }
      },
      { passive: true },
    );

    baSlider.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  // ============================================================
  // 13. STATISTICS — Count-up Animation
  // ============================================================
  const counters = document.querySelectorAll(".counter");
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easedProgress * target);
        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  // Observe stats section
  const statsSection = document.getElementById("stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    statsObserver.observe(statsSection);
  }

  // ============================================================
  // 14. TESTIMONIAL CAROUSEL
  // ============================================================
  const testimonialTrack = document.getElementById("testimonialTrack");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");
  let currentSlide = 0;
  let testimonialInterval;
  const totalSlides = testimonialDots.length;

  function goToSlide(index) {
    currentSlide = index;
    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
  }

  // Auto-play
  function startAutoPlay() {
    testimonialInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    clearInterval(testimonialInterval);
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      goToSlide(parseInt(dot.getAttribute("data-index")));
      startAutoPlay();
    });
  });

  // Pause on hover
  const testimonialCarousel = document.getElementById("testimonialCarousel");
  if (testimonialCarousel) {
    testimonialCarousel.addEventListener("mouseenter", stopAutoPlay);
    testimonialCarousel.addEventListener("mouseleave", startAutoPlay);
    startAutoPlay();
  }

  // ============================================================
  // 16. FAQ ACCORDION
  // ============================================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove("active");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // ============================================================
  // 17. CONTACT FORM VALIDATION
  // ============================================================
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("contactName").value.trim();
      const phone = document.getElementById("contactPhone").value.trim();
      const email = document.getElementById("contactEmail").value.trim();
      const project = document.getElementById("contactProject").value;
      const message = document.getElementById("contactMessage").value.trim();

      // Basic validation
      if (!name) {
        showFormStatus("Please enter your name.", "error");
        return;
      }

      if (!phone || phone.length < 10) {
        showFormStatus("Please enter a valid phone number.", "error");
        return;
      }

      if (!email || !isValidEmail(email)) {
        showFormStatus("Please enter a valid email address.", "error");
        return;
      }

      if (!project) {
        showFormStatus("Please select a project type.", "error");
        return;
      }

      // Simulate form submission
      const submitBtn = document.getElementById("contactSubmit");
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormStatus(
          "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
          "success",
        );
        contactForm.reset();
        submitBtn.innerHTML =
          'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  function showFormStatus(message, type) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = "form-status " + type;
      // Auto-hide after 5 seconds
      setTimeout(() => {
        formStatus.className = "form-status";
      }, 5000);
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const backToTop = document.getElementById("backToTop");

  function handleBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", handleBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================================
  // MAGNETIC BUTTON EFFECT
  // ============================================================
  const magneticButtons = document.querySelectorAll(
    ".btn-primary, .btn-outline, .btn-dark",
  );

  magneticButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });

  // ============================================================
  // PARALLAX EFFECT — subtle on CTA background
  // ============================================================
  const ctaBg = document.querySelector(".cta-bg img");
  const heroBg = document.querySelector(".hero-bg-img");

  function handleParallax() {
    const scrollY = window.scrollY;

    if (heroBg) {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        heroBg.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${scrollY * 0.15}px)`;
      }
    }

    if (ctaBg) {
      const ctaSection = ctaBg.closest(".cta-section");
      if (ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (rect.top / window.innerHeight) * 30;
          ctaBg.style.transform = `translateY(${offset}px) scale(1.1)`;
        }
      }
    }
  }

  window.addEventListener("scroll", handleParallax, { passive: true });

  // ============================================================
  // CURSOR GLOW — subtle glow effect on interactive areas
  // ============================================================
  const glowAreas = document.querySelectorAll(
    ".service-card, .portfolio-item, .why-us-card",
  );

  glowAreas.forEach((area) => {
    area.addEventListener("mousemove", (e) => {
      const rect = area.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      area.style.setProperty("--glow-x", x + "px");
      area.style.setProperty("--glow-y", y + "px");
    });
  });
})();

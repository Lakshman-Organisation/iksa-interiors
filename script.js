/* ========================================
   IKSA INTERIORS — Premium Interactions
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

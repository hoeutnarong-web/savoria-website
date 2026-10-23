
/* ========================================
   SAVORIA | JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const foodCards = document.querySelectorAll(".food-card");
  const dialog = document.getElementById("orderDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogClose = document.getElementById("dialogClose");
  const dialogOk = document.getElementById("dialogOk");
  const toast = document.getElementById("toast");

  let toastTimer;

  // 1. PAGE LOADER
  function hideLoader() {
    if (loader) {
      loader.classList.add("done");
    }
  }

  window.addEventListener("load", hideLoader);

  // Safety fallback if some images take a long time to load
  setTimeout(hideLoader, 2500);

  // 2. CURRENT YEAR
  document.getElementById("year").textContent =
    new Date().getFullYear();

  // 3. MOBILE NAVIGATION
  function closeMobileMenu() {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after clicking a navigation link
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close menu when clicking outside it
  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close menu with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  // 4. HEADER SHADOW WHEN SCROLLING
  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  // 5. SCROLL REVEAL ANIMATION
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      // Stagger cards slightly for a smoother entrance
      if (element.classList.contains("food-card")) {
        element.style.transitionDelay =
          `${(index % 3) * 100}ms`;
      }

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 6. ACTIVE NAVIGATION WHILE SCROLLING
  const sections = document.querySelectorAll(
    "#home, #menu, #story, #contact"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navItems.forEach((link) => {
              const isActive =
                link.getAttribute("href") ===
                `#${entry.target.id}`;

              link.classList.toggle("active", isActive);
            });
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // 7. FILTER FOOD BY CATEGORY
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      // Change selected button
      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      // Show only matching cards
      foodCards.forEach((card) => {
        const matches =
          selectedCategory === "all" ||
          card.dataset.category === selectedCategory;

        if (matches) {
          card.classList.remove("hidden");

          // Restart the entrance animation
          card.classList.remove("visible");

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.add("visible");
            });
          });
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // 8. FAVORITE BUTTONS
  document.querySelectorAll(".heart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const liked = button.classList.toggle("liked");

      button.textContent = liked ? "♥" : "♡";
      button.setAttribute(
        "aria-pressed",
        String(liked)
      );

      const card = button.closest(".food-card");
      const name = card.querySelector("h3").textContent;

      showToast(
        liked
          ? `${name} added to your favorites ♥`
          : `${name} removed from your favorites`
      );
    });
  });

  // 9. ORDER DIALOG
  document.querySelectorAll(".food-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const foodName = button.dataset.food;

      dialogTitle.textContent = `Love ${foodName}?`;

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        showToast("Your selected dish: " + foodName);
      }
    });
  });

  function closeDialog() {
    if (dialog.open) {
      dialog.close();
    }
  }

  dialogClose.addEventListener("click", closeDialog);
  dialogOk.addEventListener("click", closeDialog);

  // Close dialog by clicking the backdrop
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  // 10. TOAST NOTIFICATION
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // 11. SMOOTH SCROLL FOR INTERNAL LINKS
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start"
        });

        // Update URL without jumping to the section
        history.replaceState(null, "", targetId);
      }
    });
  });

  console.log("SAVORIA website is ready! 🍽️");
});

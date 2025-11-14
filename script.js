/* =====================================================
  WEBSITE CV - JAVASCRIPT
=====================================================
  
  📋 DAFTAR FUNGSI (v9 - Dual Lightbox):
  1. Mobile Navigation Toggle
  1.5. Logo Theme Toggle
  2. Smooth Scrolling & Active Nav
  3. Navbar Background on Scroll
  4. Typing Effect Animation
  5. Scroll to Top Button
  6. Skills Progress Bar Animation
  7. Initialize Portfolio (Dynamic Load & Lightbox 1)
  8. Initialize Achievements (Lightbox 2) (BARU!)
  9. Contact Form Handling
  10. Notification System
  11. Intersection Observer
  12. CSS Animation Classes
  13. Utility Functions (Debounce)
  14. Keyboard Navigation (UPDATED!)
  15. Preloader
  16. Theme Functions
  
=====================================================
*/

// ===================================
// Logika Navbar disederhanakan
// ===================================
const navbar = document.getElementById("navbar");

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
}

// PENTING: Menunggu sampai DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  /* ===================================
     1. MOBILE NAVIGATION TOGGLE
     =================================== 
  */
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.getElementById("nav-menu");

  if (mobileMenu && navMenu) {
    mobileMenu.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileMenu && navMenu) {
        mobileMenu.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  });

  /* ===================================
     1.5. LOGO THEME TOGGLE
     ===================================
  */
  const logoLink = document.querySelector(".nav-logo a");
  if (logoLink) {
    logoLink.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      toggleTheme();
    });
  }

  /* ===================================
     2. SMOOTH SCROLLING & ACTIVE NAV
     =================================== 
  */
  function setActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => link.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  }

  /* ===================================
     3. NAVBAR BACKGROUND ON SCROLL
     =================================== 
  */
  handleNavbarScroll();

  /* ===================================
     4. TYPING EFFECT
     =================================== 
  */
  const typedTextSpan = document.querySelector(".typed-text");
  if (typedTextSpan) {
    const textArray = [
      "Electrical Engineer",
      "Robotics Enthusiast",
      "IoT Developer",
      "Python Programmer",
    ];
    let textArrayIndex = 0,
      charIndex = 0;
    const typingDelay = 200,
      erasingDelay = 100,
      newTextDelay = 2000;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent +=
          textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
          0,
          charIndex - 1
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }
    setTimeout(type, newTextDelay + 250);
  }

  /* ===================================
     5. SCROLL TO TOP BUTTON
     =================================== 
  */
  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.classList.toggle("show", window.scrollY > 300);
    });
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===================================
     6. SKILLS PROGRESS BAR ANIMATION
     =================================== 
  */
  function animateProgressBars() {
    const progressBars = document.querySelectorAll(".skill-progress");
    progressBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible && !bar.classList.contains("animated")) {
        bar.style.width = bar.getAttribute("data-width");
        bar.classList.add("animated");
      }
    });
  }
  animateProgressBars();

  /* =================================================
     11. INTERSECTION OBSERVER (SETUP)
     =================================================
  */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Amati elemen statis (kartu education non-clickable kita tambahkan)
  const staticAnimatedElements = document.querySelectorAll(
    ".section-title, .about-text, .skill-item, .education-card:not(.clickable-card), .timeline-item, .contact-item, .contact-form"
  );
  staticAnimatedElements.forEach((el) => observer.observe(el));


  /* =================================================
     7. FUNGSI: Initialize Portfolio (JSON Load + Lightbox 1)
     (VERSI UPGRADE DENGAN SLIDER)
     =================================================
  */
  async function initializePortfolio() {
    const portfolioGrid = document.querySelector(".portfolio-grid");
    if (!portfolioGrid) return;

    // --- Definisikan elemen Lightbox 1 ---
    const lightbox = document.getElementById("portfolioLightbox");
    const backdrop = document.getElementById("portfolioBackdrop");
    const closeBtn = document.getElementById("portfolioClose");
    const imageEl = document.getElementById("lightboxPortfolioImage");
    const titleEl = document.getElementById("lightboxPortfolioTitle");
    const descEl = document.getElementById("lightboxPortfolioDescription");
    const techEl = document.getElementById("lightboxPortfolioTech");
    const liveLinkEl = document.getElementById("lightboxLiveLink");
    const githubLinkEl = document.getElementById("lightboxGithubLink");

    // --- BARU: Elemen dan Variabel Slider ---
    const sliderPrevBtn = document.getElementById("sliderPrevBtn");
    const sliderNextBtn = document.getElementById("sliderNextBtn");
    let currentGallery = [];
    let currentIndex = 0;
    // --- AKHIR BARU ---

    // --- BARU: Fungsi untuk update slider ---
    function updateSlider() {
      if (currentGallery.length === 0 || !imageEl) return;

      // Ganti gambar dengan efek fade
      imageEl.style.opacity = '0';
      setTimeout(() => {
        imageEl.src = currentGallery[currentIndex];
        imageEl.style.opacity = '1';
      }, 300); // 300ms (harus sama dengan transisi CSS)

      // Tampilkan/sembunyikan tombol
      sliderPrevBtn.style.display = (currentIndex === 0) ? 'none' : 'flex';
      sliderNextBtn.style.display = (currentIndex === currentGallery.length - 1) ? 'none' : 'flex';
    }
    // --- AKHIR BARU ---

    function openPortfolioLightbox(item) {
      if (!item || !lightbox) return;

      // --- BARU: Ambil data galeri ---
      const galleryString = item.getAttribute("data-gallery");
      // --- PERUBAHAN: Hapus data-image
      // const image = item.getAttribute("data-image");
      // --- AKHIR PERUBAHAN ---
      
      const title = item.getAttribute("data-title");
      const description = item.getAttribute("data-description");
      const techString = item.getAttribute("data-tech");
      const liveLink = item.getAttribute("data-live-link");
      const githubLink = item.getAttribute("data-github-link");

      // --- BARU: Setup galeri ---
      currentGallery = galleryString ? galleryString.split(',') : [];
      currentIndex = 0;
      updateSlider(); // Panggil fungsi baru untuk set gambar pertama
      // --- AKHIR BARU ---

      // --- PERUBAHAN: Hapus setting src lama
      // if (imageEl) imageEl.src = image;
      // --- AKHIR PERUBAHAN ---

      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = description;

      if (techEl) {
        techEl.innerHTML = "";
        if (techString) {
          techString.split(",").forEach((tech) => {
            const tag = document.createElement("span");
            tag.className = "tech-tag";
            tag.textContent = tech;
            techEl.appendChild(tag);
          });
        }
      }

      toggleLink(liveLinkEl, liveLink);
      toggleLink(githubLinkEl, githubLink);

      lightbox.classList.add("show");
      document.body.classList.add("lightbox-active");
    }

    // Definisikan 'close' di window agar bisa diakses 'Escape' key
    window.closePortfolioLightbox = function () {
      if (lightbox) {
        lightbox.classList.remove("show");
        document.body.classList.remove("lightbox-active");
        currentGallery = []; // Reset galeri saat ditutup
        currentIndex = 0;
      }
    };

    function toggleLink(button, url) {
      if (!button) return;
      if (url && url !== "#") {
        button.href = url;
        button.style.display = "inline-block";
      } else {
        button.style.display = "none";
      }
    }

    if (backdrop) backdrop.addEventListener("click", window.closePortfolioLightbox);
    if (closeBtn) closeBtn.addEventListener("click", window.closePortfolioLightbox);

    // --- BARU: Tambahkan listener untuk tombol slider ---
    if (sliderPrevBtn) {
      sliderPrevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        }
      });
    }
    if (sliderNextBtn) {
      sliderNextBtn.addEventListener("click", () => {
        if (currentIndex < currentGallery.length - 1) {
          currentIndex++;
          updateSlider();
        }
      });
    }
    // --- AKHIR BARU ---


    // --- Ambil data dan bangun grid ---
    try {
      const response = await fetch("projects.json");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const projects = await response.json();

      let projectsHTML = "";
      projects.forEach((project) => {
        const techTags = project.tech.map((tag) => `<span class="tech-tag">${tag}</span>`).join("");
        const techString = project.tech.join(",");
        
        // --- BARU: Ambil galeri ---
        const galleryString = (project.galleryImages && project.galleryImages.length > 0) ? project.galleryImages.join(',') : '';
        const thumbnail = project.imageSmall || (project.galleryImages && project.galleryImages.length > 0 ? project.galleryImages[0] : ''); // Gambar thumbnail
        // --- AKHIR BARU ---

        projectsHTML += `
          <button class="portfolio-item" 
            data-category="${project.category}" 
            data-gallery="${galleryString}" 
            data-title="${project.title}" 
            data-description="${project.descriptionModal}" 
            data-tech="${techString}" 
            data-github-link="${project.githubLink}" 
            data-live-link="${project.liveLink}">
            <div class="portfolio-image">
              <img src="${thumbnail}" alt="${project.title}" loading="lazy" />
              <div class="portfolio-overlay">
                <div class="portfolio-info"><h4>${project.title}</h4><p>${project.category}</p><div class="portfolio-links"><i class="fas fa-search-plus"></i></div></div>
              </div>
            </div>
            <div class="portfolio-content"><h4>${project.title}</h4><p>${project.descriptionCard}</p><div class="portfolio-tech">${techTags}</div></div>
          </button>`;
      });
      portfolioGrid.innerHTML = projectsHTML;

      // --- Inisialisasi Filter & Lightbox 1 ---
      const filterButtons = document.querySelectorAll(".filter-btn");
      const portfolioItems = document.querySelectorAll("button.portfolio-item");

      if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
            portfolioItems.forEach((item) => {
              const category = item.getAttribute("data-category");
              const matches = filter === "all" || category === filter;
              if (matches) {
                item.style.display = "block";
                setTimeout(() => { item.style.opacity = "1"; item.style.transform = "translateY(0)"; }, 10);
              } else {
                item.style.opacity = "0"; item.style.transform = "translateY(20px)";
                setTimeout(() => { item.style.display = "none"; }, 300);
              }
            });
          });
        });
      }

      portfolioItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          if (e.target.closest("a")) { e.stopPropagation(); return; }
          openPortfolioLightbox(item);
        });
        observer.observe(item); // Amati item portofolio dinamis
      });

    } catch (error) {
      console.error("Gagal memuat proyek portofolio:", error);
      portfolioGrid.innerHTML = "<p style='color: var(--muted-color); text-align: center;'>Gagal memuat proyek.</p>";
    }
  }

  /* =================================================
     8. FUNGSI: Initialize Achievements (Lightbox 2) (BARU!)
     =================================================
  */
  function initializeAchievements() {
    // --- Definisikan elemen Lightbox 2 ---
    const achievementCards = document.querySelectorAll("#achievements .clickable-card");
    const lightbox = document.getElementById("achievementLightbox");
    const backdrop = document.getElementById("achievementBackdrop");
    const closeBtn = document.getElementById("achievementClose");
    const imageEl = document.getElementById("lightboxAchievementImage");
    const titleEl = document.getElementById("lightboxAchievementTitle");
    const detailsEl = document.getElementById("lightboxAchievementDetails");

    if (!lightbox || achievementCards.length === 0) return;

    // Di dalam fungsi openAchievementLightbox(card) ...

    function openAchievementLightbox(card) {
      const image = card.getAttribute("data-image");
      const title = card.getAttribute("data-title");
      const details = card.getAttribute("data-details"); // Ambil data mentah

      if (imageEl) imageEl.src = image;
      if (titleEl) titleEl.textContent = title;
      
      // --- BAGIAN INI YANG DIUBAH ---
      if (detailsEl) {
        // Kita pecah teks berdasarkan tanda "|" lalu jadikan elemen HTML div terpisah
        if (details) {
           const formattedDetails = details.split('|').map(item => {
              // Tambahkan styling margin-bottom agar ada jarak antar baris
              return `<div style="margin-bottom: 8px;">${item.trim()}</div>`;
           }).join('');
           
           detailsEl.innerHTML = formattedDetails; // Pakai innerHTML supaya tag <div> terbaca
        } else {
           detailsEl.innerHTML = "";
        }
      }
      // ------------------------------

      lightbox.classList.add("show");
      document.body.classList.add("lightbox-active");
    }

    // Definisikan 'close' di window agar bisa diakses 'Escape' key
    window.closeAchievementLightbox = function () {
      if (lightbox) {
        lightbox.classList.remove("show");
        document.body.classList.remove("lightbox-active");
      }
    };

    // Pasang listener
    if (backdrop) backdrop.addEventListener("click", window.closeAchievementLightbox);
    if (closeBtn) closeBtn.addEventListener("click", window.closeAchievementLightbox);

    achievementCards.forEach((card) => {
      card.addEventListener("click", () => {
        openAchievementLightbox(card);
      });
      observer.observe(card); // Amati kartu achievement
    });
  }

  // Panggil kedua fungsi inisialisasi
  initializePortfolio();
  initializeAchievements();


  /* ============================================
     9. CONTACT FORM HANDLING (FORMSPREE)
     ============================================
  */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          this.reset();
          showNotification("Message sent successfully! Thank you.", "success");
        } else {
          showNotification("Failed to send message. Please try again later.", "error");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        showNotification("A network error occurred. Please try again.", "error");
      } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }

  /* ===================================
     10. NOTIFICATION SYSTEM
     =================================== 
  */
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<div class="notification-content"><i class="fas ${
      type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
    }"></i><span>${message}</span></div>`;
    notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${type === "success" ? "#2ecc71" : "#e74c3c"};
            color: white; padding: 15px 20px; border-radius: 5px;
            z-index: 10000; transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        `;
    notification.querySelector(
      ".notification-content"
    ).style.cssText = `display: flex; align-items: center; gap: 10px;`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    const removeNotification = () => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    };
    setTimeout(removeNotification, 5000);
    notification.addEventListener("click", removeNotification);
  }

  /* ===================================
     12. CSS ANIMATION CLASSES (Injected)
     =================================== 
  */
  const style = document.createElement("style");
  style.textContent = `
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .section-title, .about-text, .skill-item, 
        .portfolio-item, .education-card, .timeline-item, 
        .contact-item, .contact-form {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .portfolio-item, .education-card.clickable-card {
           transition: all 0.3s ease; /* Transisi filter & hover */
        }
        a, button, .btn, .nav-link, .social-link, .portfolio-links i {
            transition: all 0.3s ease;   
        }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        @keyframes spin {
            from { transform: rotate(0deg); }   
            to { transform: rotate(360deg); }   
        }
        .fa-spinner, .preloader-spinner {
            animation: spin 1s linear infinite; 
        }
    `;
  document.head.appendChild(style);

  /* ===================================
     13. UTILITY FUNCTIONS (Debounce)
     =================================== 
  */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const optimizedScrollHandler = debounce(() => {
    setActiveNav();
    animateProgressBars();
    handleNavbarScroll();
  }, 10);
  window.addEventListener("scroll", optimizedScrollHandler);

  /* ===================================
     14. KEYBOARD NAVIGATION (UPDATED!)
     =================================== 
  */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;

    // Cek apakah lightbox achievement terbuka
    if (document.getElementById("achievementLightbox").classList.contains("show")) {
      if (typeof window.closeAchievementLightbox === "function") {
        window.closeAchievementLightbox();
      }
    } 
    // Jika tidak, cek apakah lightbox portfolio terbuka
    else if (document.getElementById("portfolioLightbox").classList.contains("show")) {
      if (typeof window.closePortfolioLightbox === "function") {
        window.closePortfolioLightbox();
      }
    } 
    // Jika tidak, tutup menu mobile
    else if (mobileMenu && navMenu && navMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  /* ===================================
     15. PRELOADER
     =================================== 
  */
  window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    }
  });

  console.log(
    "✅ Website CV JavaScript (v9 - Dual Lightbox) loaded successfully!"
  );
}); // <- AKHIR DARI DOMContentLoaded

/* ===================================
   16. FUNGSI TOGGLE TEMA
   ===================================
*/
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
  handleNavbarScroll();
}

(function () {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
})();

/* ===================================
   GLOBAL FUNCTIONS (EXPORTED)
   =================================== 
*/
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 70;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
}

function downloadCV() {
  const cvUrl = "Nayaka Alkaesyah Suryanto-resume-1.pdf";
  const link = document.createElement("a");
  link.href = cvUrl;
  link.download = "CV_Nayaka_Alkaesyah_Suryanto.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openProject(projectUrl) {
  window.open(projectUrl, "_blank");
}

window.CVWebsite = {
  scrollToSection,
  downloadCV,
  openProject,
};
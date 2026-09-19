/* =========================================================
   LUXURY RESTAURANT MAIN SCRIPT - 3D UPGRADE
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* -----------------------------------------------------------
     1. Preloader
  ----------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 500);
    });
  }

  /* -----------------------------------------------------------
     2. Sticky Navigation
  ----------------------------------------------------------- */
  const header = document.querySelector('header');
  const scrollTopBtn = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to Top Button Visibility
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }
  });

  /* -----------------------------------------------------------
     3. Scroll to Top
  ----------------------------------------------------------- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* -----------------------------------------------------------
     4. Mobile Hamburger Menu
  ----------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('nav-active');
      hamburger.classList.toggle('toggle');
    });
  }

  /* -----------------------------------------------------------
     5. Scroll Reveal Animations (Intersection Observer)
  ----------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
      }
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });

  /* -----------------------------------------------------------
     6. Active Link Highlighting based on current URL
  ----------------------------------------------------------- */
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-links a');
  
  navItems.forEach(item => {
    if(item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
  });

  if (currentPath === '/' || currentPath.endsWith('index.html')) {
    navItems.forEach(item => {
      if (item.getAttribute('href') === 'index.html') {
        item.classList.add('active');
      }
    });
  }

  /* -----------------------------------------------------------
     7. Vanilla JS 3D Tilt Effect
  ----------------------------------------------------------- */
  function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.glass-panel');
    
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', handleTilt);
      el.addEventListener('mouseleave', resetTilt);
    });
  }

  function handleTilt(e) {
    const el = this;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxTilt = 10; // degrees
    
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    
    // Add dynamic glare based on mouse position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.boxShadow = `
      ${-rotateY}px ${rotateX + 15}px 30px rgba(0,0,0,0.8),
      inset 0 0 20px rgba(255, 195, 0, 0.05),
      inset ${glareX - 50}px ${glareY - 50}px 100px rgba(255,255,255,0.05)
    `;
    el.style.transition = 'none'; // remove transition for smooth tracking
  }

  function resetTilt() {
    const el = this;
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.boxShadow = `
      0 8px 32px 0 rgba(0, 0, 0, 0.6),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
      inset 0 0 20px 0 rgba(255, 195, 0, 0.02)
    `;
    el.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  }

  // Initialize tilt effect after a slight delay to ensure DOM is ready and cards exist
  setTimeout(initTiltEffect, 500);

  // We need to re-initialize it whenever the DOM changes (e.g., menu filtering)
  // Expose it to global scope
  window.initTiltEffect = initTiltEffect;

  /* -----------------------------------------------------------
     8. Custom Glowing Cursor Follower
  ----------------------------------------------------------- */
  const cursorGlow = document.createElement('div');
  cursorGlow.classList.add('cursor-glow');
  document.body.appendChild(cursorGlow);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow animation
  function animateCursor() {
    // Easing factor (lower is smoother/slower)
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    
    cursorGlow.style.left = `${cursorX}px`;
    cursorGlow.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand glow when hovering over interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .dish-card, .menu-item, .btn');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
  });

});

/* -----------------------------------------------------------
   Global Cart Logic
----------------------------------------------------------- */
let cart = JSON.parse(localStorage.getItem('luxury_cart')) || [];

function updateCartCount() {
  const countEls = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEls.forEach(el => {
    el.textContent = totalItems;
  });
}

function saveCart() {
  localStorage.setItem('luxury_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, name, price, image) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`${name} added to cart!`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '15px 30px';
  toast.style.zIndex = '9999';
  toast.style.color = 'var(--secondary-color)';
  toast.style.border = '1px solid var(--secondary-color)';
  toast.style.animation = 'fadeUp 0.5s ease forwards';
  toast.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px;"></i> ${message}`;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', updateCartCount);

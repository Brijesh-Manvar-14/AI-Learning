if (!customElements.get('waymakers-slider')) {
  customElements.define(
    'waymakers-slider',
    class WaymakersSlider extends HTMLElement {
      connectedCallback() {
        this.track = this.querySelector('[data-wm-slider-track]');
        this.prev = this.querySelector('[data-wm-slider-prev]');
        this.next = this.querySelector('[data-wm-slider-next]');
        if (!this.track) return;

        this.prev?.addEventListener('click', () => this.slide(-1));
        this.next?.addEventListener('click', () => this.slide(1));
      }

      slide(direction) {
        const first = this.track.children[0];
        const gap = parseFloat(getComputedStyle(this.track).columnGap || getComputedStyle(this.track).gap) || 20;
        const step = first ? first.getBoundingClientRect().width + gap : this.track.clientWidth;
        this.track.scrollBy({ left: step * direction, behavior: 'smooth' });
      }
    }
  );
}

const updateWaymakersCartCount = (itemCount) => {
  document.querySelectorAll('[data-wm-cart-count]').forEach((count) => {
    const value = count.querySelector('span');
    if (value) value.textContent = itemCount;
    count.setAttribute('aria-hidden', itemCount > 0 ? 'false' : 'true');
  });
};

const fetchWaymakersCartCount = () => {
  if (!window.routes?.cart_url) return;

  fetch(`${window.routes.cart_url}.js`)
    .then((response) => response.json())
    .then((cart) => updateWaymakersCartCount(cart.item_count || 0))
    .catch((error) => console.error(error));
};

if (!window.waymakersHomeInitialized) {
  window.waymakersHomeInitialized = true;

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const menuToggle = event.target.closest('[data-wm-menu-toggle]');
    if (menuToggle) {
      const header = menuToggle.closest('.wm-header');
      const isOpen = header?.classList.toggle('is-menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      return;
    }

    const cartLink = event.target.closest('[data-wm-cart-link]');
    if (cartLink) {
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        event.preventDefault();
        cartDrawer.open(cartLink);
      }
      return;
    }

    const videoToggle = event.target.closest('[data-wm-video-toggle]');
    if (!videoToggle) return;

    const card = videoToggle.closest('[data-wm-video-card]');
    const video = card?.querySelector('video');
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        card.classList.add('is-playing');
        videoToggle.setAttribute('aria-label', 'Pause review video');
      }).catch((error) => console.error(error));
    } else {
      video.pause();
      card.classList.remove('is-playing');
      videoToggle.setAttribute('aria-label', 'Play review video');
    }
  });

  document.addEventListener('play', (event) => {
    if (!(event.target instanceof Element)) return;

    const video = event.target.closest('[data-wm-video-card] video');
    if (!video) return;

    document.querySelectorAll('[data-wm-video-card] video').forEach((otherVideo) => {
      if (otherVideo !== video) {
        otherVideo.pause();
        const otherCard = otherVideo.closest('[data-wm-video-card]');
        otherCard?.classList.remove('is-playing');
        otherCard?.querySelector('[data-wm-video-toggle]')?.setAttribute('aria-label', 'Play review video');
      }
    });
  }, true);

  document.addEventListener('pause', (event) => {
    if (!(event.target instanceof Element)) return;

    const video = event.target.closest('[data-wm-video-card] video');
    if (!video) return;

    const card = video.closest('[data-wm-video-card]');
    card?.classList.remove('is-playing');
    card?.querySelector('[data-wm-video-toggle]')?.setAttribute('aria-label', 'Play review video');
  }, true);

  if (typeof PUB_SUB_EVENTS !== 'undefined' && typeof subscribe === 'function') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, (event) => {
      if (typeof event?.cartData?.item_count === 'number') {
        updateWaymakersCartCount(event.cartData.item_count);
        return;
      }

      fetchWaymakersCartCount();
    });
  }
}

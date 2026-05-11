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
    const step = first ? first.getBoundingClientRect().width + 20 : this.track.clientWidth;
    this.track.scrollBy({ left: step * direction, behavior: 'smooth' });
  }
}

customElements.define('waymakers-slider', WaymakersSlider);

document.addEventListener('click', (event) => {
  const card = event.target.closest('[data-wm-video-card]');
  if (!card) return;

  const video = card.querySelector('video');
  if (!video) return;

  if (video.paused) {
    video.play();
    card.classList.add('is-playing');
  } else {
    video.pause();
    card.classList.remove('is-playing');
  }
});

const AnimateOnScroll = function ({ offset } = { offset: 10 }) {
  // 定义屏幕的顶部、底部和侧面
  const windowTop = offset * window.innerHeight / 100;
  const windowBottom = window.innerHeight - windowTop;
  const windowLeft = 0;
  const windowRight = window.innerWidth;

  this.start = element => {
    window.requestAnimationFrame(() => {
      // 设置自定义属性
      element.style.animationDelay = element.dataset.animationDelay;
      element.style.animationDuration = element.dataset.animationDuration;

      // 通过将类设置为动画来启动动画
      element.classList.add(element.dataset.animation);

      // 将元素设置为动画
      element.dataset.animated = "true";
    });
  };

  this.inViewport = element => {
    // 获取元素的边界框
    const elementRect = element.getBoundingClientRect();
    const elementTop =
    elementRect.top + parseInt(element.dataset.animationOffset) ||
    elementRect.top;
    const elementBottom =
    elementRect.bottom - parseInt(element.dataset.animationOffset) ||
    elementRect.bottom;
    const elementLeft = elementRect.left;
    const elementRight = elementRect.right;

    // 检查元素是否在屏幕上
    return (
      elementTop <= windowBottom &&
      elementBottom >= windowTop &&
      elementLeft <= windowRight &&
      elementRight >= windowLeft);

  };

  // 遍历元素数组，检查元素是否在屏幕上并开始动画
  this.verifyElementsInViewport = (els = elements) => {
    for (let i = 0, len = els.length; i < len; i++) {
      // 如果元素已经动画，则移至下一个循环
      if (els[i].dataset.animated) continue;

      this.inViewport(els[i]) && this.start(els[i]);
    }
  };

  // 获取所有要动画的元素
  this.getElements = () =>
  document.querySelectorAll("[data-animation]:not([data-animated])");

  // 更新要动画的元素列表
  this.update = () => {
    elements = this.getElements();
    elements && this.verifyElementsInViewport(elements);
  };

  // 开始
  window.addEventListener("load", this.update, false);
  window.addEventListener(
  "scroll",
  () => this.verifyElementsInViewport(elements),
  { passive: true });

  window.addEventListener(
  "resize",
  () => this.verifyElementsInViewport(elements),
  { passive: true });

};

// Initialize
const options = {
  offset: 15 // percentage of the window
};

const animation = new AnimateOnScroll(options);

const MIN_SPEED = 1.5
const MAX_SPEED = 2.5

function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

class Blob {
  constructor(el) {
    this.el = el
    const boundingRect = this.el.getBoundingClientRect()
    this.size = boundingRect.width
    this.initialX = randomNumber(0, window.innerWidth - this.size)
    this.initialY = randomNumber(0, window.innerHeight - this.size)
    this.el.style.top = `${this.initialY}px`
    this.el.style.left = `${this.initialX}px`
    this.vx =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.vy =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.x = this.initialX
    this.y = this.initialY
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size
      this.vx *= -1
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size
      this.vy *= -1
    }
    if (this.x <= 0) {
      this.x = 0
      this.vx *= -1
    }
    if (this.y <= 0) {
      this.y = 0
      this.vy *= -1
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${
      this.y - this.initialY
    }px)`
  }
}

function initBlobs() {
  const blobEls = document.querySelectorAll('.bouncing-blob')
  const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl))

  function update() {
    requestAnimationFrame(update)
    blobs.forEach((blob) => {
      blob.update()
      blob.move()
    })
  }

  requestAnimationFrame(update)
}

initBlobs();



const TOGGLE = document.querySelector("button");

const UPDATE = () => {
  const DARK = TOGGLE.matches("[aria-pressed=true]");
  TOGGLE.setAttribute("aria-pressed", DARK ? false : true);
  document.documentElement.className = DARK ? "dark" : "";
};

const TOGGLE_THEME = () => {
  if (!document.startViewTransition) return UPDATE();
  document.startViewTransition(() => UPDATE());
};

TOGGLE.addEventListener("click", TOGGLE_THEME);

if (!CSS.supports("animation-timeline: view()")) {
  const MARKS = document.querySelectorAll("mark");
  const OPTS = {
    threshold: 1.0 };

  const HANDLE = entries => {
    entries.forEach(entry => {
      entry.target.style.setProperty(
      "--highlighted",
      entry.isIntersecting ? 1 : 0);

    });
  };
  const OBSERVER = new IntersectionObserver(HANDLE, OPTS);
  MARKS.forEach(M => OBSERVER.observe(M));
}

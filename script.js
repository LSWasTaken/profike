// WebGL Background (Three.js)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-bg').appendChild(renderer.domElement);

// Particle System
const particleCount = 2500;
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < particleCount; i++) {
  vertices.push(
    Math.random() * 400 - 200,
    Math.random() * 400 - 200,
    Math.random() * 400 - 200
  );
}
geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
);
const material = new THREE.PointsMaterial({
  color: 0x1dcd9f,
  size: 1.5,
  opacity: 0.8,
  transparent: true,
});
const points = new THREE.Points(geometry, material);
scene.add(points);
camera.position.z = 200;

function animate() {
  requestAnimationFrame(animate);
  points.rotation.y += 0.002;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Audio
const clickSound = new Howl({ src: ['click.mp3'], volume: 0.6 });
const ambientSound = new Howl({
  src: ['ambient.mp3'],
  loop: true,
  volume: 0.3,
});
ambientSound.fade(0, 0.3, 3000);
ambientSound.play().catch(() => console.log('Ambient blocked'));

// Button Interactions
const buttons = document.querySelectorAll('.link-btn');
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    clickSound.play();
    console.log(`Clicked: ${button.dataset.platform}`);
    anime({
      targets: button,
      scale: [0.95, 1],
      duration: 200,
      easing: 'easeOutElastic(1, .6)',
    });
  });

  button.addEventListener('mouseover', () => {
    anime({
      targets: button,
      scale: [1, 1.1],
      duration: 300,
      easing: 'easeOutQuad',
    });
  });

  button.addEventListener('mouseleave', () => {
    anime({
      targets: button,
      scale: [1.1, 1],
      duration: 300,
      easing: 'easeOutQuad',
    });
  });

  button.addEventListener('touchstart', () => {
    button.classList.add('touched');
    button.style.filter = 'brightness(1.3)';
  });

  button.addEventListener('touchend', () => {
    button.classList.remove('touched');
    button.style.filter = 'brightness(1)';
    clickSound.play();
  });
});

// Animations
anime
  .timeline()
  .add({
    targets: '#profile-pic',
    scale: [0, 1],
    rotate: '1turn',
    duration: 1000,
    easing: 'easeOutExpo',
  })
  .add(
    {
      targets: '#name-text',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo',
    },
    '-=600'
  )
  .add(
    {
      targets: '.link-btn',
      translateX: [-50, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
    },
    '-=400'
  );

// Theme Toggle w/ Cool FX + Persistent + Auto
const themeToggle = document.getElementById('theme-toggle');

function setTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  themeToggle.textContent = dark ? '🌞' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');

  // Add a fade & glow transition effect
  document.body.style.transition =
    'background-color 0.5s ease, color 0.5s ease';
  themeToggle.style.transition = 'transform 0.4s ease, filter 0.4s ease';
  themeToggle.style.filter = dark ? 'drop-shadow(0 0 6px #1dcd9f)' : 'none';
  themeToggle.classList.add('active');
  setTimeout(() => themeToggle.classList.remove('active'), 300);
}

// Auto-detect or load saved preference
let isDarkMode =
  localStorage.getItem('theme') === 'dark' ||
  (localStorage.getItem('theme') === null &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);
setTheme(isDarkMode);

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  setTheme(isDarkMode);
  clickSound.play();
});

// Bio Typewriter
const bioText = document.getElementById('bio-text');
if (bioText) {
  const text = bioText.textContent;
  bioText.textContent = '';
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      bioText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 60);
    }
  }
  setTimeout(typeWriter, 1000);
}

// Mouse/Touch Trails
const trailColor = '#1dcd9f';
function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'trail';
  trail.style.left = `${x}px`;
  trail.style.top = `${y}px`;
  trail.style.backgroundColor = trailColor;
  trail.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 500);
}
document.addEventListener('mousemove', (e) =>
  createTrail(e.clientX, e.clientY)
);
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  createTrail(touch.clientX, touch.clientY);
});

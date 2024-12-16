// 폭죽 캔버스 설정
const fireworksCanvas = document.getElementById('fireworksCanvas');
const fireworksCtx = fireworksCanvas.getContext('2d');

// 캔버스 크기 설정
function resizeFireworksCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

// 초기 크기 설정 및 리사이즈 이벤트 리스너
resizeFireworksCanvas();
window.addEventListener('resize', resizeFireworksCanvas);

// 파티클 클래스
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 2.5 + 1.5;
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 4 + 1;
    this.dx = Math.cos(angle) * velocity;
    this.dy = Math.sin(angle) * velocity;
    this.alpha = 1;
    this.life = Math.random() * 40 + 80;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.05;
    this.alpha -= 0.5 / this.life;
    this.life--;
  }

  draw() {
    fireworksCtx.save();
    fireworksCtx.globalAlpha = Math.max(this.alpha, 0);
    fireworksCtx.beginPath();
    fireworksCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    fireworksCtx.fillStyle = this.color;
    fireworksCtx.fill();
    fireworksCtx.restore();
  }
}

// 폭죽 효과 생성 함수
export function createFireworks(x, y, particleCount = 150) {
  const particles = [];
  const colors = ['#FF6B6B', '#FFD93D', '#4FACFE', '#6DD5FA', '#FF9A9E', '#A18CD1'];

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
  }

  let animationFrame;
  function animate() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    particles.forEach((particle, index) => {
      particle.update();
      particle.draw();
      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

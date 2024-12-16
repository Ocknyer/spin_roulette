import { createFireworks } from './fireworks.js';

const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
const pieceCount = document.getElementById('pieceCount');
const updatePieces = document.getElementById('updatePieces');
const modal = document.querySelector('.modal');
const modalBackdrop = document.querySelector('.modal-backdrop');
const closeModal = document.getElementById('closeModal');
const winningNumber = document.getElementById('winningNumber');

const maxPieceCount = 60;

// 모던한 컬러 팔레트 수정 - 중도를 더 높인 버전
const colors = [
  '#FFC4C4', // 진한 살구색
  '#B4D0FF', // 진한 하늘색
  '#98E0A7', // 진한 민트
  '#EFBCEF', // 진한 라벤더
  '#FFCD94', // 진한 피치
  '#9CCAF4', // 진한 베이비블루
  '#C5B1F4', // 진한 라일락
  '#92D6C4', // 진한 세이지
  '#FF9E8E', // 진한 코랄
  '#BCD48E', // 진한 올리브그린
];

let currentRotation = 0;
let isSpinning = false;
let pieces = 10;

// 캔버스 크기 설정
canvas.width = 600;
canvas.height = 600;

// 룰렛 그리기 함수
function drawRoulette() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = canvas.width / 2 - 20;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(currentRotation);

  const angleSize = (2 * Math.PI) / pieces;

  for (let i = 0; i < pieces; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * angleSize, (i + 1) * angleSize);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    // 숫자 그리기
    ctx.save();
    ctx.rotate(i * angleSize + angleSize / 2);
    ctx.translate(radius * 0.9, 0);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666666'; // 숫자 색상을 좀 더 부드럽게 변경
    ctx.font = 'bold 24px Arial';
    ctx.fillText((i + 1).toString(), 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

// 초기 룰렛 그리기
drawRoulette();

// 이벤트 리스너 설정
updatePieces.addEventListener('click', () => {
  const newPieceCount = parseInt(pieceCount.value);
  if (newPieceCount >= 1 && newPieceCount <= maxPieceCount) {
    pieces = newPieceCount;
    drawRoulette();
  } else {
    alert(`1에서 ${maxPieceCount} 사이의 숫자를 입력해주세요.`);
  }
});

resetButton.addEventListener('click', () => {
  currentRotation = 0;
  drawRoulette();
});

// 모달 표시 함수
function showModal(number) {
  modal.style.display = 'block';
  modalBackdrop.style.display = 'block';
  winningNumber.textContent = `🎉 ${number}번 당첨! 🎉`;

  // 여러 위치에서 폭죽 발사
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // 첫 번째 폭죽
  createFireworks(centerX, centerY);

  // 추가 폭죽들을 시간차를 두고 발사
  setTimeout(() => createFireworks(centerX - 200, centerY), 300);
  setTimeout(() => createFireworks(centerX + 200, centerY), 600);
  setTimeout(() => createFireworks(centerX, centerY - 100), 900);
}

// 모달 닫기 함수
function hideModal() {
  modal.style.display = 'none';
  modalBackdrop.style.display = 'none';
}

// 모달 닫기 이벤트
closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', hideModal);

// 당첨 번호 계산 함수 수정
function getWinningNumber() {
  const angle = currentRotation % (Math.PI * 2);
  const normalizedAngle = angle < 0 ? angle + Math.PI * 2 : angle;

  // 12시 방향(위쪽)이 0도, 시계방향으로 각도가 증가
  let degree = ((normalizedAngle * 180) / Math.PI) % 360;

  // 각 조각의 크기 (도)
  const pieceSize = 360 / pieces;

  // 각도를 조각 번호로 변환 (0부터 시작)
  let pieceIndex = Math.floor(degree / pieceSize);

  // 시계 방향으로 회전하므로, 번호를 반대로 계산
  pieceIndex = (pieces - pieceIndex) % pieces;

  // 1부터 시작하는 번호로 변환
  return pieceIndex === 0 ? pieces : pieceIndex;
}

spinButton.addEventListener('click', () => {
  if (!isSpinning) {
    isSpinning = true;
    // 회전 수를 줄임 (기존 5~10바퀴에서 3~6바퀴로)
    const spins = 3 + Math.random() * 3;
    // 시간은 유지 (4~6초)
    const duration = 4000 + Math.random() * 2000;
    const startRotation = currentRotation;
    const targetRotation = startRotation + Math.PI * 2 * spins;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 이징 함수는 유지 (부드러운 감속)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      currentRotation = startRotation + (targetRotation - startRotation) * easeOut;

      drawRoulette();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isSpinning = false;
        currentRotation = currentRotation % (Math.PI * 2);
        const winningNum = getWinningNumber();
        setTimeout(() => {
          showModal(winningNum);
        }, 800);
      }
    }

    requestAnimationFrame(animate);
  }
});

// 엔터키 이벤트 추가
pieceCount.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const newPieceCount = parseInt(pieceCount.value);
    if (newPieceCount >= 1 && newPieceCount <= maxPieceCount) {
      pieces = newPieceCount;
      drawRoulette();
    } else {
      alert(`1에서 ${maxPieceCount} 사이의 숫자를 입력해주세요.`);
    }
  }
});

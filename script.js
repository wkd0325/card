/**
 * Eunjae Jang - Digital Business Card Script
 * Data Scientist Interactive Web Business Card
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const card = document.getElementById('businessCard');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const saveContactBtn = document.getElementById('saveContactBtn');
  const qrBtn = document.getElementById('qrBtn');
  const qrModal = document.getElementById('qrModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const shareBtn = document.getElementById('shareBtn');
  const avatarBox = document.getElementById('avatarBox');
  const speechBubble = document.getElementById('speechBubble');
  const canvas = document.getElementById('particleCanvas');

  /* ==========================================================================
     1. Toast Notification Helper
     ========================================================================== */
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  /* ==========================================================================
     2. Copy to Clipboard
     ========================================================================== */
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: #34d399;"></i>';
        btn.classList.add('copied');
        showToast(`복사되었습니다: ${textToCopy}`);

        setTimeout(() => {
          btn.innerHTML = originalIcon;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`복사되었습니다: ${textToCopy}`);
      }
    });
  });

  /* ==========================================================================
     3. vCard (.vcf) Contact Download
     ========================================================================== */
  if (saveContactBtn) {
    saveContactBtn.addEventListener('click', () => {
      const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN;CHARSET=UTF-8:장은재',
        'N;CHARSET=UTF-8:장;은재;;;',
        'TITLE;CHARSET=UTF-8:데이터사이언티스트 (Data Scientist)',
        'EMAIL;TYPE=INTERNET,HOME:changej45@gmail.com',
        'TEL;TYPE=CELL:010-3705-3596',
        'NOTE;CHARSET=UTF-8:복잡한 데이터 속에서 의미 있는 가치를 찾고, 데이터 기반의 예측과 통찰로 더 나은 결정을 만듭니다.',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '장은재_데이터사이언티스트.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('연락처 파일(vCard)이 다운로드되었습니다!');
    });
  }

  /* ==========================================================================
     4. QR Code Modal
     ========================================================================== */
  if (qrBtn && qrModal && modalCloseBtn) {
    qrBtn.addEventListener('click', () => {
      qrModal.classList.add('active');
    });

    modalCloseBtn.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });

    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && qrModal.classList.contains('active')) {
        qrModal.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     5. Share Link Feature
     ========================================================================== */
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: '장은재 | 데이터사이언티스트 웹 명함',
        text: '장은재 데이터사이언티스트의 디지털 웹 명함입니다.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User canceled or failed silently
        }
      } else {
        // Fallback: Copy link
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('명함 링크가 복사되었습니다!');
        } catch (err) {
          showToast('링크 복사에 실패했습니다.');
        }
      }
    });
  }

  /* ==========================================================================
     6. Character Interaction (Speech Bubble & Quotes)
     ========================================================================== */
  const greetings = [
    "안녕하세요! 데이터로 통찰을 만드는 장은재입니다 ✨",
    "AI 모델링과 데이터 분석으로 비즈니스 문제를 해결합니다 🚀",
    "복잡한 숫자를 명쾌한 전략으로 바꿉니다 📊",
    "언제든 편하게 메일이나 전화로 연락주세요 ☕",
    "데이터 속 숨겨진 이야기를 찾아내는 것을 좋아합니다 💡"
  ];
  let greetingIndex = 0;
  let bubbleTimer = null;

  if (avatarBox && speechBubble) {
    // Show welcome bubble briefly at initial load
    setTimeout(() => {
      speechBubble.classList.add('show');
      bubbleTimer = setTimeout(() => {
        speechBubble.classList.remove('show');
      }, 4000);
    }, 800);

    // Click to cycle phrases and show cheerful bounce
    avatarBox.addEventListener('click', () => {
      if (bubbleTimer) clearTimeout(bubbleTimer);
      greetingIndex = (greetingIndex + 1) % greetings.length;
      speechBubble.textContent = greetings[greetingIndex];
      speechBubble.classList.add('show');

      // Mini bounce animation on avatar
      avatarBox.style.transform = 'scale(1.15) rotate(4deg)';
      setTimeout(() => {
        avatarBox.style.transform = '';
      }, 250);

      bubbleTimer = setTimeout(() => {
        speechBubble.classList.remove('show');
      }, 3500);
    });
  }

  /* ==========================================================================
     7. 3D Card Interactive Tilt Effect (Desktop)
     ========================================================================== */
  if (card && window.matchMedia('(pointer: fine)').matches) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }

  /* ==========================================================================
     8. Ambient Data Network Particles (HTML5 Canvas)
     ========================================================================== */
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 45);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha * 0.75})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with lines (Neural / Data network look)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }
});

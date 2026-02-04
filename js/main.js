// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initLightbox();
    initScrollAnimations();
    initScrollProgress();
    initBackToTop();
    initCursorGlow();
    initParallax();
    initSmoothScroll();
});

// ===== 图片灯箱功能 =====
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="" alt="放大图片">
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // 点击图片打开灯箱
    document.querySelectorAll('.media-item img').forEach(img => {
        img.addEventListener('click', function() {
            lightboxImg.src = this.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightbox.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });

    lightboxImg.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ===== 滚动动画 =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 延迟动画以创建级联效果
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);

                // 子元素动画
                const items = entry.target.querySelectorAll('[data-animate-item]');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('animated');
                    }, (index * 100) + (i * 150));
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // 单独观察卡片元素
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });
}

// ===== 滚动进度条 =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ===== 返回顶部按钮 =====
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '&uarr;';
    backToTop.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== 鼠标跟随光效 =====
function initCursorGlow() {
    // 仅在桌面端启用
    if (window.innerWidth < 768) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    // 平滑跟随效果
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
}

// ===== 视差效果 =====
function initParallax() {
    const header = document.querySelector('.site-header, .project-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        header.style.backgroundPosition = `center ${rate}px`;
    });
}

// ===== 平滑滚动 =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== 图片懒加载 =====
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===== 卡片倾斜效果 =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== 打字机效果（可选使用） =====
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// ===== 数字滚动动画（可选使用） =====
function animateNumber(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    update();
}

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initRippleEffect();
    initScrollProgress();
    initLightbox();
    initSidebarHover();
});

// ===== 页面加载动画 =====
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        });
    }
}

// ===== 水滴点击动画效果 =====
function initRippleEffect() {
    const container = document.querySelector('.ripple-container');
    if (!container) return;

    document.addEventListener('click', (e) => {
        // 不在按钮和链接上触发水滴效果
        if (e.target.closest('a, button, .view-btn')) return;

        createRipple(e.clientX, e.clientY, container);
    });
}

function createRipple(x, y, container) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    // 随机大小
    const size = Math.random() * 100 + 150;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    container.appendChild(ripple);

    // 动画结束后移除
    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });

    // 创建多个小水滴
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            createSmallRipple(x, y, container);
        }, i * 100);
    }
}

function createSmallRipple(x, y, container) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    const size = Math.random() * 50 + 30;
    const offsetX = (Math.random() - 0.5) * 100;
    const offsetY = (Math.random() - 0.5) * 100;

    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (x + offsetX) + 'px';
    ripple.style.top = (y + offsetY) + 'px';
    ripple.style.animationDuration = '1s';

    container.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

// ===== 滚动进度条 =====
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    });
}

// ===== 图片灯箱 =====
function initLightbox() {
    // 创建灯箱元素
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img src="" alt="放大图片">
        <video controls style="display:none;"></video>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxVideo = lightbox.querySelector('video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // 点击图片打开灯箱
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.masonry-item');
        if (!item) return;

        const img = item.querySelector('img');
        const video = item.querySelector('video');

        if (img) {
            lightboxImg.src = img.src;
            lightboxImg.style.display = 'block';
            lightboxVideo.style.display = 'none';
            lightboxVideo.pause();
        } else if (video) {
            lightboxVideo.src = video.querySelector('source')?.src || video.src;
            lightboxVideo.style.display = 'block';
            lightboxImg.style.display = 'none';
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxVideo.pause();
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// ===== 侧边栏悬停效果 =====
function initSidebarHover() {
    const sidebar = document.querySelector('.project-sidebar');
    const description = document.querySelector('.sidebar-description');
    if (!sidebar || !description) return;

    const defaultText = description.textContent;

    // 监听所有瀑布流项目的悬停
    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const desc = item.dataset.description;
            if (desc) {
                description.textContent = desc;
                description.classList.add('active');
            }

            // 移除其他项目的active状态
            document.querySelectorAll('.masonry-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            // 延迟恢复默认文本，避免闪烁
            setTimeout(() => {
                if (!document.querySelector('.masonry-item:hover')) {
                    description.textContent = defaultText;
                    description.classList.remove('active');
                }
            }, 100);
        });
    });
}

// ===== 瀑布流懒加载 =====
function initLazyLoad() {
    const images = document.querySelectorAll('.masonry-item img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

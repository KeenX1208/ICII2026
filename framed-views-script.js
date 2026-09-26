/* ================= 1. 移动端汉堡菜单与多级导航 ================= */
const hamburger = document.getElementById('hamburger');
const navRight = document.getElementById('nav-right');
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        navRight.classList.toggle('is-active');
    });
}

if (mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdownContent.classList.toggle('is-expanded');
            const arrow = mobileDropdownToggle.querySelector('.dropdown-arrow');
            if (dropdownContent.classList.contains('is-expanded')) {
                arrow.style.transform = 'rotate(225deg) translate(-2px, -2px)';
            } else {
                arrow.style.transform = 'rotate(45deg) translateY(-2px)';
            }
        }
    });
}

/* ================= 2. 导航栏花瓣飘落特效 ================= */
const globalNavItems = gsap.utils.toArray('.nav-item');

function createGlobalNavPetal(parent) {
    const petal = document.createElement('div');
    petal.classList.add('nav-petal');
    parent.appendChild(petal);
    const startX = Math.random() * parent.offsetWidth;
    const startY = -10;
    gsap.set(petal, { x: startX, y: startY, rotation: Math.random() * 360, scale: Math.random() * 0.5 + 0.5 });
    gsap.to(petal, {
        y: parent.offsetHeight + 10, x: startX + (Math.random() * 20 - 10),
        rotation: "+=" + (Math.random() * 200 - 100), opacity: 0,
        duration: 0.5 + Math.random() * 0.4, ease: "power1.in",
        onComplete: () => petal.remove()
    });
}

globalNavItems.forEach(item => {
    // 排除下拉菜单的父级，防止花瓣错位干扰
    if (!item.classList.contains("dropdown") && !item.closest(".dropdown")) {
        item.addEventListener('mouseenter', () => {
            for (let j = 0; j < 6; j++) {
                setTimeout(() => { createGlobalNavPetal(item); }, j * 60);
            }
        });
    }
});

/* ================= 3. 借景相望：横纵向滚动与翻转控制 ================= */
gsap.registerPlugin(ScrollTrigger);

// 利用 matchMedia 对 PC 和移动端做动画降级与隔离
let mm = gsap.matchMedia();

mm.add("(min-width: 901px)", () => {
    // 仅在电脑端执行横向滚动
    let scrollWrapper = document.querySelector(".scroll-wrapper");
    let sections = gsap.utils.toArray(".pair-section");

    let horizontalTween = gsap.to(scrollWrapper, {
        x: () => -(scrollWrapper.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-container",
            pin: true,
            scrub: 1,
            end: () => "+=" + (scrollWrapper.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true,
            snap: {
                snapTo: (progress, self) => {
                    const maxScroll = scrollWrapper.scrollWidth - window.innerWidth;
                    const points = sections.map(section => section.offsetLeft / maxScroll);
                    return gsap.utils.snap(points, progress);
                },
                duration: { min: 0.3, max: 0.8 },
                delay: 0.15,
                ease: "power2.inOut"
            }
        }
    });

    // 绑定两侧卡片与中央窗口的入场动画
    sections.forEach((section) => {
        if (section.classList.contains("intro-slide")) return; // 首屏跳过

        const teamLeft = section.querySelector(".team-left");
        const teamRight = section.querySelector(".team-right");
        const windowCard = section.querySelector(".window-card");

        gsap.from(teamLeft, { x: -80, opacity: 0, duration: 0.8, scrollTrigger: { trigger: section, containerAnimation: horizontalTween, start: "left center", toggleActions: "play none none reverse" } });
        gsap.from(teamRight, { x: 80, opacity: 0, duration: 0.8, scrollTrigger: { trigger: section, containerAnimation: horizontalTween, start: "left center", toggleActions: "play none none reverse" } });
        gsap.from(windowCard, { scale: 0.95, opacity: 0, duration: 0.8, scrollTrigger: { trigger: section, containerAnimation: horizontalTween, start: "left center", toggleActions: "play none none reverse" } });
    });
});

// 借景卡片正反面 3D 翻转交互逻辑（PC 与移动端通用）
document.querySelectorAll('.btn-push-window').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        this.closest('.window-inner').style.transform = 'rotateY(180deg)';
    });
});
document.querySelectorAll('.btn-switch-view').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        this.closest('.window-inner').style.transform = 'rotateY(0deg)';
    });
});
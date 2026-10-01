gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray('.team-card');
const navLinks = gsap.utils.toArray('.nav-list a');
const navList = document.querySelector('.nav-list');

function triggerPetals(link) {
    for (let j = 0; j < 8; j++) {
        setTimeout(() => {
            createPetal(link);
        }, j * 60);
    }
}

// 记录当前高亮的导航项，卡片区间在边界处来回 toggle 时不重复触发
// 花瓣动画与侧边栏平滑滚动（两者频繁互打会造成侧边栏抖动/卡顿）
let activeIndex = -1;

cards.forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onToggle: self => {
            if (self.isActive && navLinks[i] && i !== activeIndex) {
                activeIndex = i;
                navLinks.forEach(link => link.classList.remove('active'));
                navLinks[i].classList.add('active');
                triggerPetals(navLinks[i]);

                // 宽屏侧边栏为固定列表时才自动滚动定位
                if (navList && window.matchMedia('(min-width: 901px)').matches) {
                    const activeLink = navLinks[i];
                    const linkRect = activeLink.getBoundingClientRect();
                    const listRect = navList.getBoundingClientRect();

                    const scrollPos = navList.scrollTop + (linkRect.top - listRect.top) - (listRect.height / 2) + (linkRect.height / 2);

                    navList.scrollTo({
                        top: scrollPos,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        triggerPetals(link);
    });
});

function createPetal(parent) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    parent.appendChild(petal);

    const startX = Math.random() * parent.offsetWidth;
    const startY = -15;

    gsap.set(petal, {
        x: startX,
        y: startY,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
    });

    gsap.to(petal, {
        y: parent.offsetHeight + 15,
        x: startX + (Math.random() * 30 - 15),
        rotation: "+=" + (Math.random() * 200 - 100),
        opacity: 0,
        duration: 0.8 + Math.random() * 0.5,
        ease: "power1.in",
        onComplete: () => petal.remove()
    });
}

const globalNavItems = gsap.utils.toArray('.nav-item');

function createGlobalNavPetal(parent) {
    const petal = document.createElement('div');
    petal.classList.add('nav-petal');
    parent.appendChild(petal);

    const startX = Math.random() * parent.offsetWidth;
    const startY = -10;

    gsap.set(petal, {
        x: startX,
        y: startY,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
    });

    gsap.to(petal, {
        y: parent.offsetHeight + 10,
        x: startX + (Math.random() * 20 - 10),
        rotation: "+=" + (Math.random() * 200 - 100),
        opacity: 0,
        duration: 0.5 + Math.random() * 0.4,
        ease: "power1.in",
        onComplete: () => petal.remove()
    });
}

globalNavItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        for (let j = 0; j < 6; j++) {
            setTimeout(() => {
                createGlobalNavPetal(item);
            }, j * 60);
        }
    });
});

// ==========================================
// 升级版：多弹窗 (Modal) 交互逻辑
// ==========================================
// ==========================================
// 升级版：多弹窗 (Modal) 交互逻辑
// ==========================================
const approachBtns = document.querySelectorAll('.approach-btn');
const closeBtns = document.querySelectorAll('.modal-close-btn');
const allModals = document.querySelectorAll('.modal-overlay');

// 1. 点击"Approach this Scene"打开对应的专属弹窗
approachBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 防止事件冒泡干扰

        // 获取该按钮上的 data-team 属性值（例如 'cau'）
        const teamId = btn.getAttribute('data-team');

        if (!teamId) {
            console.error("该按钮缺少 data-team 属性！", btn);
            return;
        }

        // 拼凑出对应的弹窗 ID 并找到它（例如 'modal-cau'）
        const targetModal = document.getElementById(`modal-${teamId}`);

        if (targetModal) {
            // 自动从外部卡片抓取 Location 填入弹窗
            const parentCard = btn.closest('.team-card');
            if (parentCard) {
                const locationEl = parentCard.querySelector('.team-location');
                const modalLocationTag = targetModal.querySelector('.location-tag');
                if (locationEl && modalLocationTag) {
                    modalLocationTag.innerText = locationEl.innerText;
                }
            }

            targetModal.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // 防止背景继续滚动
        } else {
            console.error(`找不到 ID 为 modal-${teamId} 的弹窗代码，请检查 HTML！`);
        }
    });
});

// 2. 关闭弹窗逻辑：点击右上角叉号
closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
            modal.classList.remove('is-active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }
    });
});

// 3. 关闭弹窗逻辑：点击半透明深色遮罩层外部
allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-active');
            document.body.style.overflow = '';
        }
    });
});

/* ================= 移动端汉堡菜单交互 ================= */
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
            e.preventDefault(); // 移动端点击不跳转，而是展开子菜单
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
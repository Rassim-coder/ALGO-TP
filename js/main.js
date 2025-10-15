document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const tpContents = [
        document.getElementById('tp1-content'),
        document.getElementById('tp2-content'),
        document.getElementById('tp3-content'),
        document.getElementById('tp4-content'),
        document.getElementById('tp5-content')
    ];
    const landing = document.getElementById('landing-content');
    const landingBtn = document.getElementById('landing-btn');
    let currentIdx = null; // null means landing page is shown

    // Hide all TP sections and show only landing at start
    menuItems.forEach(item => item.classList.remove('active'));
    tpContents.forEach(tp => tp.classList.remove('visible', 'fade-in', 'fade-out'));
    landing.classList.add('visible');

    menuItems.forEach((item, idx) => {
        item.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
            ripple.style.left = (e.clientX - rect.left - rect.width/2) + 'px';
            ripple.style.top = (e.clientY - rect.top - rect.height/2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);

            // Active switching
            document.querySelector('.menu-item.active')?.classList.remove('active');
            this.classList.add('active');

            // Always hide all TP sections before showing the new one
            tpContents.forEach(tp => tp.classList.remove('visible', 'fade-in', 'fade-out'));

            // If landing page is visible, fade it out and show the selected TP
            if (currentIdx === null) {
                landing.classList.remove('visible');
                landing.classList.add('fade-out');
                setTimeout(() => {
                    landing.classList.remove('fade-out');
                    tpContents[idx].classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        tpContents[idx].classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = idx;
            } else if (idx !== currentIdx) {
                // Fade out current TP, fade in new TP
                const prev = tpContents[currentIdx];
                prev.classList.remove('visible');
                prev.classList.add('fade-out');
                setTimeout(() => {
                    prev.classList.remove('fade-out');
                    tpContents[idx].classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        tpContents[idx].classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = idx;
            }
        });
    });

    // Landing button click: go back to landing page
    if (landingBtn) {
        landingBtn.addEventListener('click', function() {
            // Remove active from all menu items
            document.querySelectorAll('.menu-item.active').forEach(btn => btn.classList.remove('active'));
            // Fade out current TP if any
            if (currentIdx !== null) {
                const prev = tpContents[currentIdx];
                prev.classList.remove('visible');
                prev.classList.add('fade-out');
                setTimeout(() => {
                    prev.classList.remove('fade-out');
                    landing.classList.add('visible', 'fade-in');
                    setTimeout(() => {
                        landing.classList.remove('fade-in');
                    }, 300);
                }, 300);
                currentIdx = null;
            }
        });
    }
});

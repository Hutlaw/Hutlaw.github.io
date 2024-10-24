const backToTopButton = document.getElementById('back-to-top');

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

const sections = document.querySelectorAll('main section');

window.addEventListener('scroll', () => {
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.classList.add('fade-in');
            section.classList.remove('fade-out');
        } else {
            section.classList.remove('fade-in');
            section.classList.add('fade-out');
        }
    });
});

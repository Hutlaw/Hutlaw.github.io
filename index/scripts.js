document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('spotify-modal');
    const embed = document.getElementById('spotify-embed');
    const links = document.querySelectorAll('.song-link');
    const backToTopButton = document.getElementById('back-to-top');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const songId = link.getAttribute('data-id');
            embed.src = `https://open.spotify.com/embed/track/${songId}`;
            modal.classList.remove('hidden');
        });
    });

    document.addEventListener('click', (event) => {
        if (!modal.contains(event.target) && !event.target.classList.contains('song-link')) {
            modal.classList.add('hidden');
            embed.src = '';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }

        const sections = document.querySelectorAll('main section');
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
});

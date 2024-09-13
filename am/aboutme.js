const modal = document.getElementById('spotify-modal');
const embed = document.getElementById('spotify-embed');
const links = document.querySelectorAll('.song-link');

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

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.classList.add('hidden');
        embed.src = '';
    }
});

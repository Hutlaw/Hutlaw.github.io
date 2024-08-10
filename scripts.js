// Settings
const showProfilePicture = 1;
const showPfpNotice = 0;
const enableTextFading = 1;

function toggleProfilePicture() {
    const profilePictureContainer = document.querySelector('.profile-picture-container');
    if (showProfilePicture === 0) {
        profilePictureContainer.classList.add('hidden');
    } else {
        profilePictureContainer.classList.remove('hidden');
    }
}

function togglePfpNotice() {
    const pfpNotice = document.querySelector('.pfp-notice');
    if (showPfpNotice === 0) {
        pfpNotice.classList.add('hidden');
    } else {
        pfpNotice.classList.remove('hidden');
    }
}

function handleScroll() {
    if (enableTextFading === 1) {
        const elements = document.querySelectorAll('section');
        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('fade-in');
                element.classList.remove('fade-out');
            } else {
                element.classList.remove('fade-in');
                element.classList.add('fade-out');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Fade in on load
    document.body.style.opacity = '1';

    toggleProfilePicture();
    togglePfpNotice();
    
    if (enableTextFading === 1) {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
});

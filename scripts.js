// settings
const showProfilePicture = 1;
const showPfpNotice = 1;
const showPfpEffect = 1;

function toggleProfilePicture() {
    const profilePicture = document.querySelector('.profile-picture');
    if (showProfilePicture === 0) {
        profilePicture.classList.add('hidden');
    } else {
        profilePicture.classList.remove('hidden');
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

function togglePfpEffect() {
    const profilePictureContainer = document.querySelector('.profile-picture-container');
    if (showPfpEffect === 0) {
        profilePictureContainer.classList.add('effect-hidden');
    } else {
        profilePictureContainer.classList.remove('effect-hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toggleProfilePicture();
    togglePfpNotice();
    togglePfpEffect();
});

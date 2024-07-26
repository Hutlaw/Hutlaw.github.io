// settings
const showProfilePicture = 1;
const showPfpNotice = 1;

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

document.addEventListener('DOMContentLoaded', () => {
    toggleProfilePicture();
    togglePfpNotice();
});

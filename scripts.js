// Settings
const showProfilePicture = 1; // Change this value to 0 to hide the profile picture
const showPfpNotice = 1; // Change this value to 0 to hide the intellectual property notice. Didn't make your pfp? be nice and say so
// End of settings 
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

document.addEventListener('DOMContentLoaded', () => {
    toggleProfilePicture();
    togglePfpNotice();
});

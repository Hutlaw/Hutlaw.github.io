
function toggleProfilePicture() {
    const profilePicture = document.querySelector('.profile-picture');
    const showProfilePicture = getComputedStyle(document.documentElement).getPropertyValue('--show-profile-picture').trim();

    if (showProfilePicture === '0') {
        profilePicture.classList.add('hidden');
    } else {
        profilePicture.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', toggleProfilePicture);

// scripts.js

// Settings
// 1 = enabled, 0 = disabled
const showProfilePicture = 1; // Change this value to 0 to hide the profile picture
const showPfpNotice = 1; // Change this value to 0 to hide the intellectual property notice

// Function to toggle the profile picture based on the setting
function toggleProfilePicture() {
    const profilePicture = document.querySelector('.profile-picture');

    if (showProfilePicture === 0) {
        profilePicture.classList.add('hidden');
    } else {
        profilePicture.classList.remove('hidden');
    }
}

// Function to toggle the intellectual property notice based on the setting
function togglePfpNotice() {
    const pfpNotice = document.querySelector('.pfp-notice');

    if (showPfpNotice === 0) {
        pfpNotice.classList.add('hidden');
    } else {
        pfpNotice.classList.remove('hidden');
    }
}

// Call the functions on page load
document.addEventListener('DOMContentLoaded', () => {
    toggleProfilePicture();
    togglePfpNotice();
});

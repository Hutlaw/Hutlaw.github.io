// Settings, used for easy customization for me. why did i make this? shut up, dont ask questions
// 1 = enabled, 0 = disabled
const showProfilePicture = 1; // Change this value to 0 to hide the profile picture
// End of settings, everything else belows is to edit the scripts based on input


// Function to toggle profile picture based on the setting
function toggleProfilePicture() {
    const profilPicture = document.querySelector('.profile-picture');

    if (showProfilePicture === 0) {
        profilePicture.classList.add('hidden');
    } else {
        profilePicture.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', toggleProfilePicture);

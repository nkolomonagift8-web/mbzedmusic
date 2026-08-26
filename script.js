// =========================================
// MBZEDMUSIC.COM
// JAVASCRIPT
// =========================================


// =========================================
// MOBILE MENU
// =========================================

const mobileMenu = document.getElementById("mobileMenu");
const navigation = document.getElementById("navigation");

if (mobileMenu && navigation) {

    mobileMenu.addEventListener("click", () => {

        navigation.classList.toggle("open");

        const icon = mobileMenu.querySelector("i");

        if (navigation.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


// =========================================
// SEARCH
// =========================================

const searchButton =
    document.getElementById("searchButton");

const searchBox =
    document.getElementById("searchBox");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");


if (searchButton && searchBox) {

    searchButton.addEventListener("click", () => {

        searchBox.classList.add("active");

        if (searchInput) {
            searchInput.focus();
        }

    });

}


if (closeSearch && searchBox) {

    closeSearch.addEventListener("click", () => {

        searchBox.classList.remove("active");

    });

}


// =========================================
// MUSIC PLAYER
// =========================================

const musicPlayer =
    document.getElementById("musicPlayer");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const mainPlayerButton =
    document.getElementById("mainPlayerButton");

let playing = false;


// =========================================
// PLAY BUTTONS
// =========================================

const playButtons =
    document.querySelectorAll(
        ".play-button, .card-play"
    );


playButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".track") ||
            button.closest(".release-card") ||
            button.closest(".chart-item");

        if (!card) {
            return;
        }


        const titleElement =
            card.querySelector("h3");

        const artistElement =
            card.querySelector("p");


        const title =
            titleElement
                ? titleElement.textContent.trim()
                : "Unknown Song";


        const artist =
            artistElement
                ? artistElement.textContent.trim()
                : "Mbzedmusic Artist";


        if (playerTitle) {
            playerTitle.textContent = title;
        }

        if (playerArtist) {
            playerArtist.textContent = artist;
        }


        if (musicPlayer) {
            musicPlayer.classList.add("show");
        }


        playing = true;


        if (mainPlayerButton) {

            mainPlayerButton.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        }

    });

});


// =========================================
// MAIN PLAYER BUTTON
// =========================================

if (mainPlayerButton) {

    mainPlayerButton.addEventListener("click", () => {

        playing = !playing;


        if (playing) {

            mainPlayerButton.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        } else {

            mainPlayerButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

        }

    });

}


// =========================================
// NEWSLETTER
// =========================================

const newsletterForm =
    document.getElementById("newsletterForm");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const emailInput =
                newsletterForm.querySelector(
                    'input[type="email"]'
                );


            if (!emailInput) {
                return;
            }


            const email =
                emailInput.value.trim();


            if (!email) {
                return;
            }


            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );


            newsletterForm.reset();

        }
    );

}


// =========================================
// BACK TO TOP
// =========================================

const backToTop =
    document.querySelector(
        '.footer-bottom a[href="#"]'
    );


if (backToTop) {

    backToTop.addEventListener(
        "click",
        event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// =========================================
// CLOSE MOBILE MENU WHEN LINK IS CLICKED
// =========================================

const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );


navigationLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (
            navigation &&
            window.innerWidth <= 750
        ) {

            navigation.classList.remove("open");

            if (mobileMenu) {

                const icon =
                    mobileMenu.querySelector("i");

                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            }

        }

    });

});

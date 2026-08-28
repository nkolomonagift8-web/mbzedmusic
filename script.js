/* =========================================================
   MBZEDMUSIC.COM - MAIN JAVASCRIPT
   Music player + search + mobile menu + newsletter
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MUSIC INFORMATION
       ===================================================== */

    const musicTracks = [
        {
            title: "MB LEVELS",
            artist: "Mr. Kings ft. Bravo Uja Lapa, Shax Morefire & Trykash Wayayo",
            cover: "mb-levels-cover.jpg.jpeg",
            audio: "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3"
        }
    ];


    /* =====================================================
       AUDIO PLAYER
       ===================================================== */

    const audio = new Audio();

    let currentTrack = 0;
    let isPlaying = false;

    const player = document.getElementById("musicPlayer");
    const mainPlayerButton = document.getElementById("mainPlayerButton");

    const playerTitle = document.getElementById("playerTitle");
    const playerArtist = document.getElementById("playerArtist");

    const playerCover = document.querySelector(".player-cover");

    const progressContainer = document.querySelector(".player-progress");
    const progressBar = progressContainer
        ? progressContainer.querySelector("div")
        : null;


    /* =====================================================
       LOAD TRACK
       ===================================================== */

    function loadTrack(index) {

        if (!musicTracks[index]) return;

        const track = musicTracks[index];

        audio.src = track.audio;

        if (playerTitle) {
            playerTitle.textContent = track.title;
        }

        if (playerArtist) {
            playerArtist.textContent = track.artist;
        }

        if (playerCover) {
            playerCover.style.backgroundImage =
                `url("${track.cover}")`;

            playerCover.style.backgroundSize = "cover";
            playerCover.style.backgroundPosition = "center";
        }

        audio.load();
    }


    /* =====================================================
       PLAY MUSIC
       ===================================================== */

    function playMusic() {

        audio.play()
            .then(() => {

                isPlaying = true;

                updatePlayButton();

                if (player) {
                    player.classList.add("active");
                }

            })
            .catch(error => {

                console.log("Music could not play:", error);

            });
    }


    /* =====================================================
       PAUSE MUSIC
       ===================================================== */

    function pauseMusic() {

        audio.pause();

        isPlaying = false;

        updatePlayButton();
    }


    /* =====================================================
       PLAY / PAUSE BUTTON
       ===================================================== */

    function toggleMusic() {

        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }


    /* =====================================================
       UPDATE PLAY BUTTON
       ===================================================== */

    function updatePlayButton() {

        if (!mainPlayerButton) return;

        const icon = mainPlayerButton.querySelector("i");

        if (!icon) return;

        if (isPlaying) {

            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");

        } else {

            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
        }
    }


    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener("click", () => {

            toggleMusic();

        });

    }


    /* =====================================================
       ALL SMALL PLAY BUTTONS
       ===================================================== */

    const playButtons = document.querySelectorAll(
        ".play-button, .card-play"
    );

    playButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            currentTrack = 0;

            loadTrack(currentTrack);

            playMusic();

        });

    });


    /* =====================================================
       AUDIO PROGRESS
       ===================================================== */

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration || !progressBar) return;

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        progressBar.style.width = `${percentage}%`;

    });


    /* =====================================================
       CLICK PROGRESS BAR
       ===================================================== */

    if (progressContainer) {

        progressContainer.addEventListener("click", event => {

            if (!audio.duration) return;

            const rect =
                progressContainer.getBoundingClientRect();

            const clickPosition =
                event.clientX - rect.left;

            const percentage =
                clickPosition / rect.width;

            audio.currentTime =
                percentage * audio.duration;

        });

    }


    /* =====================================================
       MUSIC FINISHED
       ===================================================== */

    audio.addEventListener("ended", () => {

        isPlaying = false;

        updatePlayButton();

        if (progressBar) {
            progressBar.style.width = "0%";
        }

    });


    /* =====================================================
       SEARCH
       ===================================================== */

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
                setTimeout(() => {
                    searchInput.focus();
                }, 100);
            }

        });

    }


    if (closeSearch && searchBox) {

        closeSearch.addEventListener("click", () => {

            searchBox.classList.remove("active");

            if (searchInput) {
                searchInput.value = "";
            }

        });

    }


    /* =====================================================
       SEARCH ENTER
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("keydown", event => {

            if (event.key !== "Enter") return;

            const query =
                searchInput.value.trim().toLowerCase();

            if (!query) return;

            const results = musicTracks.filter(track =>

                track.title.toLowerCase().includes(query) ||
                track.artist.toLowerCase().includes(query)

            );

            if (results.length > 0) {

                currentTrack = musicTracks.indexOf(results[0]);

                loadTrack(currentTrack);

                playMusic();

            } else {

                alert(
                    "No music found. Try searching for MB LEVELS."
                );

            }

        });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const mobileMenu =
        document.getElementById("mobileMenu");

    const navigation =
        document.getElementById("navigation");


    if (mobileMenu && navigation) {

        mobileMenu.addEventListener("click", () => {

            navigation.classList.toggle("active");

            const icon =
                mobileMenu.querySelector("i");

            if (!icon) return;

            if (navigation.classList.contains("active")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });


        /* Close menu when link is clicked */

        const navigationLinks =
            navigation.querySelectorAll("a");

        navigationLinks.forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                const icon =
                    mobileMenu.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            });

        });

    }


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletterForm =
        document.getElementById("newsletterForm");


    if (newsletterForm) {

        newsletterForm.addEventListener("submit", event => {

            event.preventDefault();

            const emailInput =
                newsletterForm.querySelector("input[type='email']");

            if (!emailInput) return;

            const email =
                emailInput.value.trim();

            if (!email) return;

            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );

            emailInput.value = "";

        });

    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        document.querySelector(".footer-bottom a");


    if (backToTop) {

        backToTop.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       UPLOAD BUTTONS
       ===================================================== */

    const uploadButtons =
        document.querySelectorAll(
            ".upload-button, .primary-button, .secondary-button, .artist-upload"
        );


    uploadButtons.forEach(button => {

        button.addEventListener("click", event => {

            const text =
                button.textContent.toLowerCase();

            if (
                text.includes("upload") &&
                button.getAttribute("href") === "#"
            ) {

                event.preventDefault();

                alert(
                    "Artist upload system coming soon on Mbzedmusic.com."
                );

            }

        });

    });


    /* =====================================================
       INITIALIZE PLAYER
       ===================================================== */

    loadTrack(currentTrack);


    console.log(
        "MBZEDMUSIC JavaScript loaded successfully."
    );

});

/* =========================================================
   MBZEDMUSIC.COM
   Website JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const searchButton = document.getElementById("searchButton");
    const searchBox = document.getElementById("searchBox");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const mobileMenu = document.getElementById("mobileMenu");
    const navigation = document.getElementById("navigation");

    const audio = document.getElementById("audioPlayer");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerArtist =
        document.getElementById("playerArtist");

    const progressBar =
        document.getElementById("progressBar");

    const previousButton =
        document.getElementById("previousButton");

    const nextButton =
        document.getElementById("nextButton");

    const newsletterForm =
        document.getElementById("newsletterForm");


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchButton) {

        searchButton.addEventListener("click", function () {

            searchBox.classList.toggle("active");

            if (searchBox.classList.contains("active")) {
                searchInput.focus();
            }

        });

    }


    if (closeSearch) {

        closeSearch.addEventListener("click", function () {

            searchBox.classList.remove("active");

            searchInput.value = "";

            showAllSearchResults();

        });

    }


    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchTerm =
                searchInput.value.toLowerCase().trim();

            const items =
                document.querySelectorAll(".searchable");

            items.forEach(function (item) {

                const title =
                    (item.dataset.title || "").toLowerCase();

                const artist =
                    (item.dataset.artist || "").toLowerCase();

                if (
                    searchTerm === "" ||
                    title.includes(searchTerm) ||
                    artist.includes(searchTerm)
                ) {

                    item.classList.remove("search-hidden");

                } else {

                    item.classList.add("search-hidden");

                }

            });

        });

    }


    function showAllSearchResults() {

        const items =
            document.querySelectorAll(".searchable");

        items.forEach(function (item) {
            item.classList.remove("search-hidden");
        });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (mobileMenu) {

        mobileMenu.addEventListener("click", function () {

            navigation.classList.toggle("open");

            const icon =
                mobileMenu.querySelector("i");

            if (navigation.classList.contains("open")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    }


    /* Close mobile menu when a link is clicked */

    document.querySelectorAll(".navigation a").forEach(function (link) {

        link.addEventListener("click", function () {

            navigation.classList.remove("open");

            const icon =
                mobileMenu.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });


    /* =====================================================
       MUSIC
       ===================================================== */

    const song = {
        title: "MB Levels",
        artist: "Mr. Kings ft Bravo Uja Lapa",
        file: "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3"
    };


    let isPlaying = false;


    function updatePlayer() {

        if (playerTitle) {
            playerTitle.textContent = song.title;
        }

        if (playerArtist) {
            playerArtist.textContent = song.artist;
        }

    }


    function playMusic() {

        audio.play()
            .then(function () {

                isPlaying = true;

                updatePlayButtons();

            })
            .catch(function (error) {

                console.log("Music could not start:", error);

            });

    }


    function pauseMusic() {

        audio.pause();

        isPlaying = false;

        updatePlayButtons();

    }


    function updatePlayButtons() {

        const buttons =
            document.querySelectorAll(
                ".play-button, .card-play"
            );

        buttons.forEach(function (button) {

            const icon =
                button.querySelector("i");

            if (!icon) return;

            if (isPlaying) {

                icon.classList.remove("fa-play");
                icon.classList.add("fa-pause");

                button.classList.add("playing");

            } else {

                icon.classList.remove("fa-pause");
                icon.classList.add("fa-play");

                button.classList.remove("playing");

            }

        });


        if (mainPlayerButton) {

            const icon =
                mainPlayerButton.querySelector("i");

            if (isPlaying) {

                icon.classList.remove("fa-play");
                icon.classList.add("fa-pause");

            } else {

                icon.classList.remove("fa-pause");
                icon.classList.add("fa-play");

            }

        }

    }


    /* =====================================================
       PLAY BUTTONS
       ===================================================== */

    document.querySelectorAll(
        ".play-button, .card-play"
    ).forEach(function (button) {

        button.addEventListener("click", function () {

            updatePlayer();

            if (audio.paused) {

                playMusic();

            } else {

                pauseMusic();

            }

        });

    });


    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            function () {

                if (audio.paused) {

                    playMusic();

                } else {

                    pauseMusic();

                }

            }
        );

    }


    /* =====================================================
       AUDIO EVENTS
       ===================================================== */

    audio.addEventListener("play", function () {

        isPlaying = true;

        updatePlayButtons();

    });


    audio.addEventListener("pause", function () {

        isPlaying = false;

        updatePlayButtons();

    });


    audio.addEventListener("ended", function () {

        isPlaying = false;

        updatePlayButtons();

        if (progressBar) {
            progressBar.style.width = "0%";
        }

    });


    /* =====================================================
       MUSIC PROGRESS
       ===================================================== */

    audio.addEventListener("timeupdate", function () {

        if (!audio.duration) return;

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        if (progressBar) {
            progressBar.style.width =
                percentage + "%";
        }

    });


    /* =====================================================
       PREVIOUS BUTTON
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener("click", function () {

            audio.currentTime = 0;

            if (audio.paused) {
                playMusic();
            }

        });

    }


    /* =====================================================
       NEXT BUTTON
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener("click", function () {

            audio.currentTime = 0;

            playMusic();

        });

    }


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const email =
                    newsletterForm.querySelector(
                        "input[type='email']"
                    ).value;

                if (email) {

                    alert(
                        "Thank you for subscribing to Mbzedmusic.com!"
                    );

                    newsletterForm.reset();

                }

            }
        );

    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    document.querySelectorAll(
        'a[href="#"]'
    ).forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       INITIAL SETUP
       ===================================================== */

    updatePlayer();

});

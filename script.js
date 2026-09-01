/* =========================================================
   MBZEDMUSIC.COM
   MUSIC PLAYER + WEBSITE INTERACTIONS
   COMPLETE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const audio = document.getElementById("audioPlayer");

    const musicPlayer = document.querySelector(".music-player");
    const playerCover = document.querySelector(".player-cover");
    const playerTitle = document.querySelector(".player-info h3");
    const playerArtist = document.querySelector(".player-info p");
    const mainPlayerButton = document.querySelector(".main-player-button");
    const playerProgress = document.querySelector(".player-progress");
    const progressBar = document.querySelector(".player-progress > div");

    const searchButton = document.querySelector(".search-button");
    const searchBox = document.querySelector(".search-box");
    const searchInput = document.querySelector(".search-inner input");

    const mobileMenu = document.querySelector(".mobile-menu");
    const navigation = document.querySelector(".navigation");


    /* =====================================================
       MAKE SURE AUDIO EXISTS
       ===================================================== */

    if (!audio) {
        console.warn("Mbzedmusic: #audioPlayer was not found.");
    }


    /* =====================================================
       MUSIC PLAYER STATE
       ===================================================== */

    let currentAudio = "";
    let currentButton = null;


    /* =====================================================
       FIND ALL MUSIC BUTTONS
       ===================================================== */

    const musicButtons = document.querySelectorAll(
        "[data-audio]"
    );


    /* =====================================================
       LOAD SONG
       ===================================================== */

    function loadSong(button) {

        if (!audio || !button) return;

        const audioFile = button.getAttribute("data-audio");

        if (!audioFile) {
            console.warn("No data-audio found on this button.");
            return;
        }

        currentAudio = audioFile;
        currentButton = button;

        /* ---------------------------------------------
           Song title
        --------------------------------------------- */

        let title =
            button.getAttribute("data-title") ||
            button.getAttribute("data-song") ||
            "";

        if (!title) {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item"
                );

            if (card) {

                const titleElement =
                    card.querySelector(
                        "h3, .track-info h3, .release-card h3, .chart-item h3"
                    );

                if (titleElement) {
                    title = titleElement.textContent.trim();
                }
            }
        }

        if (!title) {
            title = "Now Playing";
        }


        /* ---------------------------------------------
           Artist
        --------------------------------------------- */

        let artist =
            button.getAttribute("data-artist") ||
            "";

        if (!artist) {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item"
                );

            if (card) {

                const artistElement =
                    card.querySelector(
                        ".track-info p, .release-card p, .chart-item p"
                    );

                if (artistElement) {
                    artist = artistElement.textContent.trim();
                }
            }
        }

        if (!artist) {
            artist = "Mbzedmusic";
        }


        /* ---------------------------------------------
           Cover image
        --------------------------------------------- */

        let cover =
            button.getAttribute("data-cover") ||
            "";

        if (!cover) {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item"
                );

            if (card) {

                const image =
                    card.querySelector(
                        ".track-image, .release-image, .mini-cover"
                    );

                if (image) {

                    const background =
                        getComputedStyle(image)
                            .backgroundImage;

                    if (
                        background &&
                        background !== "none"
                    ) {

                        cover =
                            background
                                .replace(/^url\(["']?/, "")
                                .replace(/["']?\)$/, "");
                    }
                }
            }
        }


        /* ---------------------------------------------
           Update player
        --------------------------------------------- */

        if (playerTitle) {
            playerTitle.textContent = title;
        }

        if (playerArtist) {
            playerArtist.textContent = artist;
        }

        if (playerCover && cover) {

            playerCover.style.backgroundImage =
                `url("${cover}")`;
        }


        /* ---------------------------------------------
           Load audio
        --------------------------------------------- */

        audio.pause();

        audio.currentTime = 0;

        audio.src = audioFile;

        audio.load();


        /* ---------------------------------------------
           Show player
        --------------------------------------------- */

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }


        /* ---------------------------------------------
           Play
        --------------------------------------------- */

        const playPromise = audio.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {

                    updatePlayerButton(true);

                })
                .catch(error => {

                    console.warn(
                        "Mbzedmusic audio could not play:",
                        error
                    );

                    updatePlayerButton(false);

                });
        }

        updatePlayerButton(true);
    }


    /* =====================================================
       PLAY / PAUSE
       ===================================================== */

    function togglePlay() {

        if (!audio) return;

        /*
           Nothing loaded yet
        */

        if (!audio.src || audio.src === window.location.href) {

            if (musicButtons.length > 0) {
                loadSong(musicButtons[0]);
            }

            return;
        }


        if (audio.paused) {

            const playPromise = audio.play();

            if (playPromise !== undefined) {

                playPromise
                    .then(() => {
                        updatePlayerButton(true);
                    })
                    .catch(error => {
                        console.warn(
                            "Playback failed:",
                            error
                        );
                    });
            }

        } else {

            audio.pause();

            updatePlayerButton(false);
        }
    }


    /* =====================================================
       PLAYER BUTTON ICON
       ===================================================== */

    function updatePlayerButton(isPlaying) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        if (isPlaying) {

            icon.classList.remove("fa-play");

            icon.classList.add("fa-pause");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Pause music"
            );

        } else {

            icon.classList.remove("fa-pause");

            icon.classList.add("fa-play");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Play music"
            );
        }
    }


    /* =====================================================
       MUSIC BUTTON EVENTS
       ===================================================== */

    musicButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const audioFile =
                button.getAttribute("data-audio");

            if (!audioFile) {
                console.warn(
                    "This music button has no data-audio:",
                    button
                );

                return;
            }


            /*
               Same song:
               Play / pause instead of reloading
            */

            if (
                currentButton === button &&
                audio.src
            ) {

                togglePlay();

                return;
            }


            loadSong(button);

        });

    });


    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                togglePlay();

            }
        );
    }


    /* =====================================================
       AUDIO PLAY EVENT
       ===================================================== */

    if (audio) {

        audio.addEventListener(
            "play",
            () => {

                updatePlayerButton(true);

                if (musicPlayer) {
                    musicPlayer.classList.add("active");
                }

            }
        );


        /* =============================================
           AUDIO PAUSE EVENT
        ============================================= */

        audio.addEventListener(
            "pause",
            () => {

                updatePlayerButton(false);

            }
        );


        /* =============================================
           AUDIO ENDED
        ============================================= */

        audio.addEventListener(
            "ended",
            () => {

                updatePlayerButton(false);

                if (progressBar) {
                    progressBar.style.width = "0%";
                }

                /*
                   Optional autoplay next track
                */

                playNextTrack();

            }
        );


        /* =============================================
           AUDIO TIME UPDATE
        ============================================= */

        audio.addEventListener(
            "timeupdate",
            () => {

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {
                    return;
                }

                const percentage =
                    (audio.currentTime /
                        audio.duration) *
                    100;

                if (progressBar) {

                    progressBar.style.width =
                        `${percentage}%`;
                }

            }
        );


        /* =============================================
           AUDIO ERROR
        ============================================= */

        audio.addEventListener(
            "error",
            () => {

                console.error(
                    "Mbzedmusic audio error:",
                    audio.error
                );

                updatePlayerButton(false);

            }
        );
    }


    /* =====================================================
       NEXT TRACK
       ===================================================== */

    function playNextTrack() {

        if (!currentButton) return;

        const buttons =
            Array.from(musicButtons);

        const currentIndex =
            buttons.indexOf(currentButton);

        if (
            currentIndex === -1 ||
            currentIndex >= buttons.length - 1
        ) {
            return;
        }

        const nextButton =
            buttons[currentIndex + 1];

        if (
            nextButton &&
            nextButton.hasAttribute("data-audio")
        ) {

            loadSong(nextButton);
        }
    }


    /* =====================================================
       PROGRESS BAR CLICK
       ===================================================== */

    if (playerProgress) {

        playerProgress.addEventListener(
            "click",
            event => {

                if (!audio) return;

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {
                    return;
                }

                const rect =
                    playerProgress.getBoundingClientRect();

                const clickPosition =
                    event.clientX - rect.left;

                const percentage =
                    clickPosition / rect.width;

                audio.currentTime =
                    percentage *
                    audio.duration;

            }
        );
    }


    /* =====================================================
       SEARCH BUTTON
       ===================================================== */

    if (searchButton && searchBox) {

        searchButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                searchBox.classList.toggle(
                    "active"
                );

                if (
                    searchBox.classList.contains("active") &&
                    searchInput
                ) {

                    setTimeout(() => {
                        searchInput.focus();
                    }, 100);
                }

            }
        );
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                const searchableItems =
                    document.querySelectorAll(
                        ".track, .release-card, .chart-item"
                    );

                searchableItems.forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();

                    if (
                        !query ||
                        text.includes(query)
                    ) {

                        item.style.display = "";

                    } else {

                        item.style.display = "none";
                    }

                });

            }
        );
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (mobileMenu && navigation) {

        mobileMenu.addEventListener(
            "click",
            event => {

                event.preventDefault();

                navigation.classList.toggle(
                    "active"
                );


                const icon =
                    mobileMenu.querySelector("i");

                if (icon) {

                    if (
                        navigation.classList.contains(
                            "active"
                        )
                    ) {

                        icon.classList.remove(
                            "fa-bars"
                        );

                        icon.classList.add(
                            "fa-times"
                        );

                    } else {

                        icon.classList.remove(
                            "fa-times"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );
                    }
                }

            }
        );


        /* Close menu after clicking a link */

        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navigation.classList.remove(
                            "active"
                        );

                        const icon =
                            mobileMenu.querySelector("i");

                        if (icon) {

                            icon.classList.remove(
                                "fa-times"
                            );

                            icon.classList.add(
                                "fa-bars"
                            );
                        }

                    }
                );

            });
    }


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletterForm =
        document.querySelector(
            ".newsletter-form"
        );

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    newsletterForm.querySelector(
                        "input"
                    );

                if (!input || !input.value.trim()) {
                    return;
                }

                alert(
                    "Thank you for subscribing to Mbzedmusic.com!"
                );

                input.value = "";

            }
        );
    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".navigation a"
        );

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navLinks.forEach(item => {
                    item.classList.remove("active");
                });

                link.classList.add("active");

            }
        );

    });


    /* =====================================================
       SMOOTH ANCHOR LINKS
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =====================================================
       DEBUG MESSAGE
       ===================================================== */

    console.log(
        "Mbzedmusic.com player loaded successfully."
    );

    console.log(
        "Music buttons found:",
        musicButtons.length
    );

});

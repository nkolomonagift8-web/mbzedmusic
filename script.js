```javascript
/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLAYER + SITE INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const audio = document.querySelector("#audioPlayer");
    const player = document.querySelector(".music-player");

    if (!audio || !player) {
        console.warn("Mbzedmusic player: audio/player element not found.");
    }

    const playButtons = document.querySelectorAll(
        ".play-button, .card-play, [data-play], [data-audio]"
    );

    const mainPlayButton = document.querySelector(
        ".main-player-button"
    );

    const playerCover = document.querySelector(
        ".player-cover"
    );

    const playerTitle = document.querySelector(
        ".player-info h3"
    );

    const playerArtist = document.querySelector(
        ".player-info p"
    );

    const progressBar = document.querySelector(
        ".player-progress"
    );

    const progressFill = document.querySelector(
        ".player-progress > div"
    );


    /* =====================================================
       CREATE PLAYER CONTROLS IF THEY DON'T EXIST
       ===================================================== */

    const playerInner = document.querySelector(".player-inner");

    let previousButton = document.querySelector(".player-prev");
    let nextButton = document.querySelector(".player-next");
    let volumeControl = document.querySelector(".player-volume");
    let timeDisplay = document.querySelector(".player-time");
    let closeButton = document.querySelector(".player-close");

    if (playerInner) {

        if (!previousButton) {
            previousButton = document.createElement("button");
            previousButton.className = "player-prev";
            previousButton.type = "button";
            previousButton.innerHTML =
                '<i class="fas fa-backward"></i>';
            previousButton.setAttribute("aria-label", "Previous track");

            playerInner.insertBefore(
                previousButton,
                playerInner.firstChild
            );
        }

        if (!nextButton) {
            nextButton = document.createElement("button");
            nextButton.className = "player-next";
            nextButton.type = "button";
            nextButton.innerHTML =
                '<i class="fas fa-forward"></i>';
            nextButton.setAttribute("aria-label", "Next track");

            playerInner.appendChild(nextButton);
        }

        if (!timeDisplay) {
            timeDisplay = document.createElement("span");
            timeDisplay.className = "player-time";
            timeDisplay.textContent = "0:00 / 0:00";
            playerInner.appendChild(timeDisplay);
        }

        if (!closeButton) {
            closeButton = document.createElement("button");
            closeButton.className = "player-close";
            closeButton.type = "button";
            closeButton.innerHTML =
                '<i class="fas fa-times"></i>';
            closeButton.setAttribute("aria-label", "Close player");

            player.appendChild(closeButton);
        }
    }


    /* =====================================================
       TRACK LIST
       ===================================================== */

    const tracks = [];

    document
        .querySelectorAll("[data-audio]")
        .forEach((element) => {

            const audioSrc =
                element.getAttribute("data-audio");

            if (!audioSrc) return;

            let title =
                element.dataset.title ||
                element.getAttribute("data-song") ||
                "";

            let artist =
                element.dataset.artist ||
                "";

            let cover =
                element.dataset.cover ||
                "";

            /*
             * Try to get information from the surrounding card.
             */

            if (!title) {
                const titleElement =
                    element.closest(".release-card, .track, .chart-item")
                    ?.querySelector("h3");

                if (titleElement) {
                    title = titleElement.textContent.trim();
                }
            }

            if (!artist) {
                const artistElement =
                    element.closest(".release-card, .track, .chart-item")
                    ?.querySelector("p");

                if (artistElement) {
                    artist = artistElement.textContent.trim();
                }
            }

            if (!cover) {

                const imageElement =
                    element.closest(".release-card, .track, .chart-item")
                    ?.querySelector(
                        ".release-image, .track-image, .mini-cover"
                    );

                if (imageElement) {

                    const style =
                        imageElement.style.backgroundImage;

                    if (style) {
                        cover = style;
                    }
                }

                if (!cover) {

                    const img =
                        element.closest(".release-card, .track, .chart-item")
                        ?.querySelector("img");

                    if (img) {
                        cover = img.src;
                    }
                }
            }

            tracks.push({
                element,
                src: audioSrc,
                title: title || "Unknown Track",
                artist: artist || "Mbzedmusic",
                cover: cover || ""
            });
        });


    let currentTrackIndex = -1;


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return (
            minutes +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }


    /* =====================================================
       SHOW PLAYER
       ===================================================== */

    function showPlayer() {

        if (!player) return;

        player.classList.add("active");
    }


    /* =====================================================
       HIDE PLAYER
       ===================================================== */

    function hidePlayer() {

        if (!player) return;

        player.classList.remove("active");
    }


    /* =====================================================
       UPDATE PLAY BUTTONS
       ===================================================== */

    function updatePlayButton() {

        if (!mainPlayButton) return;

        const icon =
            mainPlayButton.querySelector("i");

        if (!icon) return;

        if (audio && !audio.paused) {

            icon.classList.remove("fa-play");

            icon.classList.add("fa-pause");

        } else {

            icon.classList.remove("fa-pause");

            icon.classList.add("fa-play");
        }
    }


    /* =====================================================
       LOAD TRACK
       ===================================================== */

    function loadTrack(index, autoplay = true) {

        if (!audio) return;

        if (!tracks.length) {
            console.warn(
                "Mbzedmusic: No [data-audio] tracks found."
            );
            return;
        }

        if (index < 0) {
            index = tracks.length - 1;
        }

        if (index >= tracks.length) {
            index = 0;
        }

        currentTrackIndex = index;

        const track = tracks[index];

        audio.src = track.src;

        audio.load();

        /*
         * Update title
         */

        if (playerTitle) {
            playerTitle.textContent =
                track.title;
        }

        /*
         * Update artist
         */

        if (playerArtist) {
            playerArtist.textContent =
                track.artist;
        }

        /*
         * Update cover
         */

        if (playerCover && track.cover) {

            if (
                track.cover.includes("url(")
            ) {
                playerCover.style.backgroundImage =
                    track.cover;
            } else {
                playerCover.style.backgroundImage =
                    `url("${track.cover}")`;
            }
        }

        /*
         * Mark active track
         */

        tracks.forEach((item, i) => {

            item.element.classList.toggle(
                "playing",
                i === currentTrackIndex
            );
        });

        showPlayer();

        if (autoplay) {

            const playPromise =
                audio.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch((error) => {

                    console.warn(
                        "Mbzedmusic audio playback:",
                        error
                    );

                    updatePlayButton();
                });
            }
        }

        updatePlayButton();
    }


    /* =====================================================
       PLAY / PAUSE
       ===================================================== */

    function togglePlay() {

        if (!audio) return;

        /*
         * If no track has been selected,
         * start the first track.
         */

        if (!audio.src || audio.src === window.location.href) {

            if (tracks.length) {
                loadTrack(0, true);
            }

            return;
        }

        if (audio.paused) {

            const promise =
                audio.play();

            if (
                promise &&
                typeof promise.catch === "function"
            ) {
                promise.catch((error) => {
                    console.warn(
                        "Mbzedmusic playback error:",
                        error
                    );
                });
            }

        } else {

            audio.pause();
        }
    }


    /* =====================================================
       PLAY BUTTONS ON SONGS
       ===================================================== */

    playButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            /*
             * Find the audio source.
             */

            const source =
                button.getAttribute("data-audio");

            if (!source) {

                /*
                 * If the button doesn't itself have
                 * data-audio, look at its parent.
                 */

                const parent =
                    button.closest("[data-audio]");

                if (parent) {

                    const parentSource =
                        parent.getAttribute("data-audio");

                    if (parentSource) {

                        const index =
                            tracks.findIndex(
                                item =>
                                    item.src === parentSource
                            );

                        if (index !== -1) {
                            event.preventDefault();
                            loadTrack(index, true);
                        }

                        return;
                    }
                }

                return;
            }

            event.preventDefault();

            const index =
                tracks.findIndex(
                    item =>
                        item.src === source
                );

            if (index !== -1) {

                /*
                 * Same song:
                 * toggle play/pause.
                 */

                if (
                    currentTrackIndex === index &&
                    audio &&
                    audio.src
                ) {

                    togglePlay();

                } else {

                    loadTrack(index, true);
                }

            } else {

                /*
                 * Support a button whose
                 * data-audio wasn't included
                 * during initial scanning.
                 */

                if (audio) {

                    audio.src = source;

                    audio.load();

                    showPlayer();

                    audio.play().catch(() => {});
                }
            }
        });
    });


    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayButton) {

        mainPlayButton.addEventListener(
            "click",
            togglePlay
        );
    }


    /* =====================================================
       PREVIOUS TRACK
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                if (!tracks.length) return;

                let previousIndex =
                    currentTrackIndex - 1;

                if (previousIndex < 0) {
                    previousIndex =
                        tracks.length - 1;
                }

                loadTrack(
                    previousIndex,
                    true
                );
            }
        );
    }


    /* =====================================================
       NEXT TRACK
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                if (!tracks.length) return;

                let nextIndex =
                    currentTrackIndex + 1;

                if (
                    nextIndex >= tracks.length
                ) {
                    nextIndex = 0;
                }

                loadTrack(
                    nextIndex,
                    true
                );
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

                updatePlayButton();

                player?.classList.add(
                    "is-playing"
                );
            }
        );


        /* =================================================
           AUDIO PAUSE EVENT
           ================================================= */

        audio.addEventListener(
            "pause",
            () => {

                updatePlayButton();

                player?.classList.remove(
                    "is-playing"
                );
            }
        );


        /* =================================================
           AUDIO ENDED
           ================================================= */

        audio.addEventListener(
            "ended",
            () => {

                if (!tracks.length) {

                    updatePlayButton();

                    return;
                }

                let nextIndex =
                    currentTrackIndex + 1;

                if (
                    nextIndex >= tracks.length
                ) {
                    nextIndex = 0;
                }

                loadTrack(
                    nextIndex,
                    true
                );
            }
        );


        /* =================================================
           AUDIO TIME UPDATE
           ================================================= */

        audio.addEventListener(
            "timeupdate",
            () => {

                if (
                    !audio.duration ||
                    !Number.isFinite(audio.duration)
                ) {
                    return;
                }

                const percentage =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;

                if (progressFill) {

                    progressFill.style.width =
                        `${percentage}%`;
                }

                if (timeDisplay) {

                    timeDisplay.textContent =
                        `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                }
            }
        );


        /* =================================================
           AUDIO METADATA
           ================================================= */

        audio.addEventListener(
            "loadedmetadata",
            () => {

                if (timeDisplay) {

                    timeDisplay.textContent =
                        `0:00 / ${formatTime(audio.duration)}`;
                }
            }
        );


        /* =================================================
           AUDIO ERROR
           ================================================= */

        audio.addEventListener(
            "error",
            () => {

                console.error(
                    "Mbzedmusic: Unable to load audio:",
                    audio.src
                );

                updatePlayButton();
            }
        );
    }


    /* =====================================================
       PROGRESS BAR CLICK
       ===================================================== */

    if (progressBar) {

        progressBar.addEventListener(
            "click",
            (event) => {

                if (
                    !audio ||
                    !audio.duration ||
                    !Number.isFinite(audio.duration)
                ) {
                    return;
                }

                const rect =
                    progressBar.getBoundingClientRect();

                const clickPosition =
                    event.clientX -
                    rect.left;

                const percentage =
                    clickPosition /
                    rect.width;

                audio.currentTime =
                    percentage *
                    audio.duration;
            }
        );
    }


    /* =====================================================
       KEYBOARD SUPPORT
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Don't interfere while typing.
             */

            const tag =
                document.activeElement?.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }

            /*
             * Space = Play / Pause
             */

            if (
                event.code === "Space"
            ) {

                event.preventDefault();

                togglePlay();
            }


            /*
             * Arrow Right = Next
             */

            if (
                event.code === "ArrowRight"
            ) {

                if (audio && audio.duration) {

                    audio.currentTime =
                        Math.min(
                            audio.currentTime + 5,
                            audio.duration
                        );
                }
            }


            /*
             * Arrow Left = Previous 5 seconds
             */

            if (
                event.code === "ArrowLeft"
            ) {

                if (audio) {

                    audio.currentTime =
                        Math.max(
                            audio.currentTime - 5,
                            0
                        );
                }
            }
        }
    );


    /* =====================================================
       VOLUME CONTROL
       ===================================================== */

    if (!volumeControl && playerInner) {

        volumeControl =
            document.createElement("input");

        volumeControl.type =
            "range";

        volumeControl.className =
            "player-volume";

        volumeControl.min =
            "0";

        volumeControl.max =
            "1";

        volumeControl.step =
            "0.01";

        volumeControl.value =
            audio ? audio.volume : "1";

        volumeControl.setAttribute(
            "aria-label",
            "Volume"
        );

        playerInner.appendChild(
            volumeControl
        );
    }

    if (volumeControl && audio) {

        volumeControl.addEventListener(
            "input",
            () => {

                audio.volume =
                    Number(
                        volumeControl.value
                    );
            }
        );
    }


    /* =====================================================
       CLOSE PLAYER
       ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                if (audio) {
                    audio.pause();
                }

                hidePlayer();
            }
        );
    }


    /* =====================================================
       SEARCH
       ===================================================== */

    const searchButton =
        document.querySelector(".search-button");

    const searchBox =
        document.querySelector(".search-box");

    const searchInput =
        document.querySelector(
            ".search-inner input"
        );

    if (searchButton && searchBox) {

        searchButton.addEventListener(
            "click",
            () => {

                searchBox.classList.toggle(
                    "active"
                );

                if (
                    searchBox.classList.contains(
                        "active"
                    ) &&
                    searchInput
                ) {

                    setTimeout(
                        () => searchInput.focus(),
                        100
                    );
                }
            }
        );
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const navigation =
        document.querySelector(".navigation");

    if (mobileMenu && navigation) {

        mobileMenu.addEventListener(
            "click",
            () => {

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


        /*
         * Close mobile menu after clicking
         * a navigation link.
         */

        navigation
            .querySelectorAll("a")
            .forEach((link) => {

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

    const newsletterForms =
        document.querySelectorAll(
            ".newsletter-form"
        );

    newsletterForms.forEach((form) => {

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const input =
                    form.querySelector("input");

                if (!input) return;

                const email =
                    input.value.trim();

                if (!email) {

                    input.focus();

                    return;
                }

                alert(
                    "Thank you for subscribing to Mbzedmusic!"
                );

                input.value = "";
            }
        );
    });


    /* =====================================================
       SMOOTH SCROLL
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

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
       ACTIVE NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".navigation a"
        );

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    navLinks.forEach((link) => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const linkPage =
            href
                .split("/")
                .pop()
                .split("#")[0]
                .toLowerCase();

        if (
            linkPage &&
            linkPage === currentPage
        ) {

            navLinks.forEach(
                item =>
                    item.classList.remove("active")
            );

            link.classList.add("active");
        }
    });


    /* =====================================================
       INITIAL PLAYER STATE
       ===================================================== */

    if (audio) {

        audio.volume = 1;

        updatePlayButton();
    }

    console.log(
        `Mbzedmusic player ready — ${tracks.length} track(s) found.`
    );

});
```

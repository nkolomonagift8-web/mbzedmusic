```javascript
/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLAYER + SITE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const mobileMenu = $(".mobile-menu");
    const navigation = $(".navigation");

    if (mobileMenu && navigation) {
        mobileMenu.addEventListener("click", () => {

            navigation.classList.toggle("active");

            const icon = $("i", mobileMenu);

            if (icon) {
                if (navigation.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                } else {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }

        });

        $$(".navigation a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("active");

                const icon = $("i", mobileMenu);

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }


    /* =====================================================
       SEARCH BOX
       ===================================================== */

    const searchButton = $(".search-button");
    const searchBox = $(".search-box");
    const searchInput = $(".search-inner input");

    if (searchButton && searchBox) {

        searchButton.addEventListener("click", () => {

            searchBox.classList.toggle("active");

            if (searchBox.classList.contains("active") && searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }

        });
    }


    /* =====================================================
       MUSIC PLAYER
       ===================================================== */

    let audio = new Audio();

    audio.preload = "metadata";

    let currentIndex = -1;
    let isShuffle = false;
    let isRepeat = false;

    const player = $(".music-player");
    const playerCover = $(".player-cover");
    const playerTitle = $(".player-info h3");
    const playerArtist = $(".player-info p");
    const mainPlayButton = $(".main-player-button");
    const progressContainer = $(".player-progress");
    const progressBar = $(".player-progress > div");

    /* Create extra player controls if they exist */
    const nextButton =
        $(".player-next") ||
        $('[data-player="next"]');

    const previousButton =
        $(".player-previous") ||
        $('[data-player="previous"]');

    const shuffleButton =
        $(".player-shuffle") ||
        $('[data-player="shuffle"]');

    const repeatButton =
        $(".player-repeat") ||
        $('[data-player="repeat"]');

    const volumeControl =
        $(".player-volume") ||
        $('[data-player="volume"]');

    const currentTimeElement =
        $(".player-current-time") ||
        $('[data-player="current-time"]');

    const durationElement =
        $(".player-duration") ||
        $('[data-player="duration"]');


    /* =====================================================
       FIND ALL SONG BUTTONS
       ===================================================== */

    const playButtons = $$(
        ".play-button, .card-play, [data-audio]"
    );


    /* =====================================================
       SONG LIST
       ===================================================== */

    function getSongs() {

        const songs = [];

        playButtons.forEach(button => {

            const audioFile =
                button.dataset.audio ||
                button.getAttribute("data-audio");

            if (!audioFile) return;

            const card =
                button.closest(
                    ".track, .release-card, .chart-item, [data-song]"
                );

            let title =
                button.dataset.title ||
                button.getAttribute("data-title");

            let artist =
                button.dataset.artist ||
                button.getAttribute("data-artist");

            let cover =
                button.dataset.cover ||
                button.getAttribute("data-cover");

            if (!title && card) {

                const titleElement =
                    $("h3", card);

                if (titleElement) {
                    title = titleElement.textContent.trim();
                }
            }

            if (!artist && card) {

                const artistElement =
                    $("p", card);

                if (artistElement) {
                    artist = artistElement.textContent.trim();
                }
            }

            if (!cover && card) {

                const imageElement =
                    $(".track-image, .release-image, .mini-cover", card);

                if (imageElement) {

                    const inlineImage =
                        imageElement.style.backgroundImage;

                    if (inlineImage) {
                        cover = inlineImage
                            .replace(/^url\(["']?/, "")
                            .replace(/["']?\)$/, "");
                    }
                }
            }

            songs.push({
                button,
                audio: audioFile,
                title: title || "Unknown Song",
                artist: artist || "Mbzedmusic",
                cover: cover || ""
            });

        });

        return songs;
    }


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
       UPDATE PLAYER
       ===================================================== */

    function updatePlayer(song) {

        if (!song) return;

        if (playerTitle) {
            playerTitle.textContent =
                song.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                song.artist;
        }

        if (playerCover && song.cover) {

            playerCover.style.backgroundImage =
                `url("${song.cover}")`;

        }

        if (player) {
            player.classList.add("active");
        }
    }


    /* =====================================================
       UPDATE PLAY ICON
       ===================================================== */

    function updatePlayButton(button, playing) {

        if (!button) return;

        const icon = $("i", button);

        if (!icon) return;

        icon.classList.remove(
            "fa-play",
            "fa-pause"
        );

        icon.classList.add(
            playing ? "fa-pause" : "fa-play"
        );
    }


    /* =====================================================
       RESET ALL BUTTONS
       ===================================================== */

    function resetPlayButtons() {

        playButtons.forEach(button => {
            updatePlayButton(button, false);
        });
    }


    /* =====================================================
       LOAD SONG
       ===================================================== */

    function loadSong(index, autoPlay = true) {

        const songs = getSongs();

        if (!songs.length) return;

        if (index < 0) {
            index = songs.length - 1;
        }

        if (index >= songs.length) {
            index = 0;
        }

        currentIndex = index;

        const song = songs[currentIndex];

        audio.src = song.audio;

        audio.load();

        updatePlayer(song);

        resetPlayButtons();

        updatePlayButton(
            song.button,
            autoPlay
        );

        if (autoPlay) {

            const playPromise =
                audio.play();

            if (playPromise !== undefined) {

                playPromise.catch(error => {
                    console.warn(
                        "Audio playback could not start:",
                        error
                    );

                    updatePlayButton(
                        song.button,
                        false
                    );
                });
            }
        }
    }


    /* =====================================================
       PLAY / PAUSE
       ===================================================== */

    function togglePlay() {

        if (!audio.src) {

            const songs = getSongs();

            if (songs.length) {
                loadSong(0, true);
            }

            return;
        }

        if (audio.paused) {

            audio.play()
                .catch(error => {
                    console.warn(
                        "Playback failed:",
                        error
                    );
                });

        } else {

            audio.pause();
        }
    }


    if (mainPlayButton) {

        mainPlayButton.addEventListener(
            "click",
            togglePlay
        );
    }


    /* =====================================================
       SONG BUTTONS
       ===================================================== */

    playButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            const songs = getSongs();

            const index =
                songs.findIndex(
                    song => song.button === button
                );

            if (index === -1) return;

            if (
                currentIndex === index &&
                !audio.paused
            ) {

                audio.pause();

            } else {

                loadSong(index, true);
            }

        });

    });


    /* =====================================================
       AUDIO PLAY EVENT
       ===================================================== */

    audio.addEventListener("play", () => {

        resetPlayButtons();

        const songs = getSongs();

        if (
            currentIndex >= 0 &&
            songs[currentIndex]
        ) {

            updatePlayButton(
                songs[currentIndex].button,
                true
            );
        }

        if (mainPlayButton) {

            const icon =
                $("i", mainPlayButton);

            if (icon) {

                icon.classList.remove(
                    "fa-play"
                );

                icon.classList.add(
                    "fa-pause"
                );
            }
        }

    });


    /* =====================================================
       AUDIO PAUSE EVENT
       ===================================================== */

    audio.addEventListener("pause", () => {

        const songs = getSongs();

        if (
            currentIndex >= 0 &&
            songs[currentIndex]
        ) {

            updatePlayButton(
                songs[currentIndex].button,
                false
            );
        }

        if (mainPlayButton) {

            const icon =
                $("i", mainPlayButton);

            if (icon) {

                icon.classList.remove(
                    "fa-pause"
                );

                icon.classList.add(
                    "fa-play"
                );
            }
        }

    });


    /* =====================================================
       PROGRESS
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) return;

            const percentage =
                (audio.currentTime /
                audio.duration) * 100;

            if (progressBar) {

                progressBar.style.width =
                    percentage + "%";
            }

            if (currentTimeElement) {

                currentTimeElement.textContent =
                    formatTime(
                        audio.currentTime
                    );
            }

        }
    );


    /* =====================================================
       METADATA LOADED
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (durationElement) {

                durationElement.textContent =
                    formatTime(
                        audio.duration
                    );
            }

        }
    );


    /* =====================================================
       CLICK PROGRESS BAR
       ===================================================== */

    if (progressContainer) {

        progressContainer.addEventListener(
            "click",
            event => {

                if (!audio.duration) return;

                const rect =
                    progressContainer.getBoundingClientRect();

                const clickPosition =
                    event.clientX - rect.left;

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
       NEXT SONG
       ===================================================== */

    function nextSong() {

        const songs = getSongs();

        if (!songs.length) return;

        let nextIndex;

        if (isShuffle && songs.length > 1) {

            do {
                nextIndex =
                    Math.floor(
                        Math.random() *
                        songs.length
                    );
            }
            while (
                nextIndex === currentIndex
            );

        } else {

            nextIndex =
                currentIndex + 1;

            if (
                nextIndex >= songs.length
            ) {
                nextIndex = 0;
            }
        }

        loadSong(nextIndex, true);
    }


    /* =====================================================
       PREVIOUS SONG
       ===================================================== */

    function previousSong() {

        const songs = getSongs();

        if (!songs.length) return;

        /*
         * If the song has already played for
         * more than 3 seconds, restart it.
         */

        if (audio.currentTime > 3) {

            audio.currentTime = 0;

            return;
        }

        let previousIndex =
            currentIndex - 1;

        if (previousIndex < 0) {
            previousIndex =
                songs.length - 1;
        }

        loadSong(previousIndex, true);
    }


    if (nextButton) {
        nextButton.addEventListener(
            "click",
            nextSong
        );
    }


    if (previousButton) {
        previousButton.addEventListener(
            "click",
            previousSong
        );
    }


    /* =====================================================
       AUTO NEXT / REPEAT
       ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            if (isRepeat) {

                audio.currentTime = 0;

                audio.play();

                return;
            }

            nextSong();
        }
    );


    /* =====================================================
       SHUFFLE
       ===================================================== */

    if (shuffleButton) {

        shuffleButton.addEventListener(
            "click",
            () => {

                isShuffle =
                    !isShuffle;

                shuffleButton.classList.toggle(
                    "active",
                    isShuffle
                );

                shuffleButton.setAttribute(
                    "aria-pressed",
                    isShuffle
                );

            }
        );
    }


    /* =====================================================
       REPEAT
       ===================================================== */

    if (repeatButton) {

        repeatButton.addEventListener(
            "click",
            () => {

                isRepeat =
                    !isRepeat;

                repeatButton.classList.toggle(
                    "active",
                    isRepeat
                );

                repeatButton.setAttribute(
                    "aria-pressed",
                    isRepeat
                );

            }
        );
    }


    /* =====================================================
       VOLUME
       ===================================================== */

    if (volumeControl) {

        volumeControl.addEventListener(
            "input",
            () => {

                const volume =
                    Number(
                        volumeControl.value
                    );

                audio.volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            volume
                        )
                    );
            }
        );

        audio.volume =
            Number(
                volumeControl.value
            ) || 1;
    }


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Don't hijack keyboard input
             * when user is typing.
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


            /* SPACE = PLAY / PAUSE */

            if (event.code === "Space") {

                event.preventDefault();

                togglePlay();
            }


            /* RIGHT ARROW = NEXT */

            if (
                event.code === "ArrowRight"
            ) {

                nextSong();
            }


            /* LEFT ARROW = PREVIOUS */

            if (
                event.code === "ArrowLeft"
            ) {

                previousSong();
            }


            /* UP = VOLUME UP */

            if (
                event.code === "ArrowUp"
            ) {

                audio.volume =
                    Math.min(
                        1,
                        audio.volume + 0.05
                    );

                if (volumeControl) {
                    volumeControl.value =
                        audio.volume;
                }
            }


            /* DOWN = VOLUME DOWN */

            if (
                event.code === "ArrowDown"
            ) {

                audio.volume =
                    Math.max(
                        0,
                        audio.volume - 0.05
                    );

                if (volumeControl) {
                    volumeControl.value =
                        audio.volume;
                }
            }

        }
    );


    /* =====================================================
       SEARCH FILTER
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchTerm =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                const searchableCards = $$(
                    ".track, .release-card, .chart-item"
                );

                searchableCards.forEach(card => {

                    const text =
                        card.textContent
                            .toLowerCase();

                    if (
                        !searchTerm ||
                        text.includes(searchTerm)
                    ) {

                        card.style.display = "";

                    } else {

                        card.style.display =
                            "none";
                    }

                });

            }
        );
    }


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletterForm =
        $(".newsletter-form");

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    $("input", newsletterForm);

                if (!input) return;

                const email =
                    input.value.trim();

                if (!email) {

                    input.focus();

                    return;
                }

                /*
                 * Temporary frontend confirmation.
                 * Connect this to your backend/email
                 * service later.
                 */

                alert(
                    "Thank you for joining Mbzedmusic!"
                );

                newsletterForm.reset();
            }
        );
    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        $('[href="#top"]') ||
        $('[data-back-to-top]');

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


    /* =====================================================
       SMOOTH INTERNAL LINKS
       ===================================================== */

    $$('a[href^="#"]').forEach(link => {

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
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() ||
        "index.html";

    $$(".navigation a").forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const cleanHref =
            href.split("#")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .toLowerCase();

        if (
            cleanHref === currentPage ||
            (
                currentPage === "" &&
                cleanHref === "index.html"
            )
        ) {

            link.classList.add("active");
        }

    });


    /* =====================================================
       IMAGE ERROR PROTECTION
       ===================================================== */

    $$("img").forEach(image => {

        image.addEventListener(
            "error",
            () => {

                image.style.opacity = "0.5";

                console.warn(
                    "Image could not be loaded:",
                    image.src
                );

            }
        );

    });


    /* =====================================================
       INITIAL PLAYER STATE
       ===================================================== */

    if (progressBar) {
        progressBar.style.width = "0%";
    }

    if (currentTimeElement) {
        currentTimeElement.textContent = "0:00";
    }

    if (durationElement) {
        durationElement.textContent = "0:00";
    }


    /* =====================================================
       GLOBAL PLAYER ACCESS
       ===================================================== */

    window.MbzedMusicPlayer = {

        play: togglePlay,

        next: nextSong,

        previous: previousSong,

        shuffle: () => {

            isShuffle =
                !isShuffle;

            if (shuffleButton) {
                shuffleButton.classList.toggle(
                    "active",
                    isShuffle
                );
            }

        },

        repeat: () => {

            isRepeat =
                !isRepeat;

            if (repeatButton) {
                repeatButton.classList.toggle(
                    "active",
                    isRepeat
                );
            }

        },

        getAudio: () => audio,

        getCurrentSong: () => {

            const songs = getSongs();

            return songs[currentIndex] || null;
        }

    };


    /* =====================================================
       READY
       ===================================================== */

    console.log(
        "🎵 Mbzedmusic player ready."
    );

    console.log(
        `🎶 ${getSongs().length} playable song(s) detected.`
    );

});
```

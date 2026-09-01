/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLAYER + SITE SCRIPT
   GitHub Pages compatible
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       HELPERS
       ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const getAudioPath = (value) => {
        if (!value) return "";

        value = value.trim();

        /*
         * If the user entered:
         * songs/song.mp3
         * ./songs/song.mp3
         * /mbzedmusic/songs/song.mp3
         * https://...
         *
         * all are handled.
         */

        if (
            value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("/")
        ) {
            return value;
        }

        return value.replace(/^\.?\//, "");
    };


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
       SEARCH FUNCTION
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const query = searchInput.value
                .toLowerCase()
                .trim();

            const searchableItems = $$(
                ".track, .release-card, .chart-item, .genre-card"
            );

            searchableItems.forEach(item => {

                const text = item.innerText.toLowerCase();

                if (!query || text.includes(query)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }

            });

        });

    }


    /* =====================================================
       MUSIC PLAYER ELEMENTS
       ===================================================== */

    const player = $(".music-player");

    if (!player) {
        console.warn("Mbzedmusic: .music-player was not found.");
        return;
    }

    const playerCover = $(".player-cover", player);
    const playerTitle = $(".player-info h3", player);
    const playerArtist = $(".player-info p", player);
    const mainPlayerButton = $(".main-player-button", player);
    const progressBar = $(".player-progress", player);
    const progressFill = $(".player-progress > div", player);


    /* =====================================================
       CREATE AUDIO ELEMENT
       ===================================================== */

    let audio = document.getElementById("mbzed-audio");

    if (!audio) {

        audio = document.createElement("audio");

        audio.id = "mbzed-audio";

        audio.preload = "metadata";

        audio.style.display = "none";

        document.body.appendChild(audio);

    }


    /* =====================================================
       PLAYER STATE
       ===================================================== */

    let currentButton = null;
    let currentAudio = "";
    let isLoading = false;


    /* =====================================================
       GET SONG INFORMATION
       ===================================================== */

    function getSongData(button) {

        if (!button) return null;

        const audioSource =
            button.dataset.audio ||
            button.getAttribute("data-audio") ||
            button.closest("[data-audio]")?.dataset.audio;

        if (!audioSource) {
            return null;
        }

        let title =
            button.dataset.title ||
            button.getAttribute("data-title");

        let artist =
            button.dataset.artist ||
            button.getAttribute("data-artist");

        /*
         * Try to find title/artist from the surrounding card.
         */

        const parent =
            button.closest(
                ".track, .release-card, .chart-item"
            );

        if (parent) {

            if (!title) {

                const titleElement =
                    $("h3", parent);

                if (titleElement) {
                    title = titleElement.textContent.trim();
                }

            }

            if (!artist) {

                const artistElement =
                    $("p", parent);

                if (artistElement) {
                    artist =
                        artistElement.textContent.trim();
                }

            }

        }

        /*
         * Find cover image.
         */

        let cover = "";

        if (button.dataset.cover) {
            cover = button.dataset.cover;
        }

        if (!cover && parent) {

            const imageElement =
                $(".track-image, .release-image, .mini-cover", parent);

            if (imageElement) {

                const background =
                    getComputedStyle(imageElement)
                        .backgroundImage;

                if (
                    background &&
                    background !== "none"
                ) {

                    const match =
                        background.match(
                            /url\(["']?(.*?)["']?\)/
                        );

                    if (match) {
                        cover = match[1];
                    }

                }

                if (!cover && imageElement.tagName === "IMG") {
                    cover = imageElement.src;
                }

            }

        }

        return {
            audio: getAudioPath(audioSource),
            title: title || "Unknown Track",
            artist: artist || "Mbzedmusic",
            cover: cover || ""
        };

    }


    /* =====================================================
       UPDATE PLAYER UI
       ===================================================== */

    function updatePlayerUI(song) {

        if (!song) return;

        if (playerTitle) {
            playerTitle.textContent = song.title;
        }

        if (playerArtist) {
            playerArtist.textContent = song.artist;
        }

        if (playerCover && song.cover) {

            playerCover.style.backgroundImage =
                `url("${song.cover}")`;

        }

        player.classList.add("active");

    }


    /* =====================================================
       BUTTON ICON
       ===================================================== */

    function setButtonPlaying(button, playing) {

        if (!button) return;

        const icon = $("i", button);

        if (!icon) return;

        if (playing) {

            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");

            button.setAttribute(
                "aria-label",
                "Pause music"
            );

        } else {

            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");

            button.setAttribute(
                "aria-label",
                "Play music"
            );

        }

    }


    /* =====================================================
       RESET ALL PLAY BUTTONS
       ===================================================== */

    function resetAllButtons() {

        $$(".play-button, .card-play").forEach(button => {
            setButtonPlaying(button, false);
        });

    }


    /* =====================================================
       SHOW ERROR
       ===================================================== */

    function showAudioError(message) {

        console.error(
            "Mbzedmusic audio error:",
            message
        );

        if (playerTitle) {
            playerTitle.textContent = "Unable to play track";
        }

        if (playerArtist) {
            playerArtist.textContent = message;
        }

    }


    /* =====================================================
       PLAY SONG
       ===================================================== */

    function playSong(button) {

        const song = getSongData(button);

        if (!song || !song.audio) {

            showAudioError(
                "Add data-audio=\"your-song.mp3\" to the play button."
            );

            return;
        }

        /*
         * Same song:
         * just resume it.
         */

        if (
            currentAudio === song.audio &&
            audio.src
        ) {

            audio.play()
                .then(() => {

                    setButtonPlaying(button, true);

                })
                .catch(error => {

                    console.error(
                        "Playback failed:",
                        error
                    );

                    showAudioError(
                        "The browser could not play this file."
                    );

                });

            return;
        }


        /*
         * New song
         */

        isLoading = true;

        resetAllButtons();

        currentButton = button;

        currentAudio = song.audio;

        updatePlayerUI(song);

        audio.pause();

        audio.currentTime = 0;

        /*
         * IMPORTANT:
         *
         * new URL() makes relative GitHub Pages
         * paths work correctly.
         */

        try {

            const absoluteURL =
                new URL(
                    song.audio,
                    window.location.href
                ).href;

            audio.src = absoluteURL;

        } catch (error) {

            console.error(
                "Invalid audio path:",
                song.audio,
                error
            );

            showAudioError(
                "Invalid audio file path."
            );

            isLoading = false;

            return;
        }

        audio.load();


        /*
         * Wait for browser to load enough metadata,
         * then start playing.
         */

        const startPlayback = () => {

            audio.play()
                .then(() => {

                    isLoading = false;

                    setButtonPlaying(
                        currentButton,
                        true
                    );

                })
                .catch(error => {

                    isLoading = false;

                    console.error(
                        "Could not start playback:",
                        error
                    );

                    showAudioError(
                        "Playback was blocked or the MP3 could not be loaded."
                    );

                });

        };


        /*
         * If metadata is already available.
         */

        if (audio.readyState >= 2) {
            startPlayback();
        } else {

            audio.addEventListener(
                "canplay",
                startPlayback,
                { once: true }
            );

        }

    }


    /* =====================================================
       PLAY / PAUSE BUTTONS
       ===================================================== */

    $$(".play-button, .card-play").forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            /*
             * Check that data-audio actually exists.
             */

            const song =
                getSongData(button);

            if (!song || !song.audio) {

                showAudioError(
                    "No MP3 found. Add data-audio=\"songs/your-song.mp3\" to this button."
                );

                return;
            }


            /*
             * Same current song.
             */

            if (
                currentAudio === song.audio &&
                !audio.paused
            ) {

                audio.pause();

                setButtonPlaying(
                    button,
                    false
                );

                return;
            }


            playSong(button);

        });

    });


    /* =====================================================
       MAIN PLAYER PLAY / PAUSE
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener("click", () => {

            if (!audio.src) {

                if (currentButton) {
                    playSong(currentButton);
                }

                return;
            }


            if (audio.paused) {

                audio.play()
                    .then(() => {

                        setButtonPlaying(
                            currentButton,
                            true
                        );

                    })
                    .catch(error => {

                        console.error(error);

                        showAudioError(
                            "Unable to resume this song."
                        );

                    });

            } else {

                audio.pause();

                setButtonPlaying(
                    currentButton,
                    false
                );

            }

        });

    }


    /* =====================================================
       AUDIO PLAY
       ===================================================== */

    audio.addEventListener("play", () => {

        setButtonPlaying(
            currentButton,
            true
        );

        if (mainPlayerButton) {

            const icon =
                $("i", mainPlayerButton);

            if (icon) {

                icon.classList.remove("fa-play");
                icon.classList.add("fa-pause");

            }

        }

    });


    /* =====================================================
       AUDIO PAUSE
       ===================================================== */

    audio.addEventListener("pause", () => {

        setButtonPlaying(
            currentButton,
            false
        );

        if (mainPlayerButton) {

            const icon =
                $("i", mainPlayerButton);

            if (icon) {

                icon.classList.remove("fa-pause");
                icon.classList.add("fa-play");

            }

        }

    });


    /* =====================================================
       AUDIO TIME UPDATE
       ===================================================== */

    audio.addEventListener("timeupdate", () => {

        if (
            !progressFill ||
            !audio.duration ||
            !isFinite(audio.duration)
        ) {
            return;
        }

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        progressFill.style.width =
            `${percentage}%`;

    });


    /* =====================================================
       CLICK PROGRESS BAR TO SEEK
       ===================================================== */

    if (progressBar) {

        progressBar.addEventListener("click", event => {

            if (
                !audio.duration ||
                !isFinite(audio.duration)
            ) {
                return;
            }

            const rect =
                progressBar.getBoundingClientRect();

            const clickPosition =
                event.clientX - rect.left;

            const percentage =
                clickPosition / rect.width;

            audio.currentTime =
                percentage * audio.duration;

        });

    }


    /* =====================================================
       SONG ENDED
       ===================================================== */

    audio.addEventListener("ended", () => {

        setButtonPlaying(
            currentButton,
            false
        );

        if (progressFill) {
            progressFill.style.width = "0%";
        }

        /*
         * Automatically move to the next playable
         * song on the page.
         */

        const buttons =
            $$(".play-button, .card-play");

        const currentIndex =
            buttons.indexOf(currentButton);

        if (
            currentIndex !== -1 &&
            buttons[currentIndex + 1]
        ) {

            const nextButton =
                buttons[currentIndex + 1];

            const nextSong =
                getSongData(nextButton);

            if (nextSong && nextSong.audio) {
                playSong(nextButton);
                return;
            }

        }

        currentButton = null;
        currentAudio = "";

    });


    /* =====================================================
       AUDIO LOADING ERROR
       ===================================================== */

    audio.addEventListener("error", () => {

        isLoading = false;

        resetAllButtons();

        const error =
            audio.error;

        let message =
            "Audio file could not be loaded.";

        if (error) {

            switch (error.code) {

                case 1:
                    message =
                        "Audio loading was aborted.";
                    break;

                case 2:
                    message =
                        "Network error while loading the MP3.";
                    break;

                case 3:
                    message =
                        "The MP3 could not be decoded.";
                    break;

                case 4:
                    message =
                        "This audio file is not supported or the file path is wrong.";
                    break;

            }

        }

        showAudioError(message);

    });


    /* =====================================================
       AUDIO CANPLAY
       ===================================================== */

    audio.addEventListener("canplay", () => {

        console.log(
            "Mbzedmusic: audio ready:",
            audio.currentSrc
        );

    });


    /* =====================================================
       DEBUG INFORMATION
       ===================================================== */

    console.log(
        "====================================="
    );

    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

    console.log(
        "Play buttons found:",
        $$(".play-button, .card-play").length
    );

    console.log(
        "Buttons with data-audio:",
        $$(".play-button[data-audio], .card-play[data-audio]").length
    );

    console.log(
        "=====================================");


    /* =====================================================
       CHECK AUDIO BUTTONS
       ===================================================== */

    $$(".play-button, .card-play").forEach((button, index) => {

        const audioPath =
            button.dataset.audio;

        if (audioPath) {

            console.log(
                `Track ${index + 1}:`,
                audioPath
            );

        }

    });


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletter =
        $(".newsletter-form");

    if (newsletter) {

        newsletter.addEventListener("submit", event => {

            event.preventDefault();

            const input =
                $("input", newsletter);

            if (!input || !input.value.trim()) {
                return;
            }

            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );

            input.value = "";

        });

    }


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        $('a[href="#top"], .back-to-top');

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
       SMOOTH INTERNAL LINKS
       ===================================================== */

    $$('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetID =
                link.getAttribute("href");

            if (
                !targetID ||
                targetID === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetID);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

});

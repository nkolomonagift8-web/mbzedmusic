/* =========================================================
   MBZEDMUSIC.COM
   PROFESSIONAL MUSIC PLAYER
   Complete script.js replacement
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const audio = new Audio();

    audio.preload = "metadata";

    let currentTrackIndex = -1;
    let tracks = [];
    let isPlaying = false;


    /* =====================================================
       FIND PLAYER ELEMENTS
       ===================================================== */

    const player = document.querySelector(".music-player");

    const playerCover = document.querySelector(".player-cover");

    const playerTitle = document.querySelector(".player-info h3");

    const playerArtist = document.querySelector(".player-info p");

    const mainPlayButton =
        document.querySelector(".main-player-button");

    const playerProgress =
        document.querySelector(".player-progress");

    const playerProgressBar =
        document.querySelector(".player-progress > div");


    /* =====================================================
       FIND ALL MUSIC BUTTONS
       ===================================================== */

    tracks = Array.from(
        document.querySelectorAll(
            "[data-audio]"
        )
    );


    /* =====================================================
       OPTIONAL CONTROL CREATION
       ===================================================== */

    let previousButton =
        document.querySelector(".player-previous");

    let nextButton =
        document.querySelector(".player-next");

    let volumeControl =
        document.querySelector(".player-volume");

    let currentTimeElement =
        document.querySelector(".player-current-time");

    let durationElement =
        document.querySelector(".player-duration");


    /* =====================================================
       ADD PLAYER CONTROLS IF THEY DON'T EXIST
       ===================================================== */

    if (player) {

        const inner =
            player.querySelector(".player-inner");

        if (inner) {

            /*
             * Previous button
             */

            if (!previousButton) {

                previousButton =
                    document.createElement("button");

                previousButton.className =
                    "player-previous";

                previousButton.type = "button";

                previousButton.innerHTML =
                    '<i class="fas fa-step-backward"></i>';

                previousButton.setAttribute(
                    "aria-label",
                    "Previous song"
                );

                /*
                 * Put previous button before play button
                 */

                if (mainPlayButton) {
                    inner.insertBefore(
                        previousButton,
                        mainPlayButton
                    );
                } else {
                    inner.appendChild(
                        previousButton
                    );
                }
            }


            /*
             * Next button
             */

            if (!nextButton) {

                nextButton =
                    document.createElement("button");

                nextButton.className =
                    "player-next";

                nextButton.type = "button";

                nextButton.innerHTML =
                    '<i class="fas fa-step-forward"></i>';

                nextButton.setAttribute(
                    "aria-label",
                    "Next song"
                );

                inner.appendChild(
                    nextButton
                );
            }


            /*
             * Volume
             */

            if (!volumeControl) {

                volumeControl =
                    document.createElement("input");

                volumeControl.type = "range";

                volumeControl.min = "0";

                volumeControl.max = "1";

                volumeControl.step = "0.01";

                volumeControl.value = "1";

                volumeControl.className =
                    "player-volume";

                volumeControl.setAttribute(
                    "aria-label",
                    "Volume"
                );

                inner.appendChild(
                    volumeControl
                );
            }


            /*
             * Time display
             */

            if (!currentTimeElement) {

                currentTimeElement =
                    document.createElement("span");

                currentTimeElement.className =
                    "player-current-time";

                currentTimeElement.textContent =
                    "0:00";

                inner.appendChild(
                    currentTimeElement
                );
            }


            if (!durationElement) {

                durationElement =
                    document.createElement("span");

                durationElement.className =
                    "player-duration";

                durationElement.textContent =
                    "0:00";

                inner.appendChild(
                    durationElement
                );
            }
        }
    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function formatTime(seconds) {

        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2, "0")
        );
    }


    /* =====================================================
       GET TRACK INFORMATION
       ===================================================== */

    function getTrackInfo(button) {

        if (!button) {
            return null;
        }

        const audioURL =
            button.dataset.audio;

        if (!audioURL) {
            return null;
        }


        /*
         * Try several common attributes/classes
         * for title and artist.
         */

        let title =
            button.dataset.title ||
            button.dataset.song ||
            button.dataset.track;


        let artist =
            button.dataset.artist;


        /*
         * If no data-title exists,
         * look inside the button/card.
         */

        if (!title) {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item, [data-track]"
                );

            if (card) {

                const titleElement =
                    card.querySelector(
                        "h3, .track-title, .song-title"
                    );

                const artistElement =
                    card.querySelector(
                        "p, .artist, .track-artist, .song-artist"
                    );

                if (titleElement) {
                    title =
                        titleElement.textContent.trim();
                }

                if (artistElement) {
                    artist =
                        artistElement.textContent.trim();
                }
            }
        }


        /*
         * Final fallbacks
         */

        title =
            title ||
            "Unknown Song";

        artist =
            artist ||
            "Mbzedmusic";


        /*
         * Artwork
         */

        let cover =
            button.dataset.cover ||
            button.dataset.image;


        if (!cover) {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item, [data-track]"
                );

            if (card) {

                const imageElement =
                    card.querySelector(
                        "img"
                    );

                if (imageElement) {

                    cover =
                        imageElement.src;
                }


                /*
                 * Background image
                 */

                if (!cover) {

                    const backgroundElement =
                        card.querySelector(
                            ".track-image, .release-image, .mini-cover"
                        );

                    if (backgroundElement) {

                        const style =
                            window.getComputedStyle(
                                backgroundElement
                            );

                        const background =
                            style.backgroundImage;

                        if (
                            background &&
                            background !== "none"
                        ) {

                            cover =
                                background
                                    .replace(
                                        /^url\(["']?/,
                                        ""
                                    )
                                    .replace(
                                        /["']?\)$/,
                                        ""
                                    );
                        }
                    }
                }
            }
        }


        return {
            url: audioURL,
            title: title,
            artist: artist,
            cover: cover
        };
    }


    /* =====================================================
       SHOW PLAYER
       ===================================================== */

    function showPlayer() {

        if (!player) {
            return;
        }

        player.classList.add(
            "active"
        );
    }


    /* =====================================================
       UPDATE PLAY BUTTON
       ===================================================== */

    function updateMainPlayButton() {

        if (!mainPlayButton) {
            return;
        }

        if (isPlaying) {

            mainPlayButton.innerHTML =
                '<i class="fas fa-pause"></i>';

            mainPlayButton.setAttribute(
                "aria-label",
                "Pause song"
            );

        } else {

            mainPlayButton.innerHTML =
                '<i class="fas fa-play"></i>';

            mainPlayButton.setAttribute(
                "aria-label",
                "Play song"
            );
        }
    }


    /* =====================================================
       LOAD TRACK
       ===================================================== */

    function loadTrack(index, autoPlay = true) {

        if (
            index < 0 ||
            index >= tracks.length
        ) {
            return;
        }

        const button =
            tracks[index];

        const info =
            getTrackInfo(button);

        if (!info) {
            return;
        }

        currentTrackIndex =
            index;


        /*
         * Set audio
         */

        audio.src =
            info.url;

        audio.load();


        /*
         * Player text
         */

        if (playerTitle) {

            playerTitle.textContent =
                info.title;
        }

        if (playerArtist) {

            playerArtist.textContent =
                info.artist;
        }


        /*
         * Artwork
         */

        if (
            playerCover &&
            info.cover
        ) {

            playerCover.style.backgroundImage =
                `url("${info.cover}")`;
        }


        /*
         * Reset progress
         */

        if (playerProgressBar) {

            playerProgressBar.style.width =
                "0%";
        }

        if (currentTimeElement) {

            currentTimeElement.textContent =
                "0:00";
        }

        if (durationElement) {

            durationElement.textContent =
                "0:00";
        }


        /*
         * Active track
         */

        tracks.forEach(
            track =>
                track.classList.remove(
                    "playing",
                    "active"
                )
        );

        button.classList.add(
            "playing",
            "active"
        );


        /*
         * Show player
         */

        showPlayer();


        /*
         * Play
         */

        if (autoPlay) {

            const playPromise =
                audio.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                    "function"
            ) {

                playPromise.catch(
                    error => {

                        console.warn(
                            "Playback could not start:",
                            error
                        );

                        isPlaying = false;

                        updateMainPlayButton();
                    }
                );
            }
        }
    }


    /* =====================================================
       PLAY / PAUSE
       ===================================================== */

    function togglePlay() {

        if (!audio.src) {

            if (tracks.length > 0) {

                loadTrack(
                    0,
                    true
                );
            }

            return;
        }


        if (audio.paused) {

            const playPromise =
                audio.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                    "function"
            ) {

                playPromise.catch(
                    error =>
                        console.warn(
                            "Playback error:",
                            error
                        )
                );
            }

        } else {

            audio.pause();
        }
    }


    /* =====================================================
       NEXT TRACK
       ===================================================== */

    function nextTrack() {

        if (!tracks.length) {
            return;
        }


        let nextIndex =
            currentTrackIndex + 1;


        /*
         * Loop back to first track
         */

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


    /* =====================================================
       PREVIOUS TRACK
       ===================================================== */

    function previousTrack() {

        if (!tracks.length) {
            return;
        }


        /*
         * If the song has already played
         * more than 3 seconds, restart it.
         */

        if (
            audio.currentTime > 3
        ) {

            audio.currentTime =
                0;

            return;
        }


        let previousIndex =
            currentTrackIndex - 1;


        if (
            previousIndex < 0
        ) {

            previousIndex =
                tracks.length - 1;
        }


        loadTrack(
            previousIndex,
            true
        );
    }


    /* =====================================================
       BUTTON EVENTS
       ===================================================== */

    tracks.forEach(
        (button, index) => {

            button.addEventListener(
                "click",
                event => {

                    /*
                     * Only prevent default if
                     * it is a music button.
                     */

                    const info =
                        getTrackInfo(button);

                    if (!info) {
                        return;
                    }

                    event.preventDefault();


                    /*
                     * Clicking the currently
                     * playing song toggles it.
                     */

                    if (
                        currentTrackIndex ===
                            index &&
                        audio.src
                    ) {

                        togglePlay();

                    } else {

                        loadTrack(
                            index,
                            true
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    if (mainPlayButton) {

        mainPlayButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                togglePlay();
            }
        );
    }


    /* =====================================================
       NEXT BUTTON
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                nextTrack();
            }
        );
    }


    /* =====================================================
       PREVIOUS BUTTON
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                previousTrack();
            }
        );
    }


    /* =====================================================
       AUDIO PLAY
       ===================================================== */

    audio.addEventListener(
        "play",
        () => {

            isPlaying = true;

            updateMainPlayButton();

            showPlayer();


            if (
                currentTrackIndex >= 0 &&
                tracks[currentTrackIndex]
            ) {

                tracks[
                    currentTrackIndex
                ].classList.add(
                    "playing"
                );
            }
        }
    );


    /* =====================================================
       AUDIO PAUSE
       ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            isPlaying = false;

            updateMainPlayButton();
        }
    );


    /* =====================================================
       AUDIO TIME UPDATE
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (!audio.duration) {
                return;
            }


            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            if (playerProgressBar) {

                playerProgressBar.style.width =
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
       AUDIO METADATA LOADED
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
       SONG ENDED
       ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            isPlaying = false;

            updateMainPlayButton();


            /*
             * Automatically play next song.
             */

            nextTrack();
        }
    );


    /* =====================================================
       AUDIO ERROR
       ===================================================== */

    audio.addEventListener(
        "error",
        () => {

            console.error(
                "Mbzedmusic audio error:",
                audio.error
            );

            isPlaying = false;

            updateMainPlayButton();


            if (playerTitle) {

                playerTitle.textContent =
                    "Unable to play song";
            }

            if (playerArtist) {

                playerArtist.textContent =
                    "Check the audio file";
            }
        }
    );


    /* =====================================================
       PROGRESS BAR CLICK
       ===================================================== */

    if (playerProgress) {

        playerProgress.addEventListener(
            "click",
            event => {

                if (!audio.duration) {
                    return;
                }


                const rect =
                    playerProgress.getBoundingClientRect();


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
       VOLUME CONTROL
       ===================================================== */

    if (volumeControl) {

        volumeControl.addEventListener(
            "input",
            () => {

                audio.volume =
                    parseFloat(
                        volumeControl.value
                    );
            }
        );
    }


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Don't interfere with typing.
             */

            const tag =
                document.activeElement
                    ?.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA"
            ) {
                return;
            }


            /*
             * Space = Play / Pause
             */

            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                togglePlay();
            }


            /*
             * Right arrow = Next
             */

            if (
                event.code ===
                "ArrowRight"
            ) {

                nextTrack();
            }


            /*
             * Left arrow = Previous
             */

            if (
                event.code ===
                "ArrowLeft"
            ) {

                previousTrack();
            }
        }
    );


    /* =====================================================
       INITIAL PLAYER STATE
       ===================================================== */

    audio.volume = 1;

    updateMainPlayButton();


    /* =====================================================
       CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "%c MBZEDMUSIC PLAYER READY ",
        "background:#18b968;color:#fff;font-weight:bold;padding:8px;"
    );

    console.log(
        "Tracks detected:",
        tracks.length
    );

});

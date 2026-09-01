/* =========================================================
   MBZEDMUSIC.COM
   ADVANCED MUSIC PLAYER
   AFRICAN MUSIC • OUR CULTURE • OUR SOUND
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

    const cleanPath = (path) => {

        if (!path) return "";

        path = path.trim();

        if (
            path.startsWith("http://") ||
            path.startsWith("https://") ||
            path.startsWith("/")
        ) {
            return path;
        }

        return path.replace(/^\.?\//, "");

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

                icon.classList.toggle(
                    "fa-bars",
                    !navigation.classList.contains("active")
                );

                icon.classList.toggle(
                    "fa-times",
                    navigation.classList.contains("active")
                );

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
       SEARCH
       ===================================================== */

    const searchButton = $(".search-button");
    const searchBox = $(".search-box");
    const searchInput = $(".search-inner input");

    if (searchButton && searchBox) {

        searchButton.addEventListener("click", () => {

            searchBox.classList.toggle("active");

            if (
                searchBox.classList.contains("active") &&
                searchInput
            ) {

                setTimeout(() => {
                    searchInput.focus();
                }, 100);

            }

        });

    }

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const query =
                searchInput.value
                    .toLowerCase()
                    .trim();

            $$(".track, .release-card, .chart-item, .genre-card")
                .forEach(item => {

                    const text =
                        item.innerText
                            .toLowerCase();

                    item.style.display =
                        !query || text.includes(query)
                            ? ""
                            : "none";

                });

        });

    }


    /* =====================================================
       PLAYER
       ===================================================== */

    const player = $(".music-player");

    if (!player) {

        console.warn(
            "Mbzedmusic: .music-player not found."
        );

        return;

    }


    /* =====================================================
       PLAYER ELEMENTS
       ===================================================== */

    const playerCover =
        $(".player-cover", player);

    const playerTitle =
        $(".player-info h3", player);

    const playerArtist =
        $(".player-info p", player);

    const mainPlayerButton =
        $(".main-player-button", player);

    const progressBar =
        $(".player-progress", player);

    const progressFill =
        $(".player-progress > div", player);


    /* =====================================================
       CREATE AUDIO ELEMENT
       ===================================================== */

    let audio =
        document.getElementById(
            "mbzed-audio"
        );

    if (!audio) {

        audio =
            document.createElement("audio");

        audio.id =
            "mbzed-audio";

        audio.preload =
            "metadata";

        audio.style.display =
            "none";

        document.body.appendChild(audio);

    }


    /* =====================================================
       EXTRA PLAYER CONTROLS
       ===================================================== */

    let playerControls =
        $(".mbzed-extra-controls", player);

    if (!playerControls) {

        playerControls =
            document.createElement("div");

        playerControls.className =
            "mbzed-extra-controls";

        playerControls.innerHTML = `
            <button
                class="mbzed-prev"
                aria-label="Previous song"
                title="Previous song"
            >
                <i class="fas fa-step-backward"></i>
            </button>

            <button
                class="mbzed-next"
                aria-label="Next song"
                title="Next song"
            >
                <i class="fas fa-step-forward"></i>
            </button>

            <button
                class="mbzed-mute"
                aria-label="Mute"
                title="Mute"
            >
                <i class="fas fa-volume-up"></i>
            </button>

            <input
                class="mbzed-volume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value="1"
                aria-label="Volume"
            >

            <span class="mbzed-time">
                0:00 / 0:00
            </span>
        `;

        player.appendChild(
            playerControls
        );

    }


    const previousButton =
        $(".mbzed-prev", player);

    const nextButton =
        $(".mbzed-next", player);

    const muteButton =
        $(".mbzed-mute", player);

    const volumeControl =
        $(".mbzed-volume", player);

    const timeDisplay =
        $(".mbzed-time", player);


    /* =====================================================
       PLAYER STATE
       ===================================================== */

    let currentButton = null;

    let currentAudio = "";

    let playlist = [];

    let currentIndex = -1;


    /* =====================================================
       VOLUME
       ===================================================== */

    audio.volume = 1;

    if (volumeControl) {

        volumeControl.value = 1;

        volumeControl.addEventListener(
            "input",
            () => {

                audio.volume =
                    parseFloat(
                        volumeControl.value
                    );

                audio.muted = false;

                updateVolumeIcon();

            }
        );

    }


    /* =====================================================
       VOLUME ICON
       ===================================================== */

    function updateVolumeIcon() {

        if (!muteButton) return;

        const icon =
            $("i", muteButton);

        if (!icon) return;

        icon.classList.remove(
            "fa-volume-up",
            "fa-volume-down",
            "fa-volume-mute"
        );

        if (
            audio.muted ||
            audio.volume === 0
        ) {

            icon.classList.add(
                "fa-volume-mute"
            );

        } else if (
            audio.volume < 0.5
        ) {

            icon.classList.add(
                "fa-volume-down"
            );

        } else {

            icon.classList.add(
                "fa-volume-up"
            );

        }

    }


    /* =====================================================
       MUTE
       ===================================================== */

    if (muteButton) {

        muteButton.addEventListener(
            "click",
            () => {

                audio.muted =
                    !audio.muted;

                updateVolumeIcon();

            }
        );

    }


    /* =====================================================
       SONG DATA
       ===================================================== */

    function getSongData(button) {

        if (!button) return null;

        const source =
            button.dataset.audio ||
            button.getAttribute(
                "data-audio"
            );

        if (!source) return null;

        const parent =
            button.closest(
                ".track, .release-card, .chart-item"
            );

        let title =
            button.dataset.title || "";

        let artist =
            button.dataset.artist || "";

        if (parent) {

            if (!title) {

                const titleElement =
                    $("h3", parent);

                if (titleElement) {
                    title =
                        titleElement.textContent.trim();
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


        /* Cover */

        let cover =
            button.dataset.cover || "";

        if (!cover && parent) {

            const coverElement =
                $(
                    ".track-image, .release-image, .mini-cover",
                    parent
                );

            if (coverElement) {

                const style =
                    getComputedStyle(
                        coverElement
                    );

                const background =
                    style.backgroundImage;

                if (
                    background &&
                    background !== "none"
                ) {

                    const match =
                        background.match(
                            /url\(["']?(.*?)["']?\)/
                        );

                    if (match) {
                        cover =
                            match[1];
                    }

                }

                if (
                    !cover &&
                    coverElement.tagName === "IMG"
                ) {

                    cover =
                        coverElement.src;

                }

            }

        }


        return {

            button,

            audio:
                cleanPath(source),

            title:
                title || "Unknown Track",

            artist:
                artist || "Mbzedmusic",

            cover:
                cover || ""

        };

    }


    /* =====================================================
       BUILD PLAYLIST
       ===================================================== */

    function buildPlaylist() {

        playlist =
            $$(".play-button[data-audio], .card-play[data-audio]")
                .map(button =>
                    getSongData(button)
                )
                .filter(song =>
                    song &&
                    song.audio
                );

        currentIndex =
            playlist.findIndex(
                song =>
                    song.button === currentButton
            );

    }


    buildPlaylist();


    /* =====================================================
       UPDATE PLAYER
       ===================================================== */

    function updatePlayer(song) {

        if (!song) return;

        player.classList.add("active");

        if (playerTitle) {
            playerTitle.textContent =
                song.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                song.artist;
        }

        if (
            playerCover &&
            song.cover
        ) {

            playerCover.style.backgroundImage =
                `url("${song.cover}")`;

        }

    }


    /* =====================================================
       BUTTON ICON
       ===================================================== */

    function setPlaying(button, playing) {

        if (!button) return;

        const icon =
            $("i", button);

        if (!icon) return;

        icon.classList.remove(
            "fa-play",
            "fa-pause"
        );

        icon.classList.add(
            playing
                ? "fa-pause"
                : "fa-play"
        );

    }


    /* =====================================================
       RESET BUTTONS
       ===================================================== */

    function resetButtons() {

        $$(".play-button, .card-play")
            .forEach(button => {

                setPlaying(
                    button,
                    false
                );

            });

    }


    /* =====================================================
       PLAY SONG
       ===================================================== */

    function playSong(song) {

        if (!song || !song.audio) {
            return;
        }

        buildPlaylist();

        currentButton =
            song.button;

        currentIndex =
            playlist.findIndex(
                item =>
                    item.button ===
                    currentButton
            );

        resetButtons();

        currentAudio =
            song.audio;

        updatePlayer(song);

        audio.pause();

        audio.currentTime = 0;

        let absoluteURL;

        try {

            absoluteURL =
                new URL(
                    song.audio,
                    window.location.href
                ).href;

        } catch (error) {

            console.error(
                "Invalid MP3 path:",
                song.audio
            );

            if (playerArtist) {
                playerArtist.textContent =
                    "Invalid audio file path.";
            }

            return;

        }

        audio.src =
            absoluteURL;

        audio.load();


        const start =
            () => {

                audio.play()
                    .then(() => {

                        setPlaying(
                            currentButton,
                            true
                        );

                        updateMainButton(
                            true
                        );

                    })
                    .catch(error => {

                        console.error(
                            "Playback error:",
                            error
                        );

                        if (playerArtist) {

                            playerArtist.textContent =
                                "Unable to play this audio file.";

                        }

                    });

            };


        if (audio.readyState >= 2) {

            start();

        } else {

            audio.addEventListener(
                "canplay",
                start,
                {
                    once: true
                }
            );

        }

    }


    /* =====================================================
       PLAY BUTTONS
       ===================================================== */

    $$(".play-button, .card-play")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const song =
                        getSongData(button);

                    if (!song) {

                        console.warn(
                            "Missing data-audio on:",
                            button
                        );

                        return;

                    }


                    /*
                     * Same song = pause
                     */

                    if (
                        currentButton ===
                            button &&
                        !audio.paused
                    ) {

                        audio.pause();

                        return;

                    }


                    /*
                     * Same song paused = resume
                     */

                    if (
                        currentButton ===
                            button &&
                        audio.paused &&
                        audio.src
                    ) {

                        audio.play()
                            .then(() => {

                                setPlaying(
                                    button,
                                    true
                                );

                            });

                        return;

                    }


                    playSong(song);

                }
            );

        });


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    function updateMainButton(
        playing
    ) {

        if (!mainPlayerButton)
            return;

        const icon =
            $("i", mainPlayerButton);

        if (!icon)
            return;

        icon.classList.remove(
            "fa-play",
            "fa-pause"
        );

        icon.classList.add(
            playing
                ? "fa-pause"
                : "fa-play"
        );

    }


    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            () => {

                if (!audio.src) {

                    if (
                        playlist.length
                    ) {

                        playSong(
                            playlist[0]
                        );

                    }

                    return;

                }


                if (audio.paused) {

                    audio.play()
                        .then(() => {

                            setPlaying(
                                currentButton,
                                true
                            );

                            updateMainButton(
                                true
                            );

                        });

                } else {

                    audio.pause();

                }

            }
        );

    }


    /* =====================================================
       PREVIOUS SONG
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                buildPlaylist();

                if (!playlist.length)
                    return;

                let index =
                    currentIndex - 1;

                if (index < 0) {
                    index =
                        playlist.length - 1;
                }

                playSong(
                    playlist[index]
                );

            }
        );

    }


    /* =====================================================
       NEXT SONG
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                buildPlaylist();

                if (!playlist.length)
                    return;

                let index =
                    currentIndex + 1;

                if (
                    index >=
                    playlist.length
                ) {
                    index = 0;
                }

                playSong(
                    playlist[index]
                );

            }
        );

    }


    /* =====================================================
       AUDIO PLAY
       ===================================================== */

    audio.addEventListener(
        "play",
        () => {

            setPlaying(
                currentButton,
                true
            );

            updateMainButton(
                true
            );

        }
    );


    /* =====================================================
       AUDIO PAUSE
       ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            setPlaying(
                currentButton,
                false
            );

            updateMainButton(
                false
            );

        }
    );


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(seconds) {

        if (
            !seconds ||
            !isFinite(seconds)
        ) {
            return "0:00";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        const remaining =
            Math.floor(
                seconds % 60
            );

        return (
            minutes +
            ":" +
            String(
                remaining
            ).padStart(2, "0")
        );

    }


    /* =====================================================
       TIME UPDATE
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !audio.duration ||
                !isFinite(
                    audio.duration
                )
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
                    `${formatTime(
                        audio.currentTime
                    )} / ${formatTime(
                        audio.duration
                    )}`;

            }

        }
    );


    /* =====================================================
       METADATA LOADED
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            if (timeDisplay) {

                timeDisplay.textContent =
                    `0:00 / ${formatTime(
                        audio.duration
                    )}`;

            }

        }
    );


    /* =====================================================
       SEEK
       ===================================================== */

    if (progressBar) {

        progressBar.addEventListener(
            "click",
            event => {

                if (
                    !audio.duration ||
                    !isFinite(
                        audio.duration
                    )
                ) {
                    return;
                }

                const rect =
                    progressBar.getBoundingClientRect();

                const position =
                    event.clientX -
                    rect.left;

                const percentage =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            position /
                            rect.width
                        )
                    );

                audio.currentTime =
                    percentage *
                    audio.duration;

            }
        );

    }


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Don't interfere with typing.
             */

            const tag =
                document.activeElement?.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA"
            ) {
                return;
            }


            /*
             * Space = play / pause
             */

            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();

                if (!audio.src) {

                    if (
                        playlist.length
                    ) {

                        playSong(
                            playlist[0]
                        );

                    }

                } else if (
                    audio.paused
                ) {

                    audio.play();

                } else {

                    audio.pause();

                }

            }


            /*
             * Arrow right = forward 10 seconds
             */

            if (
                event.code ===
                "ArrowRight"
            ) {

                if (audio.duration) {

                    audio.currentTime =
                        Math.min(
                            audio.duration,
                            audio.currentTime + 10
                        );

                }

            }


            /*
             * Arrow left = back 10 seconds
             */

            if (
                event.code ===
                "ArrowLeft"
            ) {

                audio.currentTime =
                    Math.max(
                        0,
                        audio.currentTime - 10
                    );

            }

        }
    );


    /* =====================================================
       AUTOMATIC NEXT SONG
       ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            setPlaying(
                currentButton,
                false
            );

            updateMainButton(
                false
            );

            if (progressFill) {
                progressFill.style.width =
                    "0%";
            }


            buildPlaylist();

            if (!playlist.length)
                return;


            let nextIndex =
                currentIndex + 1;


            /*
             * Automatically restart playlist
             * from the beginning.
             */

            if (
                nextIndex >=
                playlist.length
            ) {
                nextIndex = 0;
            }


            playSong(
                playlist[nextIndex]
            );

        }
    );


    /* =====================================================
       AUDIO ERROR
       ===================================================== */

    audio.addEventListener(
        "error",
        () => {

            resetButtons();

            updateMainButton(
                false
            );

            console.error(
                "Mbzedmusic audio error:",
                audio.error
            );

            if (playerArtist) {

                playerArtist.textContent =
                    "Audio could not be loaded. Check the MP3 filename and path.";

            }

        }
    );


    /* =====================================================
       SAVE VOLUME
       ===================================================== */

    audio.addEventListener(
        "volumechange",
        () => {

            if (volumeControl) {

                volumeControl.value =
                    audio.volume;

            }

            updateVolumeIcon();

        }
    );


    /* =====================================================
       PLAYER READY
       ===================================================== */

    console.log(
        "===================================="
    );

    console.log(
        "MBZEDMUSIC ADVANCED PLAYER READY"
    );

    console.log(
        "Songs found:",
        playlist.length
    );

    console.log(
        "===================================="
    );


    /* =====================================================
       NEWSLETTER
       ===================================================== */

    const newsletter =
        $(".newsletter-form");

    if (newsletter) {

        newsletter.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const input =
                    $("input", newsletter);

                if (
                    !input ||
                    !input.value.trim()
                ) {
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
       SMOOTH INTERNAL LINKS
       ===================================================== */

    $$('a[href^="#"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            id
                        );

                    if (!target)
                        return;

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

});

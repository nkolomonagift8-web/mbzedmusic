```javascript
/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE WEBSITE SCRIPT
   MUSIC PLAYER + SEARCH + MOBILE MENU
   GITHUB PAGES SAFE VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       AUDIO ENGINE
       ===================================================== */

    let audio = document.getElementById("audioPlayer");

    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "audioPlayer";
        audio.preload = "metadata";
        audio.style.display = "none";
        document.body.appendChild(audio);
    }

    /* =====================================================
       PLAYER ELEMENTS
       ===================================================== */

    const musicPlayer =
        document.getElementById("musicPlayer") ||
        document.querySelector(".music-player");

    const playerCover =
        document.querySelector(".player-cover");

    const playerTitle =
        document.getElementById("playerTitle") ||
        document.querySelector(".player-info h3");

    const playerArtist =
        document.getElementById("playerArtist") ||
        document.querySelector(".player-info p");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton") ||
        document.querySelector(".main-player-button");

    const playerProgress =
        document.querySelector(".player-progress");

    const progressBar =
        document.querySelector(".player-progress > div");

    /* =====================================================
       PLAYER STATE
       ===================================================== */

    let currentButton = null;
    let currentAudio = "";
    let currentSource = "";
    let isLoading = false;

    /* =====================================================
       FIND MUSIC BUTTONS
       ===================================================== */

    function getMusicButtons() {
        return Array.from(
            document.querySelectorAll("[data-audio]")
        ).filter(button => {
            const url = button.getAttribute("data-audio");
            return url && url.trim() !== "";
        });
    }

    /* =====================================================
       UPDATE MAIN PLAY BUTTON
       ===================================================== */

    function updatePlayButton(playing) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        if (playing) {

            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Pause music"
            );

            mainPlayerButton.setAttribute(
                "title",
                "Pause music"
            );

        } else {

            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Play music"
            );

            mainPlayerButton.setAttribute(
                "title",
                "Play music"
            );
        }
    }

    /* =====================================================
       SHOW PLAYER
       ===================================================== */

    function showPlayer() {

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }
    }

    /* =====================================================
       HIDE PLAYER
       ===================================================== */

    function hidePlayer() {

        if (musicPlayer) {
            musicPlayer.classList.remove("active");
        }
    }

    /* =====================================================
       RESOLVE AUDIO URL
       ===================================================== */

    function resolveAudioURL(url) {

        if (!url) return "";

        url = url.trim();

        /*
           Already absolute URL
        */

        if (
            url.startsWith("http://") ||
            url.startsWith("https://") ||
            url.startsWith("blob:") ||
            url.startsWith("data:")
        ) {
            return url;
        }

        /*
           Convert relative URL into an absolute URL
           based on the current GitHub Pages page.
        */

        try {

            return new URL(
                url,
                window.location.href
            ).href;

        } catch (error) {

            console.error(
                "Mbzedmusic: Could not resolve audio URL:",
                url,
                error
            );

            return url;
        }
    }

    /* =====================================================
       GET SONG INFORMATION
       ===================================================== */

    function getSongInfo(button) {

        const card =
            button.closest(
                ".track, .release-card, .chart-item, .music-card, .song-card"
            );

        let title =
            button.getAttribute("data-title");

        let artist =
            button.getAttribute("data-artist");

        let cover =
            button.getAttribute("data-cover");

        /* -----------------------------------------------
           TITLE
        ----------------------------------------------- */

        if (!title && card) {

            const titleElement =
                card.querySelector(
                    "h3, h2, .track-title, .song-title"
                );

            if (titleElement) {
                title =
                    titleElement.textContent.trim();
            }
        }

        /* -----------------------------------------------
           ARTIST
        ----------------------------------------------- */

        if (!artist && card) {

            const artistElement =
                card.querySelector(
                    ".track-info p, .release-card p, .chart-item p, .artist, .song-artist"
                );

            if (artistElement) {
                artist =
                    artistElement.textContent.trim();
            }
        }

        /* -----------------------------------------------
           COVER
        ----------------------------------------------- */

        if (!cover && card) {

            const image =
                card.querySelector(
                    ".track-image, .release-image, .mini-cover, img"
                );

            if (image) {

                /*
                   Normal <img>
                */

                if (image.tagName === "IMG") {

                    cover =
                        image.getAttribute("src") || "";
                }

                /*
                   Background image
                */

                if (!cover) {

                    const style =
                        getComputedStyle(image);

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
                            cover = match[1];
                        }
                    }
                }
            }
        }

        return {
            title:
                title || "Now Playing",

            artist:
                artist || "Mbzedmusic",

            cover:
                cover || ""
        };
    }

    /* =====================================================
       UPDATE PLAYER INFORMATION
       ===================================================== */

    function updatePlayerInfo(info) {

        if (playerTitle) {
            playerTitle.textContent =
                info.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                info.artist;
        }

        if (playerCover) {

            if (info.cover) {

                const coverURL =
                    resolveAudioURL(info.cover);

                playerCover.style.backgroundImage =
                    `url("${coverURL}")`;

            } else {

                playerCover.style.backgroundImage =
                    "none";
            }
        }
    }

    /* =====================================================
       RESET PROGRESS
       ===================================================== */

    function resetProgress() {

        if (progressBar) {
            progressBar.style.width = "0%";
        }
    }

    /* =====================================================
       PLAY SONG
       ===================================================== */

    async function playSong(button) {

        if (!button) return;

        const rawURL =
            button.getAttribute("data-audio");

        if (!rawURL || !rawURL.trim()) {

            console.error(
                "Mbzedmusic: Missing data-audio on button:",
                button
            );

            return;
        }

        const audioURL =
            resolveAudioURL(rawURL);

        const info =
            getSongInfo(button);

        currentButton = button;
        currentAudio = rawURL;
        currentSource = audioURL;

        isLoading = true;

        /* -----------------------------------------------
           Update player
        ----------------------------------------------- */

        updatePlayerInfo(info);
        showPlayer();
        resetProgress();

        updatePlayButton(false);

        /* -----------------------------------------------
           Stop old audio
        ----------------------------------------------- */

        audio.pause();

        /*
           Only replace source when necessary.
        */

        audio.removeAttribute("src");

        /*
           Force browser to forget previous source.
        */

        audio.load();

        /* -----------------------------------------------
           Set new source
        ----------------------------------------------- */

        audio.src = audioURL;

        /*
           Important:
           Set currentSrc by loading the new source.
        */

        audio.load();

        console.log(
            "Mbzedmusic loading:",
            audioURL
        );

        try {

            await audio.play();

            isLoading = false;

            updatePlayButton(true);

            console.log(
                "Mbzedmusic playing:",
                audioURL
            );

        } catch (error) {

            isLoading = false;

            updatePlayButton(false);

            console.error(
                "MBZEDMUSIC PLAYBACK ERROR"
            );

            console.error(
                "Original URL:",
                rawURL
            );

            console.error(
                "Resolved URL:",
                audioURL
            );

            console.error(
                "Error:",
                error
            );

            /*
               Give a useful message in the browser console.
            */

            if (
                error.name === "NotSupportedError"
            ) {

                console.error(
                    "The browser cannot play this audio file or the file URL is invalid."
                );

            } else if (
                error.name === "NotAllowedError"
            ) {

                console.error(
                    "Browser blocked playback. Click the music button again."
                );
            }
        }
    }

    /* =====================================================
       MUSIC BUTTON HANDLER
       ===================================================== */

    /*
       Event delegation is used here.
       This means newly-added music buttons also work.
    */

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("[data-audio]");

            if (!button) return;

            /*
               Do not interfere with actual links
               unless the element is being used as
               a music button.
            */

            event.preventDefault();
            event.stopPropagation();

            const rawURL =
                button.getAttribute("data-audio");

            if (!rawURL) return;

            /*
               Same song
            */

            if (
                currentButton === button &&
                currentAudio === rawURL
            ) {

                if (audio.paused) {

                    audio.play()
                        .then(() => {
                            updatePlayButton(true);
                        })
                        .catch(error => {

                            console.error(
                                "Mbzedmusic resume error:",
                                error
                            );
                        });

                } else {

                    audio.pause();

                    updatePlayButton(false);
                }

                return;
            }

            /*
               New song
            */

            playSong(button);
        }
    );

    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                /*
                   No song loaded yet
                */

                if (!currentAudio) {

                    const buttons =
                        getMusicButtons();

                    if (buttons.length > 0) {

                        playSong(buttons[0]);

                    } else {

                        console.warn(
                            "Mbzedmusic: No music buttons with data-audio were found."
                        );
                    }

                    return;
                }

                /*
                   Pause
                */

                if (!audio.paused) {

                    audio.pause();

                    updatePlayButton(false);

                    return;
                }

                /*
                   Resume
                */

                audio.play()
                    .then(() => {

                        updatePlayButton(true);

                    })
                    .catch(error => {

                        console.error(
                            "Mbzedmusic resume error:",
                            error
                        );
                    });
            }
        );
    }

    /* =====================================================
       AUDIO PLAY EVENT
       ===================================================== */

    audio.addEventListener(
        "play",
        () => {

            updatePlayButton(true);

            showPlayer();
        }
    );

    /* =====================================================
       AUDIO PAUSE EVENT
       ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            updatePlayButton(false);
        }
    );

    /* =====================================================
       AUDIO LOADING
       ===================================================== */

    audio.addEventListener(
        "loadstart",
        () => {

            console.log(
                "Mbzedmusic: Audio loading..."
            );
        }
    );

    /* =====================================================
       AUDIO CAN PLAY
       ===================================================== */

    audio.addEventListener(
        "canplay",
        () => {

            console.log(
                "Mbzedmusic: Audio ready to play."
            );

            isLoading = false;
        }
    );

    /* =====================================================
       AUDIO TIME UPDATE
       ===================================================== */

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
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            if (progressBar) {

                progressBar.style.width =
                    Math.min(
                        100,
                        Math.max(
                            0,
                            percentage
                        )
                    ) + "%";
            }
        }
    );

    /* =====================================================
       AUDIO LOADED METADATA
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "Mbzedmusic song loaded:",
                audio.duration,
                "seconds"
            );
        }
    );

    /* =====================================================
       AUDIO WAITING
       ===================================================== */

    audio.addEventListener(
        "waiting",
        () => {

            isLoading = true;

            console.log(
                "Mbzedmusic: Buffering..."
            );
        }
    );

    /* =====================================================
       AUDIO PLAYING
       ===================================================== */

    audio.addEventListener(
        "playing",
        () => {

            isLoading = false;

            updatePlayButton(true);

            console.log(
                "Mbzedmusic: Playing"
            );
        }
    );

    /* =====================================================
       AUDIO ERROR
       ===================================================== */

    audio.addEventListener(
        "error",
        () => {

            isLoading = false;

            updatePlayButton(false);

            console.error(
                "======================================"
            );

            console.error(
                "MBZEDMUSIC AUDIO ERROR"
            );

            console.error(
                "Original source:",
                currentAudio
            );

            console.error(
                "Resolved source:",
                currentSource
            );

            console.error(
                "Audio element:",
                audio
            );

            if (audio.error) {

                console.error(
                    "Error code:",
                    audio.error.code
                );

                console.error(
                    "Error message:",
                    audio.error.message
                );
            }

            console.error(
                "======================================"
            );
        }
    );

    /* =====================================================
       SONG ENDED
       ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            updatePlayButton(false);

            resetProgress();

            /*
               Find next available song.
            */

            const buttons =
                getMusicButtons();

            if (!currentButton) return;

            const currentIndex =
                buttons.indexOf(currentButton);

            if (currentIndex === -1) return;

            const nextButton =
                buttons[currentIndex + 1];

            if (nextButton) {

                playSong(nextButton);

            } else {

                /*
                   Playlist finished.
                   Keep player visible.
                */

                console.log(
                    "Mbzedmusic playlist finished."
                );
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

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {
                    return;
                }

                const rect =
                    playerProgress.getBoundingClientRect();

                if (!rect.width) return;

                const position =
                    event.clientX -
                    rect.left;

                const percentage =
                    Math.min(
                        1,
                        Math.max(
                            0,
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
       SEARCH
       ===================================================== */

    const searchButton =
        document.getElementById(
            "searchButton"
        );

    const searchBox =
        document.getElementById(
            "searchBox"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const closeSearch =
        document.getElementById(
            "closeSearch"
        );

    /* -----------------------------------------------
       OPEN SEARCH
    ----------------------------------------------- */

    if (
        searchButton &&
        searchBox
    ) {

        searchButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                searchBox.classList.toggle(
                    "active"
                );

                if (
                    searchBox.classList.contains(
                        "active"
                    ) &&
                    searchInput
                ) {

                    setTimeout(() => {
                        searchInput.focus();
                    }, 100);
                }
            }
        );
    }

    /* -----------------------------------------------
       CLOSE SEARCH
    ----------------------------------------------- */

    if (
        closeSearch &&
        searchBox
    ) {

        closeSearch.addEventListener(
            "click",
            event => {

                event.preventDefault();

                searchBox.classList.remove(
                    "active"
                );
            }
        );
    }

    /* -----------------------------------------------
       SEARCH FILTER
    ----------------------------------------------- */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                const items =
                    document.querySelectorAll(
                        ".track, .release-card, .chart-item, .music-card, .song-card"
                    );

                items.forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();

                    if (
                        !query ||
                        text.includes(query)
                    ) {

                        item.style.display = "";

                    } else {

                        item.style.display =
                            "none";
                    }
                });
            }
        );
    }

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const navigation =
        document.getElementById(
            "navigation"
        );

    if (
        mobileMenu &&
        navigation
    ) {

        mobileMenu.addEventListener(
            "click",
            event => {

                event.preventDefault();

                navigation.classList.toggle(
                    "active"
                );

                const icon =
                    mobileMenu.querySelector("i");

                if (!icon) return;

                if (
                    navigation.classList.contains(
                        "active"
                    )
                ) {

                    icon.classList.remove(
                        "fa-bars"
                    );

                    icon.classList.add(
                        "fa-xmark"
                    );

                } else {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );
                }
            }
        );
    }

    /* =====================================================
       CLOSE MOBILE MENU WHEN LINK IS CLICKED
       ===================================================== */

    if (navigation) {

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
                            mobileMenu
                                ? mobileMenu.querySelector("i")
                                : null;

                        if (icon) {

                            icon.classList.remove(
                                "fa-xmark"
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
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            if (
                searchBox &&
                searchBox.classList.contains("active")
            ) {

                searchBox.classList.remove(
                    "active"
                );
            }

            if (
                navigation &&
                navigation.classList.contains("active")
            ) {

                navigation.classList.remove(
                    "active"
                );

                const icon =
                    mobileMenu
                        ? mobileMenu.querySelector("i")
                        : null;

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
    );

    /* =====================================================
       DEBUG INFORMATION
       ===================================================== */

    const buttons =
        getMusicButtons();

    console.log(
        "======================================"
    );

    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

    console.log(
        "Audio element:",
        audio
    );

    console.log(
        "Music buttons:",
        buttons.length
    );

    buttons.forEach((button, index) => {

        const raw =
            button.getAttribute(
                "data-audio"
            );

        console.log(
            `Song ${index + 1}:`,
            raw,
            "=>",
            resolveAudioURL(raw)
        );
    });

    console.log(
        "======================================"
    );

});
```

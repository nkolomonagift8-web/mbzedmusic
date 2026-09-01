```javascript
/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLAYER + SEARCH + MOBILE MENU
   STABLE VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       AUDIO
    ===================================================== */

    let audio = document.getElementById("audioPlayer");

    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "audioPlayer";
        audio.preload = "metadata";
        document.body.appendChild(audio);
    }

    audio.preload = "metadata";


    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

    const musicPlayer =
        document.getElementById("musicPlayer") ||
        document.querySelector(".music-player");

    const playerCover =
        document.querySelector(".player-cover");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerArtist =
        document.getElementById("playerArtist");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton");

    const playerProgress =
        document.querySelector(".player-progress");

    const progressBar =
        document.querySelector(".player-progress > div");


    /* =====================================================
       ALL MUSIC BUTTONS
    ===================================================== */

    function getMusicButtons() {
        return Array.from(
            document.querySelectorAll("[data-audio]")
        ).filter(button => {
            return button.getAttribute("data-audio");
        });
    }


    let currentButton = null;
    let currentAudio = "";


    /* =====================================================
       PLAYER ICON
    ===================================================== */

    function setMainIcon(isPlaying) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        icon.classList.toggle(
            "fa-play",
            !isPlaying
        );

        icon.classList.toggle(
            "fa-pause",
            isPlaying
        );

        mainPlayerButton.setAttribute(
            "aria-label",
            isPlaying
                ? "Pause music"
                : "Play music"
        );
    }


    /* =====================================================
       BUTTON ICONS
    ===================================================== */

    function updateSongButtons() {

        const buttons = getMusicButtons();

        buttons.forEach(button => {

            const icon =
                button.querySelector("i");

            if (!icon) return;

            const isCurrent =
                button === currentButton;

            const isPlaying =
                isCurrent && !audio.paused;

            icon.classList.toggle(
                "fa-play",
                !isPlaying
            );

            icon.classList.toggle(
                "fa-pause",
                isPlaying
            );

        });
    }


    /* =====================================================
       GET SONG INFORMATION
    ===================================================== */

    function getSongInfo(button) {

        const card =
            button.closest(
                ".track, .release-card, .chart-item"
            );

        let title =
            button.dataset.title || "";

        let artist =
            button.dataset.artist || "";

        let cover =
            button.dataset.cover || "";


        /* -----------------------------------------------
           TITLE
        ------------------------------------------------ */

        if (!title && card) {

            const titleElement =
                card.querySelector("h3");

            if (titleElement) {
                title =
                    titleElement.textContent.trim();
            }
        }


        /* -----------------------------------------------
           ARTIST
        ------------------------------------------------ */

        if (!artist && card) {

            const artistElement =
                card.querySelector(
                    ".track-info p, .release-card p, .chart-item p"
                );

            if (artistElement) {
                artist =
                    artistElement.textContent.trim();
            }
        }


        /* -----------------------------------------------
           COVER
        ------------------------------------------------ */

        if (!cover && card) {

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
       SHOW PLAYER
    ===================================================== */

    function showPlayer() {

        if (!musicPlayer) return;

        musicPlayer.classList.add("active");
    }


    /* =====================================================
       LOAD SONG
    ===================================================== */

    function loadSong(button) {

        if (!button) return false;

        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.warn(
                "Mbzedmusic: No audio file attached to:",
                button
            );

            return false;
        }


        const info =
            getSongInfo(button);


        currentButton = button;
        currentAudio = url;


        /* -----------------------------------------------
           PLAYER INFORMATION
        ------------------------------------------------ */

        if (playerTitle) {
            playerTitle.textContent =
                info.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                info.artist;
        }

        if (
            playerCover &&
            info.cover
        ) {

            playerCover.style.backgroundImage =
                `url("${info.cover}")`;
        }


        /* -----------------------------------------------
           RESET PROGRESS
        ------------------------------------------------ */

        if (progressBar) {
            progressBar.style.width = "0%";
        }


        /* -----------------------------------------------
           LOAD AUDIO
        ------------------------------------------------ */

        audio.pause();

        audio.src = url;

        audio.load();


        showPlayer();

        updateSongButtons();

        return true;
    }


    /* =====================================================
       PLAY SONG
    ===================================================== */

    async function playSong(button) {

        if (!button) return;


        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.warn(
                "Mbzedmusic: Button has no data-audio.",
                button
            );

            return;
        }


        /* Same song */

        if (
            currentButton === button &&
            currentAudio === url &&
            audio.src
        ) {

            try {

                await audio.play();

                setMainIcon(true);

                updateSongButtons();

            } catch (error) {

                console.error(
                    "MBZEDMUSIC playback error:",
                    error
                );

            }

            return;
        }


        /* New song */

        const loaded =
            loadSong(button);

        if (!loaded) return;


        try {

            await audio.play();

            setMainIcon(true);

            updateSongButtons();

        } catch (error) {

            console.error(
                "MBZEDMUSIC could not play:",
                error
            );

            console.error(
                "Audio URL:",
                url
            );

            setMainIcon(false);

            updateSongButtons();
        }
    }


    /* =====================================================
       MUSIC BUTTON CLICK
    ===================================================== */

    function attachMusicButtons() {

        const buttons = getMusicButtons();

        buttons.forEach(button => {

            if (
                button.dataset.playerAttached === "true"
            ) {
                return;
            }


            button.dataset.playerAttached = "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    const url =
                        button.getAttribute("data-audio");

                    if (!url) {

                        console.warn(
                            "This song does not have an audio file yet:",
                            button
                        );

                        return;
                    }


                    if (
                        currentButton === button &&
                        currentAudio === url
                    ) {

                        if (audio.paused) {

                            audio.play()
                                .then(() => {

                                    setMainIcon(true);
                                    updateSongButtons();

                                })
                                .catch(error => {

                                    console.error(
                                        "Playback failed:",
                                        error
                                    );

                                });

                        } else {

                            audio.pause();

                        }

                    } else {

                        playSong(button);

                    }

                }
            );

        });
    }


    attachMusicButtons();


    /* =====================================================
       MAIN PLAYER BUTTON
    ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                /* -----------------------------------------
                   Nothing loaded
                ----------------------------------------- */

                if (!currentAudio) {

                    const buttons =
                        getMusicButtons();

                    if (buttons.length) {

                        await playSong(
                            buttons[0]
                        );

                    }

                    return;
                }


                /* -----------------------------------------
                   Pause
                ----------------------------------------- */

                if (!audio.paused) {

                    audio.pause();

                    return;
                }


                /* -----------------------------------------
                   Play
                ----------------------------------------- */

                try {

                    await audio.play();

                } catch (error) {

                    console.error(
                        "Could not resume music:",
                        error
                    );

                }

            }
        );
    }


    /* =====================================================
       AUDIO PLAY
    ===================================================== */

    audio.addEventListener(
        "play",
        () => {

            showPlayer();

            setMainIcon(true);

            updateSongButtons();

        }
    );


    /* =====================================================
       AUDIO PAUSE
    ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            setMainIcon(false);

            updateSongButtons();

        }
    );


    /* =====================================================
       AUDIO TIME UPDATE
    ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !isFinite(audio.duration) ||
                audio.duration <= 0
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


    /* =====================================================
       AUDIO LOADED
    ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "MBZEDMUSIC song loaded:",
                audio.duration,
                "seconds"
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
                "MBZEDMUSIC audio ready to play."
            );

        }
    );


    /* =====================================================
       AUDIO ERROR
    ===================================================== */

    audio.addEventListener(
        "error",
        () => {

            console.error(
                "================================"
            );

            console.error(
                "MBZEDMUSIC AUDIO ERROR"
            );

            console.error(
                "Audio URL:",
                audio.currentSrc ||
                audio.src
            );

            console.error(
                "Audio error:",
                audio.error
            );

            console.error(
                "================================"
            );

            setMainIcon(false);

            updateSongButtons();

        }
    );


    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            setMainIcon(false);

            if (progressBar) {
                progressBar.style.width = "0%";
            }


            const buttons =
                getMusicButtons();


            const currentIndex =
                buttons.indexOf(
                    currentButton
                );


            if (currentIndex === -1) {
                return;
            }


            /* -----------------------------------------
               Find next real song
            ----------------------------------------- */

            for (
                let i = currentIndex + 1;
                i < buttons.length;
                i++
            ) {

                const nextButton =
                    buttons[i];

                if (
                    nextButton.getAttribute(
                        "data-audio"
                    )
                ) {

                    playSong(nextButton);

                    return;
                }

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
                    !isFinite(audio.duration) ||
                    audio.duration <= 0
                ) {
                    return;
                }


                const rect =
                    playerProgress.getBoundingClientRect();


                const clickPosition =
                    event.clientX -
                    rect.left;


                let percentage =
                    clickPosition /
                    rect.width;


                percentage =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            percentage
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


    if (
        searchButton &&
        searchBox
    ) {

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

                    searchInput.focus();

                }

            }
        );

    }


    if (
        closeSearch &&
        searchBox
    ) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchBox.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       SEARCH FILTER
    ===================================================== */

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
                        ".track, .release-card, .chart-item"
                    );


                items.forEach(item => {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        !query ||
                        text.includes(query)
                            ? ""
                            : "none";

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
            () => {

                navigation.classList.toggle(
                    "active"
                );


                const icon =
                    mobileMenu.querySelector(
                        "i"
                    );


                const open =
                    navigation.classList.contains(
                        "active"
                    );


                if (icon) {

                    icon.classList.toggle(
                        "fa-bars",
                        !open
                    );

                    icon.classList.toggle(
                        "fa-xmark",
                        open
                    );

                }


                mobileMenu.setAttribute(
                    "aria-label",
                    open
                        ? "Close menu"
                        : "Open menu"
                );

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU AFTER LINK
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


                        if (mobileMenu) {

                            const icon =
                                mobileMenu.querySelector(
                                    "i"
                                );

                            if (icon) {

                                icon.classList.remove(
                                    "fa-xmark"
                                );

                                icon.classList.add(
                                    "fa-bars"
                                );

                            }

                            mobileMenu.setAttribute(
                                "aria-label",
                                "Open menu"
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
        document.getElementById(
            "newsletterForm"
        );


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );


                if (
                    !emailInput ||
                    !emailInput.value.trim()
                ) {
                    return;
                }


                alert(
                    "Thank you for subscribing to Mbzedmusic!"
                );


                newsletterForm.reset();

            }
        );

    }


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "========================================"
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
        getMusicButtons().length
    );

    console.log(
        "Playable songs:"
    );

    getMusicButtons().forEach(button => {

        console.log(
            button.getAttribute("data-audio")
        );

    });

    console.log(
        "========================================"
    );

});
```

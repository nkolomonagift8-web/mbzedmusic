/* =========================================================
   MBZEDMUSIC.COM
   PROFESSIONAL MUSIC PLAYER + SEARCH + MOBILE MENU
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
        audio.setAttribute("playsinline", "");
        document.body.appendChild(audio);
    }


    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

    const musicPlayer = document.getElementById("musicPlayer");

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
       ALL SONG BUTTONS
    ===================================================== */

    function getMusicButtons() {
        return Array.from(
            document.querySelectorAll(
                "[data-audio]"
            )
        );
    }


    let currentButton = null;
    let currentAudio = "";
    let isLoading = false;


    /* =====================================================
       PLAYER BUTTON ICON
    ===================================================== */

    function updatePlayButton(playing) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        icon.classList.remove(
            "fa-play",
            "fa-pause",
            "fa-spinner",
            "fa-spin"
        );

        if (playing) {

            icon.classList.add("fa-pause");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Pause music"
            );

        } else {

            icon.classList.add("fa-play");

            mainPlayerButton.setAttribute(
                "aria-label",
                "Play music"
            );
        }
    }


    /* =====================================================
       LOADING BUTTON
    ===================================================== */

    function showLoading() {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        icon.className =
            "fa-solid fa-spinner fa-spin";

        mainPlayerButton.setAttribute(
            "aria-label",
            "Loading music"
        );
    }


    /* =====================================================
       SONG INFORMATION
    ===================================================== */

    function getSongInfo(button) {

        const card =
            button.closest(
                ".track, .release-card, .chart-item"
            );

        let title =
            button.getAttribute("data-title");

        let artist =
            button.getAttribute("data-artist");

        let cover =
            button.getAttribute("data-cover");


        /* TITLE */

        if (!title && card) {

            const titleElement =
                card.querySelector("h3");

            if (titleElement) {
                title =
                    titleElement.textContent.trim();
            }
        }


        /* ARTIST */

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


        /* COVER */

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
            title: title || "Now Playing",
            artist: artist || "Mbzedmusic",
            cover: cover || "mb-levels-cover.jpg.jpeg"
        };
    }


    /* =====================================================
       UPDATE PLAYER DISPLAY
    ===================================================== */

    function updatePlayerInfo(button) {

        const info =
            getSongInfo(button);


        if (playerTitle) {
            playerTitle.textContent =
                info.title;
        }


        if (playerArtist) {
            playerArtist.textContent =
                info.artist;
        }


        if (playerCover && info.cover) {

            playerCover.style.backgroundImage =
                `url("${info.cover}")`;
        }


        if (musicPlayer) {
            musicPlayer.classList.add("active");
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


        const audioURL =
            button.getAttribute("data-audio");


        if (!audioURL) {

            console.warn(
                "Mbzedmusic: No data-audio found on button.",
                button
            );

            return;
        }


        /* Same song already loaded */

        if (
            currentButton === button &&
            currentAudio === audioURL
        ) {

            try {

                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }

            } catch (error) {

                console.error(
                    "Playback error:",
                    error
                );
            }

            return;
        }


        /* New song */

        currentButton = button;
        currentAudio = audioURL;

        isLoading = true;


        updatePlayerInfo(button);

        resetProgress();

        showLoading();


        /* Stop current song */

        audio.pause();


        /*
         * IMPORTANT:
         * Use the URL directly.
         * Do not remove src before setting the new one.
         */

        audio.src = audioURL;


        /* Force browser to load the MP3 */

        audio.load();


        try {

            await audio.play();

            isLoading = false;

            updatePlayButton(true);

        } catch (error) {

            isLoading = false;

            updatePlayButton(false);

            console.error(
                "================================="
            );

            console.error(
                "MBZEDMUSIC PLAYBACK ERROR"
            );

            console.error(
                "Audio URL:",
                audioURL
            );

            console.error(
                error
            );

            console.error(
                "================================="
            );
        }
    }


    /* =====================================================
       SONG BUTTONS
    ===================================================== */

    function attachMusicButtons() {

        const buttons =
            getMusicButtons();


        buttons.forEach(button => {

            if (
                button.dataset.playerReady === "true"
            ) {
                return;
            }


            button.dataset.playerReady =
                "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    playSong(button);
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


                /* No song selected */

                if (!currentAudio) {

                    const buttons =
                        getMusicButtons();

                    if (buttons.length > 0) {

                        await playSong(
                            buttons[0]
                        );
                    }

                    return;
                }


                /* Currently playing */

                if (!audio.paused) {

                    audio.pause();

                    return;
                }


                /* Resume */

                try {

                    showLoading();

                    await audio.play();

                    updatePlayButton(true);

                } catch (error) {

                    updatePlayButton(false);

                    console.error(
                        "Resume playback error:",
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

            isLoading = false;

            updatePlayButton(true);

            if (musicPlayer) {
                musicPlayer.classList.add("active");
            }
        }
    );


    /* =====================================================
       AUDIO PAUSE
    ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            if (!isLoading) {
                updatePlayButton(false);
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
                "MBZEDMUSIC:",
                "Song loaded successfully."
            );

            console.log(
                "Duration:",
                audio.duration,
                "seconds"
            );
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
                    `${percentage}%`;
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
       AUDIO ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            updatePlayButton(false);

            resetProgress();


            const buttons =
                getMusicButtons();


            if (!currentButton) {
                return;
            }


            const currentIndex =
                buttons.indexOf(
                    currentButton
                );


            /*
             * Find next real song.
             */

            for (
                let i = currentIndex + 1;
                i < buttons.length;
                i++
            ) {

                const nextButton =
                    buttons[i];


                if (
                    nextButton &&
                    nextButton.hasAttribute(
                        "data-audio"
                    )
                ) {

                    playSong(
                        nextButton
                    );

                    return;
                }
            }


            /*
             * Nothing else available.
             */

            currentButton = null;
            currentAudio = "";
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


            let errorMessage =
                "Unknown audio error.";


            if (audio.error) {

                switch (audio.error.code) {

                    case 1:
                        errorMessage =
                            "Audio loading was aborted.";
                        break;

                    case 2:
                        errorMessage =
                            "Network error while loading audio.";
                        break;

                    case 3:
                        errorMessage =
                            "Audio file could not be decoded.";
                        break;

                    case 4:
                        errorMessage =
                            "Audio format or URL is not supported.";
                        break;
                }
            }


            console.error(
                "================================="
            );

            console.error(
                "MBZEDMUSIC AUDIO ERROR"
            );

            console.error(
                errorMessage
            );

            console.error(
                "URL:",
                audio.currentSrc ||
                audio.src
            );

            console.error(
                "================================="
            );
        }
    );


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


                    if (
                        !query ||
                        text.includes(query)
                    ) {

                        item.style.display =
                            "";

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
            () => {

                navigation.classList.toggle(
                    "active"
                );


                const icon =
                    mobileMenu.querySelector(
                        "i"
                    );


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

                    mobileMenu.setAttribute(
                        "aria-label",
                        "Close menu"
                    );

                } else {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                    mobileMenu.setAttribute(
                        "aria-label",
                        "Open menu"
                    );
                }

            }
        );


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

                const input =
                    newsletterForm.querySelector(
                        "input[type='email']"
                    );


                if (!input) return;


                const email =
                    input.value.trim();


                if (!email) return;


                alert(
                    "Thank you for subscribing to Mbzedmusic.com!"
                );


                input.value = "";
            }
        );
    }


    /* =====================================================
       DEBUG INFORMATION
    ===================================================== */

    console.log(
        "================================="
    );

    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

    console.log(
        "Audio element:",
        audio
    );

    console.log(
        "Songs with audio:",
        getMusicButtons().length
    );


    getMusicButtons().forEach(
        button => {

            console.log(
                button.getAttribute(
                    "data-audio"
                )
            );

        }
    );


    console.log(
        "================================="
    );

});

```javascript
/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLAYER
   FIXED VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CREATE AUDIO PLAYER AUTOMATICALLY
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
       MUSIC BUTTONS
       ===================================================== */

    const musicButtons =
        document.querySelectorAll("[data-audio]");


    let currentButton = null;
    let currentAudio = "";


    /* =====================================================
       UPDATE PLAY BUTTON
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
       GET SONG INFORMATION
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


        if (!title && card) {

            const titleElement =
                card.querySelector("h3");

            if (titleElement) {
                title =
                    titleElement.textContent.trim();
            }
        }


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


        if (!cover && card) {

            const image =
                card.querySelector(
                    ".track-image, .release-image, .mini-cover"
                );

            if (image) {

                const style =
                    getComputedStyle(image);

                const background =
                    style.backgroundImage;

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
            cover: cover || ""
        };
    }


    /* =====================================================
       LOAD AND PLAY SONG
       ===================================================== */

    function playSong(button) {

        if (!button) return;

        const audioURL =
            button.getAttribute("data-audio");

        if (!audioURL) {

            console.warn(
                "Mbzedmusic: This button has no data-audio:",
                button
            );

            return;
        }


        const info =
            getSongInfo(button);


        currentButton = button;
        currentAudio = audioURL;


        /* ---------------------------------------------
           Update player information
        --------------------------------------------- */

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


        /* ---------------------------------------------
           Show player
        --------------------------------------------- */

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }


        /* ---------------------------------------------
           Stop previous song
        --------------------------------------------- */

        audio.pause();

        audio.removeAttribute("src");

        audio.load();


        /* ---------------------------------------------
           Load new song
        --------------------------------------------- */

        audio.src = audioURL;

        audio.load();


        /* ---------------------------------------------
           Play after user click
        --------------------------------------------- */

        const promise =
            audio.play();


        if (promise !== undefined) {

            promise
                .then(function () {

                    updatePlayButton(true);

                })
                .catch(function (error) {

                    console.error(
                        "MBZEDMUSIC PLAY ERROR:",
                        error
                    );

                    updatePlayButton(false);

                    console.error(
                        "Audio URL:",
                        audioURL
                    );

                });
        }
    }


    /* =====================================================
       MUSIC BUTTON CLICK
       ===================================================== */

    musicButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const url =
                    button.getAttribute("data-audio");

                if (!url) return;


                /* Same song */

                if (
                    currentButton === button &&
                    currentAudio === url
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {
                                updatePlayButton(true);
                            })
                            .catch(function (error) {
                                console.error(
                                    "Playback error:",
                                    error
                                );
                            });

                    } else {

                        audio.pause();

                        updatePlayButton(false);
                    }

                    return;
                }


                /* New song */

                playSong(button);

            }
        );

    });


    /* =====================================================
       MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* Nothing loaded yet */

                if (!currentAudio) {

                    if (musicButtons.length > 0) {

                        playSong(
                            musicButtons[0]
                        );

                    }

                    return;
                }


                /* Pause */

                if (!audio.paused) {

                    audio.pause();

                    updatePlayButton(false);

                    return;
                }


                /* Play */

                audio.play()
                    .then(function () {

                        updatePlayButton(true);

                    })
                    .catch(function (error) {

                        console.error(
                            "Playback error:",
                            error
                        );

                    });

            }
        );
    }


    /* =====================================================
       AUDIO PLAY
       ===================================================== */

    audio.addEventListener(
        "play",
        function () {

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
        function () {

            updatePlayButton(false);

        }
    );


    /* =====================================================
       AUDIO TIME UPDATE
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        function () {

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
                    percentage + "%";

            }

        }
    );


    /* =====================================================
       AUDIO LOADED
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "Song loaded:",
                audio.duration,
                "seconds"
            );

        }
    );


    /* =====================================================
       AUDIO ERROR
       ===================================================== */

    audio.addEventListener(
        "error",
        function () {

            console.error(
                "================================="
            );

            console.error(
                "MBZEDMUSIC AUDIO ERROR"
            );

            console.error(
                "URL:",
                audio.src
            );

            console.error(
                "Error:",
                audio.error
            );

            console.error(
                "================================="
            );

            updatePlayButton(false);

        }
    );


    /* =====================================================
       SONG ENDED
       ===================================================== */

    audio.addEventListener(
        "ended",
        function () {

            updatePlayButton(false);

            if (progressBar) {
                progressBar.style.width = "0%";
            }


            /* -----------------------------------------
               Automatically play next available song
            ----------------------------------------- */

            if (!currentButton) return;


            const buttons =
                Array.from(musicButtons);

            const currentIndex =
                buttons.indexOf(currentButton);


            for (
                let i = currentIndex + 1;
                i < buttons.length;
                i++
            ) {

                const next =
                    buttons[i];

                if (
                    next.hasAttribute("data-audio")
                ) {

                    playSong(next);

                    break;
                }
            }

        }
    );


    /* =====================================================
       PROGRESS BAR
       ===================================================== */

    if (playerProgress) {

        playerProgress.addEventListener(
            "click",
            function (event) {

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {
                    return;
                }


                const rect =
                    playerProgress.getBoundingClientRect();


                const position =
                    event.clientX -
                    rect.left;


                const percentage =
                    position /
                    rect.width;


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
            function () {

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
            function () {

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
            function () {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const items =
                    document.querySelectorAll(
                        ".track, .release-card, .chart-item"
                    );


                items.forEach(function (item) {

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
            function () {

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

            }
        );

    }


    /* =====================================================
       NAVIGATION CLOSE
       ===================================================== */

    if (navigation) {

        navigation
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "active"
                        );

                    }
                );

            });

    }


    /* =====================================================
       DEBUG
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
        "Music buttons:",
        musicButtons.length
    );

    console.log(
        "Songs with audio:"
    );

    musicButtons.forEach(function (button) {

        if (
            button.hasAttribute(
                "data-audio"
            )
        ) {

            console.log(
                button.getAttribute(
                    "data-audio"
                )
            );

        }

    });

    console.log(
        "================================="
    );

});
```

```javascript
/* =========================================================
   MBZEDMUSIC.COM
   MUSIC PLAYER + SEARCH + MOBILE MENU
   CLEAN WORKING VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("MBZEDMUSIC: JavaScript loaded");


    /* =====================================================
       AUDIO ELEMENT
    ===================================================== */

    let audio = document.getElementById("audioPlayer");

    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "audioPlayer";
        audio.preload = "auto";
        document.body.appendChild(audio);
    }


    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

    const musicPlayer = document.getElementById("musicPlayer");

    const playerTitle = document.getElementById("playerTitle");

    const playerArtist = document.getElementById("playerArtist");

    const playerCover = document.querySelector(".player-cover");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton");

    const playerProgress =
        document.querySelector(".player-progress");

    const progressFill =
        document.querySelector(".player-progress > div");


    /* =====================================================
       ALL SONG BUTTONS
    ===================================================== */

    const musicButtons =
        document.querySelectorAll("[data-audio]");

    console.log(
        "MBZEDMUSIC: Songs found:",
        musicButtons.length
    );


    let currentButton = null;


    /* =====================================================
       PLAY / PAUSE ICON
    ===================================================== */

    function setPlayIcon(isPlaying) {

        if (!mainPlayerButton) {
            return;
        }

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) {
            return;
        }

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


        /* ---------------------------------------------
           Find title from card if needed
        --------------------------------------------- */

        if (!title && card) {

            const titleElement =
                card.querySelector("h3");

            if (titleElement) {
                title =
                    titleElement.textContent.trim();
            }
        }


        /* ---------------------------------------------
           Find artist from card if needed
        --------------------------------------------- */

        if (!artist && card) {

            const artistElement =
                card.querySelector("p");

            if (artistElement) {
                artist =
                    artistElement.textContent.trim();
            }
        }


        /* ---------------------------------------------
           Find cover
        --------------------------------------------- */

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
            cover: cover || ""
        };
    }


    /* =====================================================
       LOAD SONG
    ===================================================== */

    function loadSong(button) {

        if (!button) {
            return false;
        }


        const audioURL =
            button.getAttribute("data-audio");


        if (!audioURL) {

            console.warn(
                "MBZEDMUSIC: Button has no data-audio:",
                button
            );

            return false;
        }


        const info =
            getSongInfo(button);


        console.log(
            "MBZEDMUSIC: Loading:",
            audioURL
        );


        currentButton = button;


        /* ---------------------------------------------
           Update player
        --------------------------------------------- */

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
                'url("' + info.cover + '")';
        }


        /* ---------------------------------------------
           Show player
        --------------------------------------------- */

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }


        /* ---------------------------------------------
           Stop old song
        --------------------------------------------- */

        audio.pause();


        /* ---------------------------------------------
           Set new song
        --------------------------------------------- */

        audio.src = audioURL;

        audio.load();


        return true;
    }


    /* =====================================================
       PLAY SONG
    ===================================================== */

    function playSong(button) {

        const loaded =
            loadSong(button);


        if (!loaded) {
            return;
        }


        const playPromise =
            audio.play();


        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    console.log(
                        "MBZEDMUSIC: Playing",
                        audio.src
                    );

                    setPlayIcon(true);

                })
                .catch(function (error) {

                    console.error(
                        "MBZEDMUSIC: PLAY FAILED"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "Audio URL:",
                        audio.src
                    );

                    setPlayIcon(false);
                });
        }
    }


    /* =====================================================
       SONG BUTTONS
    ===================================================== */

    musicButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const url =
                    button.getAttribute("data-audio");


                if (!url) {

                    console.warn(
                        "MBZEDMUSIC: No audio file on this button."
                    );

                    return;
                }


                /* Same song */

                if (
                    currentButton === button &&
                    audio.src === new URL(
                        url,
                        window.location.href
                    ).href
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {

                                setPlayIcon(true);

                            })
                            .catch(function (error) {

                                console.error(
                                    "Playback failed:",
                                    error
                                );

                            });

                    } else {

                        audio.pause();

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


                /* Nothing loaded */

                if (!currentButton) {

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

                    return;
                }


                /* Play */

                audio.play()
                    .then(function () {

                        setPlayIcon(true);

                    })
                    .catch(function (error) {

                        console.error(
                            "MBZEDMUSIC: Could not resume:",
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
        function () {

            setPlayIcon(true);

            if (musicPlayer) {
                musicPlayer.classList.add("active");
            }

        }
    );


    /* =====================================================
       AUDIO PAUSE EVENT
    ===================================================== */

    audio.addEventListener(
        "pause",
        function () {

            setPlayIcon(false);

        }
    );


    /* =====================================================
       AUDIO TIME UPDATE
    ===================================================== */

    audio.addEventListener(
        "timeupdate",
        function () {

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


            if (progressFill) {

                progressFill.style.width =
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
                "MBZEDMUSIC: Audio loaded."
            );

            console.log(
                "Duration:",
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
                "Audio URL:",
                audio.src
            );

            console.error(
                "Audio error:",
                audio.error
            );

            console.error(
                "================================="
            );

            setPlayIcon(false);

        }
    );


    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        function () {

            setPlayIcon(false);


            if (progressFill) {
                progressFill.style.width = "0%";
            }


            if (!currentButton) {
                return;
            }


            const buttons =
                Array.from(musicButtons);


            const currentIndex =
                buttons.indexOf(currentButton);


            /* Find next song with audio */

            for (
                let i = currentIndex + 1;
                i < buttons.length;
                i++
            ) {

                const nextButton =
                    buttons[i];


                if (
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

        }
    );


    /* =====================================================
       PROGRESS BAR CLICK
    ===================================================== */

    if (playerProgress) {

        playerProgress.addEventListener(
            "click",
            function (event) {

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


                items.forEach(
                    function (item) {

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

                    }
                );

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
                    mobileMenu.querySelector(
                        "i"
                    );


                if (!icon) {
                    return;
                }


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
       CLOSE MOBILE MENU AFTER LINK
    ===================================================== */

    if (navigation) {

        navigation
            .querySelectorAll("a")
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            navigation.classList.remove(
                                "active"
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       FINAL STATUS
    ===================================================== */

    console.log(
        "MBZEDMUSIC: PLAYER READY"
    );

    console.log(
        "MBZEDMUSIC: Audio element:",
        audio
    );

    console.log(
        "MBZEDMUSIC: Audio buttons:",
        musicButtons.length
    );

});
```

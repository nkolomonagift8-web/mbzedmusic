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
        audio.preload = "metadata";
        audio.style.display = "none";
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
       ALL MUSIC BUTTONS
    ===================================================== */

    const musicButtons =
        document.querySelectorAll("[data-audio]");

    console.log(
        "MBZEDMUSIC: Songs found:",
        musicButtons.length
    );


    let currentButton = null;
    let currentAudio = "";


    /* =====================================================
       UPDATE MAIN PLAYER ICON
    ===================================================== */

    function updateMainButton(isPlaying) {

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
                card.querySelector("p");

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
            cover: cover || ""
        };
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
       PLAY SONG
    ===================================================== */

    function playSong(button) {

        if (!button) {
            return;
        }


        const audioURL =
            button.getAttribute("data-audio");


        if (!audioURL) {

            console.warn(
                "MBZEDMUSIC: Button has no data-audio",
                button
            );

            return;
        }


        console.log(
            "MBZEDMUSIC: Loading song:",
            audioURL
        );


        const info =
            getSongInfo(button);


        currentButton = button;

        currentAudio = audioURL;


        /* PLAYER TITLE */

        if (playerTitle) {
            playerTitle.textContent =
                info.title;
        }


        /* PLAYER ARTIST */

        if (playerArtist) {
            playerArtist.textContent =
                info.artist;
        }


        /* PLAYER COVER */

        if (
            playerCover &&
            info.cover
        ) {

            playerCover.style.backgroundImage =
                'url("' + info.cover + '")';
        }


        /* SHOW PLAYER */

        showPlayer();


        /* STOP CURRENT AUDIO */

        audio.pause();


        /*
         IMPORTANT:
         Set src directly.
         Do NOT remove src first.
        */

        audio.src = audioURL;

        audio.load();


        /* RESET PROGRESS */

        if (progressFill) {
            progressFill.style.width = "0%";
        }


        /* PLAY */

        const playPromise =
            audio.play();


        if (playPromise !== undefined) {

            playPromise
                .then(function () {

                    console.log(
                        "MBZEDMUSIC: PLAYING"
                    );

                    updateMainButton(true);

                })
                .catch(function (error) {

                    console.error(
                        "MBZEDMUSIC: PLAY FAILED",
                        error
                    );

                    console.error(
                        "Audio URL:",
                        audioURL
                    );

                    updateMainButton(false);
                });
        }
    }


    /* =====================================================
       MUSIC BUTTONS
    ===================================================== */

    musicButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const url =
                    button.getAttribute("data-audio");


                if (!url) {

                    console.warn(
                        "MBZEDMUSIC: No data-audio on button"
                    );

                    return;
                }


                /* SAME SONG */

                if (
                    currentButton === button &&
                    currentAudio === url
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {

                                updateMainButton(true);

                            })
                            .catch(function (error) {

                                console.error(
                                    "MBZEDMUSIC: Resume failed",
                                    error
                                );

                            });

                    } else {

                        audio.pause();

                    }

                    return;
                }


                /* NEW SONG */

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


                /* NO SONG LOADED */

                if (!currentAudio) {

                    const firstSong =
                        document.querySelector(
                            "[data-audio]"
                        );

                    if (firstSong) {
                        playSong(firstSong);
                    }

                    return;
                }


                /* PAUSE */

                if (!audio.paused) {

                    audio.pause();

                    return;
                }


                /* PLAY */

                audio.play()
                    .then(function () {

                        updateMainButton(true);

                    })
                    .catch(function (error) {

                        console.error(
                            "MBZEDMUSIC: Play failed",
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

            console.log(
                "MBZEDMUSIC: Audio PLAY event"
            );

            updateMainButton(true);

            showPlayer();

        }
    );


    /* =====================================================
       AUDIO PAUSE
    ===================================================== */

    audio.addEventListener(
        "pause",
        function () {

            console.log(
                "MBZEDMUSIC: Audio PAUSE event"
            );

            updateMainButton(false);

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


            const percent =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            if (progressFill) {

                progressFill.style.width =
                    percent + "%";

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
                "MBZEDMUSIC: Song loaded"
            );

            console.log(
                "Duration:",
                audio.duration
            );

        }
    );


    /* =====================================================
       AUDIO CAN PLAY
    ===================================================== */

    audio.addEventListener(
        "canplay",
        function () {

            console.log(
                "MBZEDMUSIC: Audio ready to play"
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
                "================================"
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
                "================================"
            );

            updateMainButton(false);

        }
    );


    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        function () {

            console.log(
                "MBZEDMUSIC: Song ended"
            );


            updateMainButton(false);


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


            /* FIND NEXT SONG */

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
       CLOSE MOBILE MENU AFTER CLICK
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
       NEWSLETTER
    ===================================================== */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                alert(
                    "Thank you for subscribing to Mbzedmusic!"
                );

            }
        );

    }


    /* =====================================================
       FINAL DEBUG
    ===================================================== */

    console.log(
        "================================"
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


    musicButtons.forEach(
        function (button, index) {

            console.log(
                "Song " + (index + 1) + ":",
                button.getAttribute("data-audio")
            );

        }
    );


    console.log(
        "================================"
    );

});
```

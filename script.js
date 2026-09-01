```javascript
document.addEventListener("DOMContentLoaded", function () {

    console.log("MBZEDMUSIC PLAYER STARTING...");

    /* =========================================
       AUDIO
    ========================================= */

    const audio = new Audio();

    audio.preload = "auto";

    let currentButton = null;
    let currentSong = "";


    /* =========================================
       PLAYER ELEMENTS
    ========================================= */

    const player =
        document.getElementById("musicPlayer");

    const title =
        document.getElementById("playerTitle");

    const artist =
        document.getElementById("playerArtist");

    const cover =
        document.querySelector(".player-cover");

    const mainButton =
        document.getElementById("mainPlayerButton");

    const progress =
        document.querySelector(".player-progress");

    const progressFill =
        document.querySelector(".player-progress > div");


    /* =========================================
       GET ALL SONG BUTTONS
    ========================================= */

    const buttons =
        document.querySelectorAll(
            "button[data-audio]"
        );

    console.log(
        "MBZEDMUSIC SONG BUTTONS:",
        buttons.length
    );


    /* =========================================
       BUTTON ICON
    ========================================= */

    function setButtonIcon(playing) {

        if (!mainButton) return;

        const icon =
            mainButton.querySelector("i");

        if (!icon) return;

        if (playing) {

            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");

        } else {

            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");

        }
    }


    /* =========================================
       PLAY SONG
    ========================================= */

    function startSong(button) {

        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.error(
                "NO AUDIO URL FOUND"
            );

            return;
        }


        console.log(
            "LOADING AUDIO:",
            url
        );


        currentButton = button;
        currentSong = url;


        /* SONG INFO */

        const songTitle =
            button.getAttribute("data-title") ||
            "Now Playing";

        const songArtist =
            button.getAttribute("data-artist") ||
            "Mbzedmusic";

        const songCover =
            button.getAttribute("data-cover");


        /* UPDATE PLAYER */

        if (title) {
            title.textContent =
                songTitle;
        }

        if (artist) {
            artist.textContent =
                songArtist;
        }

        if (
            cover &&
            songCover
        ) {

            cover.style.backgroundImage =
                'url("' + songCover + '")';

        }


        if (player) {
            player.classList.add("active");
        }


        /* STOP OLD SONG */

        audio.pause();


        /* LOAD NEW SONG */

        audio.src = url;

        audio.load();


        /* PLAY */

        audio.play()
            .then(function () {

                console.log(
                    "=============================="
                );

                console.log(
                    "MBZEDMUSIC MUSIC PLAYING"
                );

                console.log(
                    audio.src
                );

                console.log(
                    "=============================="
                );

                setButtonIcon(true);

            })
            .catch(function (error) {

                console.error(
                    "MBZEDMUSIC PLAY ERROR:",
                    error
                );

                console.error(
                    "AUDIO URL:",
                    url
                );

                setButtonIcon(false);

            });

    }


    /* =========================================
       SONG BUTTONS
    ========================================= */

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const url =
                    button.getAttribute(
                        "data-audio"
                    );


                /* SAME SONG */

                if (
                    currentButton === button &&
                    currentSong === url
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {

                                setButtonIcon(true);

                            })
                            .catch(function (error) {

                                console.error(
                                    "RESUME ERROR:",
                                    error
                                );

                            });

                    } else {

                        audio.pause();

                    }

                    return;
                }


                /* NEW SONG */

                startSong(button);

            }
        );

    });


    /* =========================================
       MAIN PLAYER BUTTON
    ========================================= */

    if (mainButton) {

        mainButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* NO SONG YET */

                if (!currentSong) {

                    if (buttons.length > 0) {

                        startSong(buttons[0]);

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

                        setButtonIcon(true);

                    })
                    .catch(function (error) {

                        console.error(
                            "PLAY ERROR:",
                            error
                        );

                    });

            }
        );

    }


    /* =========================================
       AUDIO PLAY
    ========================================= */

    audio.addEventListener(
        "play",
        function () {

            console.log(
                "AUDIO PLAYING"
            );

            setButtonIcon(true);

        }
    );


    /* =========================================
       AUDIO PAUSE
    ========================================= */

    audio.addEventListener(
        "pause",
        function () {

            console.log(
                "AUDIO PAUSED"
            );

            setButtonIcon(false);

        }
    );


    /* =========================================
       AUDIO LOADED
    ========================================= */

    audio.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "AUDIO METADATA LOADED"
            );

            console.log(
                "DURATION:",
                audio.duration
            );

        }
    );


    /* =========================================
       CAN PLAY
    ========================================= */

    audio.addEventListener(
        "canplay",
        function () {

            console.log(
                "AUDIO CAN PLAY"
            );

        }
    );


    /* =========================================
       PROGRESS
    ========================================= */

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


    /* =========================================
       PROGRESS CLICK
    ========================================= */

    if (progress) {

        progress.addEventListener(
            "click",
            function (event) {

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {
                    return;
                }


                const rect =
                    progress.getBoundingClientRect();


                const percentage =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                audio.currentTime =
                    percentage *
                    audio.duration;

            }
        );

    }


    /* =========================================
       AUDIO ERROR
    ========================================= */

    audio.addEventListener(
        "error",
        function () {

            console.error(
                "================================"
            );

            console.error(
                "MBZEDMUSIC AUDIO FAILED"
            );

            console.error(
                "SOURCE:",
                audio.src
            );

            console.error(
                "ERROR:",
                audio.error
            );

            console.error(
                "================================"
            );

            setButtonIcon(false);

        }
    );


    /* =========================================
       SONG ENDED
    ========================================= */

    audio.addEventListener(
        "ended",
        function () {

            setButtonIcon(false);

            if (progressFill) {
                progressFill.style.width = "0%";
            }

        }
    );


    /* =========================================
       SEARCH
    ========================================= */

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
                    searchInput &&
                    searchBox.classList.contains(
                        "active"
                    )
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


    /* =========================================
       SEARCH FILTER
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const query =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const items =
                    document.querySelectorAll(
                        ".track, .release-card, .chart-item"
                    );


                items.forEach(function (item) {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        (
                            !query ||
                            text.includes(query)
                        )
                            ? ""
                            : "none";

                });

            }
        );

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

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

            }
        );

    }


    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

});
```

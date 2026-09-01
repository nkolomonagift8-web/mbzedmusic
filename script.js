document.addEventListener("DOMContentLoaded", function () {

    console.log("MBZEDMUSIC PLAYER STARTING...");

    /* =========================================
       AUDIO
    ========================================= */

    let audio = document.getElementById("audioPlayer");

    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "audioPlayer";
        audio.preload = "auto";
        audio.controls = false;
        document.body.appendChild(audio);
    }


    /* =========================================
       PLAYER
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
        document.querySelector(
            ".player-progress"
        );

    const progressFill =
        document.querySelector(
            ".player-progress > div"
        );


    /* =========================================
       FIND SONG BUTTONS
    ========================================= */

    const buttons =
        document.querySelectorAll(
            "button[data-audio]"
        );


    console.log(
        "SONG BUTTONS FOUND:",
        buttons.length
    );


    /* =========================================
       PLAY ICON
    ========================================= */

    function setPlayIcon(playing) {

        if (!mainButton) return;

        const icon =
            mainButton.querySelector("i");

        if (!icon) return;

        icon.className =
            playing
                ? "fa-solid fa-pause"
                : "fa-solid fa-play";
    }


    /* =========================================
       PLAY SONG
    ========================================= */

    function playSong(button) {

        const url =
            button.getAttribute(
                "data-audio"
            );


        console.log(
            "CLICKED SONG:"
        );

        console.log(
            "AUDIO URL:",
            url
        );


        if (!url) {

            console.error(
                "NO data-audio FOUND!"
            );

            return;
        }


        /* -------------------------------------
           SONG INFORMATION
        ------------------------------------- */

        const songTitle =
            button.getAttribute(
                "data-title"
            ) || "Now Playing";


        const songArtist =
            button.getAttribute(
                "data-artist"
            ) || "Mbzedmusic";


        const songCover =
            button.getAttribute(
                "data-cover"
            );


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
                "url('" +
                songCover +
                "')";
        }


        if (player) {
            player.classList.add(
                "active"
            );
        }


        /* -------------------------------------
           LOAD AUDIO
        ------------------------------------- */

        audio.pause();

        audio.src = url;

        audio.load();


        console.log(
            "AUDIO SOURCE SET:",
            audio.src
        );


        /* -------------------------------------
           PLAY
        ------------------------------------- */

        const playPromise =
            audio.play();


        if (playPromise) {

            playPromise
                .then(function () {

                    console.log(
                        "🎵 MUSIC IS PLAYING"
                    );

                    setPlayIcon(true);

                })
                .catch(function (error) {

                    console.error(
                        "❌ PLAY FAILED:"
                    );

                    console.error(
                        error
                    );

                });
        }

    }


    /* =========================================
       SONG BUTTON CLICKS
    ========================================= */

    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                console.log(
                    "MBZEDMUSIC SONG BUTTON CLICKED"
                );

                playSong(button);

            }
        );

    });


    /* =========================================
       MAIN PLAYER BUTTON
    ========================================= */

    if (mainButton) {

        mainButton.addEventListener(
            "click",
            function () {

                if (!audio.src) {

                    if (buttons.length) {

                        playSong(
                            buttons[0]
                        );

                    }

                    return;
                }


                if (audio.paused) {

                    audio.play()
                        .then(function () {

                            setPlayIcon(true);

                        })
                        .catch(function (error) {

                            console.error(
                                error
                            );

                        });

                } else {

                    audio.pause();

                    setPlayIcon(false);
                }

            }
        );
    }


    /* =========================================
       PLAY EVENT
    ========================================= */

    audio.addEventListener(
        "play",
        function () {

            console.log(
                "▶ PLAY EVENT"
            );

            setPlayIcon(true);

        }
    );


    /* =========================================
       PAUSE EVENT
    ========================================= */

    audio.addEventListener(
        "pause",
        function () {

            console.log(
                "⏸ PAUSE EVENT"
            );

            setPlayIcon(false);

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


                const percent =
                    (
                        event.clientX -
                        rect.left
                    ) / rect.width;


                audio.currentTime =
                    percent *
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
                "MBZEDMUSIC AUDIO ERROR"
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

        }
    );


    /* =========================================
       FINISHED
    ========================================= */

    audio.addEventListener(
        "ended",
        function () {

            setPlayIcon(false);

            if (progressFill) {
                progressFill.style.width =
                    "0%";
            }

        }
    );


    console.log(
        "================================"
    );

    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

    console.log(
        "BUTTONS:",
        buttons.length
    );

    console.log(
        "================================"
    );

});

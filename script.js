```javascript
document.addEventListener("DOMContentLoaded", function () {

    const audio = document.createElement("audio");

    audio.id = "mbzedAudio";
    audio.preload = "metadata";

    document.body.appendChild(audio);


    const player = document.getElementById("musicPlayer");

    const title = document.getElementById("playerTitle");

    const artist = document.getElementById("playerArtist");

    const cover = document.querySelector(".player-cover");

    const mainButton =
        document.getElementById("mainPlayerButton");

    const progress =
        document.querySelector(".player-progress");

    const progressFill =
        document.querySelector(".player-progress > div");


    let currentButton = null;


    /* =========================================
       FIND EVERY BUTTON WITH AUDIO
    ========================================= */

    function getAudioButtons() {

        return document.querySelectorAll(
            "[data-audio]"
        );

    }


    /* =========================================
       UPDATE ICON
    ========================================= */

    function updateIcons() {

        getAudioButtons().forEach(function (button) {

            const icon =
                button.querySelector("i");

            if (!icon) return;


            if (
                button === currentButton &&
                !audio.paused
            ) {

                icon.classList.remove("fa-play");

                icon.classList.add("fa-pause");

            } else {

                icon.classList.remove("fa-pause");

                icon.classList.add("fa-play");

            }

        });


        if (mainButton) {

            const icon =
                mainButton.querySelector("i");

            if (icon) {

                if (audio.paused) {

                    icon.classList.remove("fa-pause");

                    icon.classList.add("fa-play");

                } else {

                    icon.classList.remove("fa-play");

                    icon.classList.add("fa-pause");

                }

            }

        }

    }


    /* =========================================
       PLAY SONG
    ========================================= */

    function playSong(button) {

        const url =
            button.getAttribute("data-audio");


        if (!url) {

            console.error(
                "MBZEDMUSIC: This button has NO data-audio"
            );

            return;

        }


        currentButton = button;


        const songTitle =
            button.getAttribute("data-title") ||
            "Now Playing";


        const songArtist =
            button.getAttribute("data-artist") ||
            "Mbzedmusic";


        const songCover =
            button.getAttribute("data-cover");


        if (title) {

            title.textContent =
                songTitle;

        }


        if (artist) {

            artist.textContent =
                songArtist;

        }


        if (cover && songCover) {

            cover.style.backgroundImage =
                "url('" + songCover + "')";

        }


        if (player) {

            player.classList.add("active");

        }


        /*
           IMPORTANT:
           Stop first, then set source.
        */

        audio.pause();

        audio.currentTime = 0;

        audio.src = url;

        audio.load();


        console.log(
            "MBZEDMUSIC LOADING:",
            url
        );


        const playPromise =
            audio.play();


        if (playPromise) {

            playPromise
                .then(function () {

                    console.log(
                        "MBZEDMUSIC PLAYING"
                    );

                    updateIcons();

                })
                .catch(function (error) {

                    console.error(
                        "MBZEDMUSIC PLAY ERROR:",
                        error
                    );

                    console.error(
                        "URL:",
                        url
                    );

                });

        }

    }


    /* =========================================
       BUTTON CLICKS
    ========================================= */

    getAudioButtons().forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                /*
                   Same song
                */

                if (
                    button === currentButton &&
                    audio.src ===
                    button.getAttribute("data-audio")
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {

                                updateIcons();

                            })
                            .catch(function (error) {

                                console.error(
                                    error
                                );

                            });

                    } else {

                        audio.pause();

                    }


                    updateIcons();

                    return;

                }


                /*
                   New song
                */

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
            function (event) {

                event.preventDefault();


                if (!currentButton) {

                    const firstButton =
                        document.querySelector(
                            "[data-audio]"
                        );


                    if (firstButton) {

                        playSong(
                            firstButton
                        );

                    }

                    return;

                }


                if (audio.paused) {

                    audio.play()
                        .then(function () {

                            updateIcons();

                        })
                        .catch(function (error) {

                            console.error(
                                error
                            );

                        });

                } else {

                    audio.pause();

                }


                updateIcons();

            }
        );

    }


    /* =========================================
       AUDIO PLAY
    ========================================= */

    audio.addEventListener(
        "play",
        function () {

            updateIcons();

        }
    );


    /* =========================================
       AUDIO PAUSE
    ========================================= */

    audio.addEventListener(
        "pause",
        function () {

            updateIcons();

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
       CLICK PROGRESS
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
       SONG ENDED
    ========================================= */

    audio.addEventListener(
        "ended",
        function () {

            if (progressFill) {

                progressFill.style.width =
                    "0%";

            }


            updateIcons();

        }
    );


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

        }
    );


    /* =========================================
       READY
    ========================================= */

    console.log(
        "MBZEDMUSIC PLAYER ONLINE"
    );


    console.log(
        "Audio buttons:",
        getAudioButtons().length
    );

});
```

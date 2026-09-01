```javascript
document.addEventListener("DOMContentLoaded", function () {

    console.log("MBZEDMUSIC PLAYER STARTING...");

    const audio = new Audio();
    audio.preload = "metadata";

    let currentButton = null;


    function getButtons() {
        return document.querySelectorAll("[data-audio]");
    }


    function updateButtons() {

        getButtons().forEach(function (button) {

            const icon = button.querySelector("i");

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


        const mainButton =
            document.getElementById("mainPlayerButton");

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


    function loadAndPlay(button) {

        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.error(
                "MBZEDMUSIC: No data-audio found."
            );

            return;

        }


        const title =
            button.getAttribute("data-title") ||
            "Now Playing";

        const artist =
            button.getAttribute("data-artist") ||
            "Mbzedmusic";

        const cover =
            button.getAttribute("data-cover");


        const player =
            document.getElementById("musicPlayer");

        const playerTitle =
            document.getElementById("playerTitle");

        const playerArtist =
            document.getElementById("playerArtist");

        const playerCover =
            document.querySelector(".player-cover");


        if (player) {
            player.classList.add("active");
        }


        if (playerTitle) {
            playerTitle.textContent = title;
        }


        if (playerArtist) {
            playerArtist.textContent = artist;
        }


        if (playerCover && cover) {

            playerCover.style.backgroundImage =
                "url('" + cover + "')";

        }


        currentButton = button;


        audio.pause();

        audio.src = url;

        audio.load();


        console.log(
            "MBZEDMUSIC AUDIO URL:",
            url
        );


        audio.play()
            .then(function () {

                console.log(
                    "MBZEDMUSIC MUSIC IS PLAYING"
                );

                updateButtons();

            })
            .catch(function (error) {

                console.error(
                    "MBZEDMUSIC PLAY ERROR:",
                    error
                );

            });

    }


    getButtons().forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (
                    button === currentButton
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {
                                updateButtons();
                            })
                            .catch(function (error) {
                                console.error(error);
                            });

                    } else {

                        audio.pause();

                    }

                    updateButtons();

                    return;
                }


                loadAndPlay(button);

            }
        );

    });


    const mainButton =
        document.getElementById(
            "mainPlayerButton"
        );


    if (mainButton) {

        mainButton.addEventListener(
            "click",
            function () {

                if (!currentButton) {

                    const first =
                        document.querySelector(
                            "[data-audio]"
                        );

                    if (first) {
                        loadAndPlay(first);
                    }

                    return;

                }


                if (audio.paused) {

                    audio.play()
                        .then(function () {
                            updateButtons();
                        })
                        .catch(function (error) {
                            console.error(error);
                        });

                } else {

                    audio.pause();

                }


                updateButtons();

            }
        );

    }


    audio.addEventListener(
        "play",
        function () {

            console.log(
                "MBZEDMUSIC: PLAY EVENT"
            );

            updateButtons();

        }
    );


    audio.addEventListener(
        "pause",
        function () {

            console.log(
                "MBZEDMUSIC: PAUSE EVENT"
            );

            updateButtons();

        }
    );


    audio.addEventListener(
        "loadedmetadata",
        function () {

            console.log(
                "MBZEDMUSIC: AUDIO LOADED"
            );

            console.log(
                "Duration:",
                audio.duration
            );

        }
    );


    audio.addEventListener(
        "error",
        function () {

            console.error(
                "MBZEDMUSIC AUDIO ERROR"
            );

            console.error(
                "URL:",
                audio.src
            );

            console.error(
                "ERROR:",
                audio.error
            );

        }
    );


    console.log(
        "MBZEDMUSIC PLAYER READY"
    );

    console.log(
        "Audio buttons found:",
        getButtons().length
    );

});
```

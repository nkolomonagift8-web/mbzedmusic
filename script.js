```javascript
/* =========================================================
   MBZEDMUSIC.COM
   STABLE MUSIC PLAYER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------------------------------------
       AUDIO ELEMENT
    ------------------------------------------------------- */

    let audio = document.getElementById("audioPlayer");

    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "audioPlayer";
        audio.preload = "metadata";
        audio.setAttribute("playsinline", "");
        document.body.appendChild(audio);
    }


    /* -------------------------------------------------------
       PLAYER
    ------------------------------------------------------- */

    const musicPlayer = document.getElementById("musicPlayer");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerArtist =
        document.getElementById("playerArtist");

    const playerCover =
        document.querySelector(".player-cover");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton");

    const playerProgress =
        document.querySelector(".player-progress");

    const progressBar =
        document.querySelector(".player-progress > div");


    /* -------------------------------------------------------
       ALL PLAY BUTTONS
    ------------------------------------------------------- */

    const musicButtons =
        document.querySelectorAll(
            ".play-button[data-audio], .card-play[data-audio]"
        );


    let currentButton = null;
    let currentAudio = "";


    /* -------------------------------------------------------
       PLAY ICON
    ------------------------------------------------------- */

    function setButtonIcon(button, playing) {

        if (!button) return;

        const icon = button.querySelector("i");

        if (!icon) return;

        icon.classList.toggle("fa-play", !playing);
        icon.classList.toggle("fa-pause", playing);
    }


    function updateAllButtons() {

        musicButtons.forEach(button => {

            setButtonIcon(
                button,
                button === currentButton && !audio.paused
            );

        });

        if (mainPlayerButton) {

            const icon =
                mainPlayerButton.querySelector("i");

            if (icon) {

                icon.classList.toggle(
                    "fa-play",
                    audio.paused
                );

                icon.classList.toggle(
                    "fa-pause",
                    !audio.paused
                );

            }
        }
    }


    /* -------------------------------------------------------
       GET SONG INFORMATION
    ------------------------------------------------------- */

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
                card.querySelector("p");

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

                const bg =
                    getComputedStyle(image).backgroundImage;

                if (bg && bg !== "none") {

                    cover =
                        bg
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


    /* -------------------------------------------------------
       SHOW PLAYER
    ------------------------------------------------------- */

    function showPlayer() {

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }
    }


    /* -------------------------------------------------------
       LOAD SONG
    ------------------------------------------------------- */

    function loadSong(button) {

        if (!button) return false;

        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.warn(
                "MBZEDMUSIC: No data-audio on button",
                button
            );

            return false;
        }


        const info =
            getSongInfo(button);


        currentButton = button;
        currentAudio = url;


        /* Player text */

        if (playerTitle) {
            playerTitle.textContent =
                info.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                info.artist;
        }


        /* Player cover */

        if (playerCover && info.cover) {

            playerCover.style.backgroundImage =
                `url("${info.cover}")`;

        }


        showPlayer();


        /* Stop current audio */

        audio.pause();


        /* IMPORTANT:
           Set the new source directly.
        */

        audio.src = url;

        audio.load();


        console.log(
            "MBZEDMUSIC: Loading:",
            url
        );

        return true;
    }


    /* -------------------------------------------------------
       PLAY SONG
    ------------------------------------------------------- */

    async function playSong(button) {

        if (!button) return;


        const url =
            button.getAttribute("data-audio");

        if (!url) {

            console.warn(
                "MBZEDMUSIC: Button has no audio:",
                button
            );

            return;
        }


        /* Same song */

        if (
            currentButton === button &&
            currentAudio === url
        ) {

            if (audio.paused) {

                try {

                    await audio.play();

                } catch (error) {

                    console.error(
                        "MBZEDMUSIC PLAY ERROR:",
                        error
                    );

                }

            } else {

                audio.pause();

            }

            updateAllButtons();

            return;
        }


        /* New song */

        const loaded =
            loadSong(button);

        if (!loaded) return;


        try {

            await audio.play();

            updateAllButtons();

            console.log(
                "MBZEDMUSIC: Playing:",
                url
            );

        } catch (error) {

            console.error(
                "MBZEDMUSIC: Playback failed:",
                error
            );

            console.error(
                "Audio URL:",
                url
            );

            updateAllButtons();
        }
    }


    /* -------------------------------------------------------
       PLAY BUTTONS
    ------------------------------------------------------- */

    musicButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            playSong(button);

        });

    });


    /* -------------------------------------------------------
       MAIN PLAYER BUTTON
    ------------------------------------------------------- */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                /* Nothing loaded */

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


                if (audio.paused) {

                    try {

                        await audio.play();

                    } catch (error) {

                        console.error(
                            "MBZEDMUSIC:",
                            error
                        );

                    }

                } else {

                    audio.pause();

                }

                updateAllButtons();

            }
        );
    }


    /* -------------------------------------------------------
       AUDIO PLAY
    ------------------------------------------------------- */

    audio.addEventListener("play", () => {

        showPlayer();

        updateAllButtons();

    });


    /* -------------------------------------------------------
       AUDIO PAUSE
    ------------------------------------------------------- */

    audio.addEventListener("pause", () => {

        updateAllButtons();

    });


    /* -------------------------------------------------------
       PROGRESS
    ------------------------------------------------------- */

    audio.addEventListener("timeupdate", () => {

        if (
            !audio.duration ||
            !isFinite(audio.duration)
        ) {
            return;
        }


        const percent =
            (audio.currentTime /
             audio.duration) * 100;


        if (progressBar) {

            progressBar.style.width =
                percent + "%";

        }

    });


    /* -------------------------------------------------------
       METADATA
    ------------------------------------------------------- */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "MBZEDMUSIC: Duration:",
                audio.duration
            );

        }
    );


    /* -------------------------------------------------------
       AUDIO ERROR
    ------------------------------------------------------- */

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
                "Source:",
                audio.currentSrc || audio.src
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
                "================================"
            );

            updateAllButtons();

        }
    );


    /* -------------------------------------------------------
       SONG ENDED
    ------------------------------------------------------- */

    audio.addEventListener("ended", () => {

        if (progressBar) {
            progressBar.style.width = "0%";
        }


        updateAllButtons();


        if (!currentButton) return;


        const buttons =
            Array.from(musicButtons);


        const index =
            buttons.indexOf(currentButton);


        if (index === -1) return;


        /* Find next song */

        for (
            let i = index + 1;
            i < buttons.length;
            i++
        ) {

            const next =
                buttons[i];


            if (
                next.hasAttribute("data-audio")
            ) {

                playSong(next);

                return;
            }

        }

    });


    /* -------------------------------------------------------
       CLICK PROGRESS BAR
    ------------------------------------------------------- */

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


                const position =
                    event.clientX - rect.left;


                let percentage =
                    position / rect.width;


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


    /* -------------------------------------------------------
       SEARCH
    ------------------------------------------------------- */

    const searchButton =
        document.getElementById("searchButton");

    const searchBox =
        document.getElementById("searchBox");

    const searchInput =
        document.getElementById("searchInput");

    const closeSearch =
        document.getElementById("closeSearch");


    if (searchButton && searchBox) {

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


    if (closeSearch && searchBox) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchBox.classList.remove(
                    "active"
                );

            }
        );

    }


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


    /* -------------------------------------------------------
       MOBILE MENU
    ------------------------------------------------------- */

    const mobileMenu =
        document.getElementById("mobileMenu");

    const navigation =
        document.getElementById("navigation");


    if (mobileMenu && navigation) {

        mobileMenu.addEventListener(
            "click",
            () => {

                navigation.classList.toggle(
                    "active"
                );


                const icon =
                    mobileMenu.querySelector("i");


                if (!icon) return;


                const open =
                    navigation.classList.contains(
                        "active"
                    );


                icon.classList.toggle(
                    "fa-bars",
                    !open
                );

                icon.classList.toggle(
                    "fa-xmark",
                    open
                );

            }
        );

    }


    /* -------------------------------------------------------
       CLOSE MOBILE MENU
    ------------------------------------------------------- */

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

                    }
                );

            });

    }


    /* -------------------------------------------------------
       STARTUP
    ------------------------------------------------------- */

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
        "Playable songs:",
        musicButtons.length
    );

    musicButtons.forEach(button => {

        console.log(
            button.dataset.title ||
            "Song",
            "→",
            button.dataset.audio
        );

    });

    console.log(
        "================================"
    );

});
```

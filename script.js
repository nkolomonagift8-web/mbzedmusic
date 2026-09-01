```javascript
/* =========================================================
   MBZEDMUSIC.COM
   PROFESSIONAL MUSIC PLAYER
   PLAY / PAUSE / NEXT / PREVIOUS
   VOLUME / MUTE / PROGRESS / SHUFFLE / REPEAT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

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


    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

    const musicPlayer =
        document.getElementById("musicPlayer");

    const playerCover =
        document.getElementById("playerCover") ||
        document.querySelector(".player-cover");

    const playerTitle =
        document.getElementById("playerTitle");

    const playerArtist =
        document.getElementById("playerArtist");

    const mainPlayerButton =
        document.getElementById("mainPlayerButton");

    const previousButton =
        document.getElementById("previousButton");

    const nextButton =
        document.getElementById("nextButton");

    const playerProgress =
        document.getElementById("playerProgress") ||
        document.querySelector(".player-progress");

    const progressBar =
        document.getElementById("progressBar") ||
        document.querySelector(".player-progress > div");

    const currentTimeElement =
        document.getElementById("currentTime");

    const durationElement =
        document.getElementById("duration");

    const volumeButton =
        document.getElementById("volumeButton");

    const volumeSlider =
        document.getElementById("volumeSlider");

    const shuffleButton =
        document.getElementById("shuffleButton");

    const repeatButton =
        document.getElementById("repeatButton");


    /* =====================================================
       MUSIC BUTTONS
    ===================================================== */

    const musicButtons =
        Array.from(
            document.querySelectorAll("[data-audio]")
        );


    /* =====================================================
       PLAYER STATE
    ===================================================== */

    let currentButton = null;

    let currentIndex = -1;

    let currentAudio = "";

    let shuffleEnabled = false;

    let repeatEnabled = false;

    let lastVolume = 1;


    /* =====================================================
       INITIAL VOLUME
    ===================================================== */

    audio.volume = 1;

    if (volumeSlider) {
        volumeSlider.value = 1;
    }


    /* =====================================================
       TIME FORMAT
    ===================================================== */

    function formatTime(seconds) {

        if (
            !seconds ||
            !isFinite(seconds)
        ) {
            return "0:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return (
            minutes +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );
    }


    /* =====================================================
       PLAY BUTTON ICON
    ===================================================== */

    function updateMainButton(isPlaying) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

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
       UPDATE ALL SONG BUTTONS
    ===================================================== */

    function updateSongButtons() {

        musicButtons.forEach(function (button) {

            const icon =
                button.querySelector("i");

            if (!icon) return;

            const isCurrent =
                button === currentButton;

            const isPlaying =
                isCurrent &&
                !audio.paused;

            icon.classList.remove("fa-play");
            icon.classList.remove("fa-pause");

            if (isPlaying) {

                icon.classList.add("fa-pause");

                button.classList.add(
                    "playing"
                );

                button.setAttribute(
                    "aria-label",
                    "Pause music"
                );

            } else {

                icon.classList.add("fa-play");

                button.classList.remove(
                    "playing"
                );

                button.setAttribute(
                    "aria-label",
                    "Play music"
                );
            }

        });
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

            title:
                title || "Now Playing",

            artist:
                artist || "Mbzedmusic",

            cover:
                cover || ""

        };
    }


    /* =====================================================
       SET PLAYER INFORMATION
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


        if (
            playerCover &&
            info.cover
        ) {

            playerCover.style.backgroundImage =
                `url("${info.cover}")`;

        }
    }


    /* =====================================================
       SHOW PLAYER
    ===================================================== */

    function showPlayer() {

        if (!musicPlayer) return;

        musicPlayer.classList.add(
            "active"
        );
    }


    /* =====================================================
       RESET PROGRESS
    ===================================================== */

    function resetProgress() {

        if (progressBar) {

            progressBar.style.width =
                "0%";

        }

        if (currentTimeElement) {

            currentTimeElement.textContent =
                "0:00";

        }

        if (durationElement) {

            durationElement.textContent =
                "0:00";

        }
    }


    /* =====================================================
       PLAY SONG
    ===================================================== */

    function playSong(button) {

        if (!button) return;


        const audioURL =
            button.getAttribute(
                "data-audio"
            );


        if (!audioURL) {

            console.warn(
                "Mbzedmusic: No data-audio on this button.",
                button
            );

            return;
        }


        const newIndex =
            musicButtons.indexOf(button);


        currentButton =
            button;

        currentIndex =
            newIndex;

        currentAudio =
            audioURL;


        /* PLAYER INFORMATION */

        updatePlayerInfo(
            button
        );

        showPlayer();


        /* SAME SONG */

        if (
            audio.src ===
                new URL(
                    audioURL,
                    window.location.href
                ).href
            &&
            !audio.paused
        ) {

            return;
        }


        /* STOP CURRENT */

        audio.pause();


        /* LOAD NEW */

        audio.src =
            audioURL;

        audio.load();


        resetProgress();


        /* PLAY */

        const playPromise =
            audio.play();


        if (
            playPromise &&
            typeof playPromise.then === "function"
        ) {

            playPromise
                .then(function () {

                    updateMainButton(
                        true
                    );

                    updateSongButtons();

                })
                .catch(function (error) {

                    console.error(
                        "MBZEDMUSIC PLAY ERROR:",
                        error
                    );

                    console.error(
                        "Audio URL:",
                        audioURL
                    );

                    updateMainButton(
                        false
                    );

                    updateSongButtons();

                });

        }

    }


    /* =====================================================
       MUSIC BUTTON CLICKS
    ===================================================== */

    musicButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const url =
                    button.getAttribute(
                        "data-audio"
                    );


                /*
                 * Buttons without data-audio
                 * are simply not playable yet.
                 */

                if (!url) {

                    console.log(
                        "Mbzedmusic: This song is coming soon."
                    );

                    return;
                }


                /*
                 * CURRENT SONG
                 */

                if (
                    currentButton === button &&
                    currentAudio === url
                ) {

                    if (audio.paused) {

                        audio.play()
                            .then(function () {

                                updateMainButton(
                                    true
                                );

                                updateSongButtons();

                            })
                            .catch(function (error) {

                                console.error(
                                    "Playback error:",
                                    error
                                );

                            });

                    } else {

                        audio.pause();

                    }

                    return;
                }


                /*
                 * NEW SONG
                 */

                playSong(
                    button
                );

            }
        );

    });


    /* =====================================================
       MAIN PLAY / PAUSE
    ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /*
                 * NO SONG SELECTED
                 */

                if (!currentAudio) {

                    const firstSong =
                        musicButtons.find(
                            function (button) {

                                return button.hasAttribute(
                                    "data-audio"
                                );

                            }
                        );


                    if (firstSong) {

                        playSong(
                            firstSong
                        );

                    }

                    return;
                }


                /*
                 * PAUSE
                 */

                if (!audio.paused) {

                    audio.pause();

                    return;
                }


                /*
                 * PLAY
                 */

                audio.play()
                    .then(function () {

                        updateMainButton(
                            true
                        );

                        updateSongButtons();

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
       PREVIOUS SONG
    ===================================================== */

    function playPrevious() {

        if (!musicButtons.length) return;


        /*
         * If song has played more than
         * 3 seconds, restart it.
         */

        if (
            audio.currentTime > 3
        ) {

            audio.currentTime =
                0;

            return;
        }


        let index =
            currentIndex;


        if (index <= 0) {

            index =
                musicButtons.length - 1;

        } else {

            index--;

        }


        /*
         * Find previous playable song
         */

        for (
            let i = 0;
            i < musicButtons.length;
            i++
        ) {

            const button =
                musicButtons[index];


            if (
                button &&
                button.hasAttribute(
                    "data-audio"
                )
            ) {

                playSong(
                    button
                );

                return;
            }


            index--;

            if (index < 0) {

                index =
                    musicButtons.length - 1;

            }

        }

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                playPrevious();

            }
        );

    }


    /* =====================================================
       NEXT SONG
    ===================================================== */

    function playNext() {

        if (!musicButtons.length) return;


        /*
         * SHUFFLE
         */

        if (shuffleEnabled) {

            const playableSongs =
                musicButtons.filter(
                    function (button) {

                        return button.hasAttribute(
                            "data-audio"
                        );

                    }
                );


            if (playableSongs.length) {

                let randomButton;

                if (
                    playableSongs.length === 1
                ) {

                    randomButton =
                        playableSongs[0];

                } else {

                    do {

                        randomButton =
                            playableSongs[
                                Math.floor(
                                    Math.random() *
                                    playableSongs.length
                                )
                            ];

                    } while (
                        randomButton ===
                        currentButton
                    );

                }


                playSong(
                    randomButton
                );

                return;
            }

        }


        /*
         * NORMAL NEXT
         */

        let index =
            currentIndex + 1;


        if (
            index >=
            musicButtons.length
        ) {

            index = 0;

        }


        /*
         * Find next playable song
         */

        for (
            let i = 0;
            i < musicButtons.length;
            i++
        ) {

            const button =
                musicButtons[index];


            if (
                button &&
                button.hasAttribute(
                    "data-audio"
                )
            ) {

                playSong(
                    button
                );

                return;
            }


            index++;

            if (
                index >=
                musicButtons.length
            ) {

                index = 0;

            }

        }

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                playNext();

            }
        );

    }


    /* =====================================================
       AUDIO PLAY
    ===================================================== */

    audio.addEventListener(
        "play",
        function () {

            updateMainButton(
                true
            );

            updateSongButtons();

            showPlayer();

        }
    );


    /* =====================================================
       AUDIO PAUSE
    ===================================================== */

    audio.addEventListener(
        "pause",
        function () {

            updateMainButton(
                false
            );

            updateSongButtons();

        }
    );


    /* =====================================================
       LOADED METADATA
    ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        function () {

            if (durationElement) {

                durationElement.textContent =
                    formatTime(
                        audio.duration
                    );

            }

        }
    );


    /* =====================================================
       TIME UPDATE
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
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            if (progressBar) {

                progressBar.style.width =
                    percentage + "%";

            }


            if (currentTimeElement) {

                currentTimeElement.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }


            if (durationElement) {

                durationElement.textContent =
                    formatTime(
                        audio.duration
                    );

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
       VOLUME SLIDER
    ===================================================== */

    if (volumeSlider) {

        volumeSlider.addEventListener(
            "input",
            function () {

                let value =
                    parseFloat(
                        volumeSlider.value
                    );


                if (
                    !isFinite(value)
                ) {

                    value = 1;

                }


                value =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            value
                        )
                    );


                audio.volume =
                    value;


                if (
                    value > 0
                ) {

                    lastVolume =
                        value;

                }


                updateVolumeIcon();

            }
        );

    }


    /* =====================================================
       VOLUME ICON
    ===================================================== */

    function updateVolumeIcon() {

        if (!volumeButton) return;


        const icon =
            volumeButton.querySelector("i");

        if (!icon) return;


        icon.classList.remove(
            "fa-volume-high"
        );

        icon.classList.remove(
            "fa-volume-low"
        );

        icon.classList.remove(
            "fa-volume-xmark"
        );


        if (
            audio.volume === 0
        ) {

            icon.classList.add(
                "fa-volume-xmark"
            );

            volumeButton.setAttribute(
                "aria-label",
                "Unmute"
            );

        } else if (
            audio.volume < 0.5
        ) {

            icon.classList.add(
                "fa-volume-low"
            );

            volumeButton.setAttribute(
                "aria-label",
                "Mute"
            );

        } else {

            icon.classList.add(
                "fa-volume-high"
            );

            volumeButton.setAttribute(
                "aria-label",
                "Mute"
            );

        }

    }


    /* =====================================================
       MUTE BUTTON
    ===================================================== */

    if (volumeButton) {

        volumeButton.addEventListener(
            "click",
            function () {

                if (
                    audio.volume > 0
                ) {

                    lastVolume =
                        audio.volume;

                    audio.volume =
                        0;

                } else {

                    audio.volume =
                        lastVolume ||
                        1;

                }


                if (volumeSlider) {

                    volumeSlider.value =
                        audio.volume;

                }


                updateVolumeIcon();

            }
        );

    }


    /* =====================================================
       SHUFFLE
    ===================================================== */

    if (shuffleButton) {

        shuffleButton.addEventListener(
            "click",
            function () {

                shuffleEnabled =
                    !shuffleEnabled;


                shuffleButton.classList.toggle(
                    "active",
                    shuffleEnabled
                );


                shuffleButton.setAttribute(
                    "aria-label",
                    shuffleEnabled
                        ? "Shuffle on"
                        : "Shuffle off"
                );


                console.log(
                    "Shuffle:",
                    shuffleEnabled
                );

            }
        );

    }


    /* =====================================================
       REPEAT
    ===================================================== */

    if (repeatButton) {

        repeatButton.addEventListener(
            "click",
            function () {

                repeatEnabled =
                    !repeatEnabled;


                repeatButton.classList.toggle(
                    "active",
                    repeatEnabled
                );


                repeatButton.setAttribute(
                    "aria-label",
                    repeatEnabled
                        ? "Repeat on"
                        : "Repeat off"
                );


                console.log(
                    "Repeat:",
                    repeatEnabled
                );

            }
        );

    }


    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        function () {

            updateMainButton(
                false
            );

            updateSongButtons();


            if (progressBar) {

                progressBar.style.width =
                    "0%";

            }


            if (currentTimeElement) {

                currentTimeElement.textContent =
                    "0:00";

            }


            /*
             * REPEAT CURRENT SONG
             */

            if (repeatEnabled) {

                audio.currentTime =
                    0;

                audio.play()
                    .catch(function (error) {

                        console.error(
                            "Repeat playback error:",
                            error
                        );

                    });

                return;
            }


            /*
             * OTHERWISE PLAY NEXT
             */

            playNext();

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


            updateMainButton(
                false
            );

            updateSongButtons();

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
                            text.includes(
                                query
                            )
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

                            const icon =
                                mobileMenu
                                    ? mobileMenu.querySelector(
                                        "i"
                                    )
                                    : null;


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

                }
            );

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
                    "Thank you for connecting with Mbzedmusic.com!"
                );

                newsletterForm.reset();

            }
        );

    }


    /* =====================================================
       INITIAL PLAYER STATE
    ===================================================== */

    updateVolumeIcon();

    updateMainButton(false);

    updateSongButtons();


    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "================================="
    );

    console.log(
        "MBZEDMUSIC PROFESSIONAL PLAYER READY"
    );

    console.log(
        "Playable songs:",
        musicButtons.length
    );

    console.log(
        "Audio element:",
        audio
    );

    console.log(
        "Shuffle:",
        shuffleEnabled
    );

    console.log(
        "Repeat:",
        repeatEnabled
    );

    musicButtons.forEach(
        function (button, index) {

            if (
                button.hasAttribute(
                    "data-audio"
                )
            ) {

                console.log(
                    "Song",
                    index + 1,
                    ":",
                    button.getAttribute(
                        "data-audio"
                    )
                );

            }

        }
    );

    console.log(
        "================================="
    );

});
```

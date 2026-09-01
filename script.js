```javascript
/* =========================================================
   MBZEDMUSIC.COM
   FULL MUSIC PLAYER — UPGRADED VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       AUDIO ENGINE
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
        playerProgress?.querySelector("div");

    /* =====================================================
       ALL MUSIC BUTTONS
    ===================================================== */

    const musicButtons = Array.from(
        document.querySelectorAll("[data-audio]")
    );

    let currentButton = null;
    let currentAudio = "";
    let isShuffle = false;
    let isRepeat = false;

    /* =====================================================
       CREATE EXTRA PLAYER CONTROLS
    ===================================================== */

    const playerInner =
        musicPlayer?.querySelector(".player-inner");

    if (playerInner) {

        /* Previous button */

        if (!document.getElementById("prevPlayerButton")) {

            const previousButton =
                document.createElement("button");

            previousButton.type = "button";
            previousButton.id = "prevPlayerButton";
            previousButton.className = "player-control prev-player-button";
            previousButton.setAttribute("aria-label", "Previous song");

            previousButton.innerHTML =
                '<i class="fa-solid fa-backward-step"></i>';

            playerInner.insertBefore(
                previousButton,
                mainPlayerButton
            );
        }


        /* Next button */

        if (!document.getElementById("nextPlayerButton")) {

            const nextButton =
                document.createElement("button");

            nextButton.type = "button";
            nextButton.id = "nextPlayerButton";
            nextButton.className = "player-control next-player-button";
            nextButton.setAttribute("aria-label", "Next song");

            nextButton.innerHTML =
                '<i class="fa-solid fa-forward-step"></i>';

            mainPlayerButton?.insertAdjacentElement(
                "afterend",
                nextButton
            );
        }


        /* Shuffle button */

        if (!document.getElementById("shufflePlayerButton")) {

            const shuffleButton =
                document.createElement("button");

            shuffleButton.type = "button";
            shuffleButton.id = "shufflePlayerButton";
            shuffleButton.className = "player-control shuffle-player-button";
            shuffleButton.setAttribute("aria-label", "Shuffle");

            shuffleButton.innerHTML =
                '<i class="fa-solid fa-shuffle"></i>';

            playerInner.insertBefore(
                shuffleButton,
                mainPlayerButton
            );
        }


        /* Repeat button */

        if (!document.getElementById("repeatPlayerButton")) {

            const repeatButton =
                document.createElement("button");

            repeatButton.type = "button";
            repeatButton.id = "repeatPlayerButton";
            repeatButton.className = "player-control repeat-player-button";
            repeatButton.setAttribute("aria-label", "Repeat");

            repeatButton.innerHTML =
                '<i class="fa-solid fa-repeat"></i>';

            playerInner.appendChild(
                repeatButton
            );
        }


        /* Volume */

        if (!document.getElementById("playerVolume")) {

            const volumeWrapper =
                document.createElement("div");

            volumeWrapper.className =
                "player-volume-wrapper";

            volumeWrapper.innerHTML = `
                <i class="fa-solid fa-volume-high"></i>
                <input
                    type="range"
                    id="playerVolume"
                    min="0"
                    max="1"
                    step="0.01"
                    value="1"
                    aria-label="Volume">
            `;

            playerInner.appendChild(
                volumeWrapper
            );
        }


        /* Time display */

        if (!document.getElementById("playerTime")) {

            const timeDisplay =
                document.createElement("div");

            timeDisplay.id =
                "playerTime";

            timeDisplay.className =
                "player-time";

            timeDisplay.textContent =
                "0:00 / 0:00";

            playerInner.appendChild(
                timeDisplay
            );
        }
    }

    /* =====================================================
       EXTRA CONTROLS
    ===================================================== */

    const prevButton =
        document.getElementById("prevPlayerButton");

    const nextButton =
        document.getElementById("nextPlayerButton");

    const shuffleButton =
        document.getElementById("shufflePlayerButton");

    const repeatButton =
        document.getElementById("repeatPlayerButton");

    const volumeSlider =
        document.getElementById("playerVolume");

    const playerTime =
        document.getElementById("playerTime");

    /* =====================================================
       DEFAULT VOLUME
    ===================================================== */

    audio.volume = 1;

    if (volumeSlider) {
        volumeSlider.value = "1";
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
            Math.floor(seconds % 60)
                .toString()
                .padStart(2, "0");

        return `${minutes}:${remainingSeconds}`;
    }

    /* =====================================================
       UPDATE TIME
    ===================================================== */

    function updateTime() {

        if (!playerTime) return;

        playerTime.textContent =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }

    /* =====================================================
       PLAY BUTTON ICON
    ===================================================== */

    function updatePlayButton(playing) {

        if (!mainPlayerButton) return;

        const icon =
            mainPlayerButton.querySelector("i");

        if (!icon) return;

        icon.classList.toggle(
            "fa-play",
            !playing
        );

        icon.classList.toggle(
            "fa-pause",
            playing
        );

        mainPlayerButton.setAttribute(
            "aria-label",
            playing
                ? "Pause music"
                : "Play music"
        );
    }

    /* =====================================================
       ACTIVE TRACK
    ===================================================== */

    function updateActiveTrack() {

        musicButtons.forEach(button => {

            const card =
                button.closest(
                    ".track, .release-card, .chart-item"
                );

            if (!card) return;

            card.classList.toggle(
                "is-playing",
                button === currentButton &&
                !audio.paused
            );

            const icon =
                button.querySelector("i");

            if (!icon) return;

            icon.classList.toggle(
                "fa-play",
                button !== currentButton ||
                audio.paused
            );

            icon.classList.toggle(
                "fa-pause",
                button === currentButton &&
                !audio.paused
            );
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
            title:
                title || "Now Playing",

            artist:
                artist || "Mbzedmusic",

            cover:
                cover || ""
        };
    }

    /* =====================================================
       SHOW SONG
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

        if (musicPlayer) {
            musicPlayer.classList.add("active");
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
                "Mbzedmusic: No data-audio on button.",
                button
            );

            return;
        }

        currentButton = button;
        currentAudio = audioURL;

        updatePlayerInfo(button);

        /* Stop old audio */

        audio.pause();

        /* Load new audio */

        audio.src = audioURL;

        audio.load();

        updateTime();

        try {

            await audio.play();

            updatePlayButton(true);

            updateActiveTrack();

        } catch (error) {

            console.error(
                "MBZEDMUSIC PLAYBACK ERROR:",
                error
            );

            console.error(
                "Audio URL:",
                audioURL
            );

            updatePlayButton(false);
            updateActiveTrack();
        }
    }

    /* =====================================================
       MUSIC BUTTONS
    ===================================================== */

    musicButtons.forEach(button => {

        button.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                const url =
                    button.getAttribute("data-audio");

                if (!url) {

                    console.warn(
                        "This song has no data-audio:",
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

                            updatePlayButton(true);

                        } catch (error) {

                            console.error(
                                "Playback error:",
                                error
                            );
                        }

                    } else {

                        audio.pause();
                    }

                    updateActiveTrack();

                    return;
                }

                /* New song */

                playSong(button);
            }
        );
    });

    /* =====================================================
       MAIN PLAY / PAUSE
    ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                if (!currentAudio) {

                    const firstSong =
                        musicButtons.find(
                            button =>
                                button.hasAttribute(
                                    "data-audio"
                                )
                        );

                    if (firstSong) {
                        playSong(firstSong);
                    }

                    return;
                }

                if (!audio.paused) {

                    audio.pause();

                    return;
                }

                try {

                    await audio.play();

                } catch (error) {

                    console.error(
                        "Playback error:",
                        error
                    );
                }
            }
        );
    }

    /* =====================================================
       PREVIOUS SONG
    ===================================================== */

    function playPrevious() {

        if (!musicButtons.length) return;

        const playableButtons =
            musicButtons.filter(
                button =>
                    button.hasAttribute("data-audio")
            );

        if (!playableButtons.length) return;

        let index =
            playableButtons.indexOf(currentButton);

        if (index <= 0) {
            index =
                playableButtons.length - 1;
        } else {
            index--;
        }

        playSong(
            playableButtons[index]
        );
    }

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                playPrevious();
            }
        );
    }

    /* =====================================================
       NEXT SONG
    ===================================================== */

    function playNext() {

        const playableButtons =
            musicButtons.filter(
                button =>
                    button.hasAttribute("data-audio")
            );

        if (!playableButtons.length) return;

        let index =
            playableButtons.indexOf(currentButton);

        if (isShuffle) {

            if (playableButtons.length === 1) {
                playSong(playableButtons[0]);
                return;
            }

            let randomIndex;

            do {

                randomIndex =
                    Math.floor(
                        Math.random() *
                        playableButtons.length
                    );

            } while (
                randomIndex === index
            );

            index = randomIndex;

        } else {

            index++;

            if (
                index >=
                playableButtons.length
            ) {
                index = 0;
            }
        }

        playSong(
            playableButtons[index]
        );
    }

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                playNext();
            }
        );
    }

    /* =====================================================
       SHUFFLE
    ===================================================== */

    if (shuffleButton) {

        shuffleButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                isShuffle =
                    !isShuffle;

                shuffleButton.classList.toggle(
                    "active",
                    isShuffle
                );

                shuffleButton.setAttribute(
                    "aria-label",
                    isShuffle
                        ? "Shuffle on"
                        : "Shuffle off"
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
            event => {

                event.preventDefault();

                isRepeat =
                    !isRepeat;

                repeatButton.classList.toggle(
                    "active",
                    isRepeat
                );

                repeatButton.setAttribute(
                    "aria-label",
                    isRepeat
                        ? "Repeat on"
                        : "Repeat off"
                );
            }
        );
    }

    /* =====================================================
       VOLUME
    ===================================================== */

    if (volumeSlider) {

        volumeSlider.addEventListener(
            "input",
            () => {

                audio.volume =
                    parseFloat(
                        volumeSlider.value
                    );

                const icon =
                    volumeSlider
                        .parentElement
                        ?.querySelector("i");

                if (icon) {

                    icon.classList.remove(
                        "fa-volume-high",
                        "fa-volume-low",
                        "fa-volume-off"
                    );

                    if (
                        audio.volume === 0
                    ) {

                        icon.classList.add(
                            "fa-volume-off"
                        );

                    } else if (
                        audio.volume < 0.5
                    ) {

                        icon.classList.add(
                            "fa-volume-low"
                        );

                    } else {

                        icon.classList.add(
                            "fa-volume-high"
                        );
                    }
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

            updatePlayButton(true);

            updateActiveTrack();

            if (musicPlayer) {
                musicPlayer.classList.add("active");
            }

            if (playerCover) {
                playerCover.classList.add(
                    "playing"
                );
            }
        }
    );

    /* =====================================================
       AUDIO PAUSE
    ===================================================== */

    audio.addEventListener(
        "pause",
        () => {

            updatePlayButton(false);

            updateActiveTrack();

            if (playerCover) {
                playerCover.classList.remove(
                    "playing"
                );
            }
        }
    );

    /* =====================================================
       AUDIO TIME UPDATE
    ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            updateTime();

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
       LOADED METADATA
    ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            updateTime();

            console.log(
                "MBZEDMUSIC SONG LOADED:",
                formatTime(audio.duration)
            );
        }
    );

    /* =====================================================
       AUDIO ERROR
    ===================================================== */

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
                "URL:",
                audio.src
            );

            console.error(
                "Audio error:",
                audio.error
            );

            console.error(
                "================================"
            );

            updatePlayButton(false);
            updateActiveTrack();
        }
    );

    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            updatePlayButton(false);

            updateActiveTrack();

            if (progressBar) {
                progressBar.style.width =
                    "0%";
            }

            updateTime();

            /* Repeat current song */

            if (isRepeat) {

                audio.currentTime = 0;

                audio.play()
                    .catch(error =>
                        console.error(
                            "Repeat playback error:",
                            error
                        )
                    );

                return;
            }

            /* Otherwise play next */

            playNext();
        }
    );

    /* =====================================================
       PROGRESS BAR SEEK
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
                    playerProgress
                        .getBoundingClientRect();

                const position =
                    event.clientX -
                    rect.left;

                let percentage =
                    position /
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
       KEYBOARD SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            /* Don't interfere with inputs */

            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            /* Space */

            if (
                event.code === "Space" &&
                currentAudio
            ) {

                event.preventDefault();

                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            }

            /* Previous */

            if (
                event.code === "ArrowLeft" &&
                event.ctrlKey
            ) {

                playPrevious();
            }

            /* Next */

            if (
                event.code === "ArrowRight" &&
                event.ctrlKey
            ) {

                playNext();
            }

            /* Volume up */

            if (
                event.code === "ArrowUp" &&
                event.ctrlKey
            ) {

                audio.volume =
                    Math.min(
                        1,
                        audio.volume + 0.1
                    );

                if (volumeSlider) {
                    volumeSlider.value =
                        audio.volume;
                }
            }

            /* Volume down */

            if (
                event.code === "ArrowDown" &&
                event.ctrlKey
            ) {

                audio.volume =
                    Math.max(
                        0,
                        audio.volume - 0.1
                    );

                if (volumeSlider) {
                    volumeSlider.value =
                        audio.volume;
                }
            }
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

                    item.style.display =
                        !query ||
                        text.includes(query)
                            ? ""
                            : "none";
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

    /* =====================================================
       CLOSE MOBILE MENU AFTER LINK
    ===================================================== */

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

                        const icon =
                            mobileMenu?.querySelector(
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

                const emailInput =
                    newsletterForm.querySelector(
                        "input[type='email']"
                    );

                if (!emailInput) return;

                if (!emailInput.value.trim()) {
                    return;
                }

                alert(
                    "Thank you for subscribing to Mbzedmusic!"
                );

                newsletterForm.reset();
            }
        );
    }

    /* =====================================================
       INITIAL PLAYER STATE
    ===================================================== */

    updatePlayButton(false);
    updateTime();
    updateActiveTrack();

    console.log(
        "================================="
    );

    console.log(
        "MBZEDMUSIC FULL PLAYER READY"
    );

    console.log(
        "Songs with data-audio:",
        musicButtons.length
    );

    console.log(
        "Shuffle:",
        isShuffle
    );

    console.log(
        "Repeat:",
        isRepeat
    );

    console.log(
        "================================="
    );

});
```

/* =========================================
   MBZEDMUSIC.COM
   MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ELEMENTS
       ===================================== */

    const navigation = document.getElementById("navigation");
    const mobileMenu = document.getElementById("mobileMenu");

    const searchButton = document.getElementById("searchButton");
    const searchBox = document.getElementById("searchBox");
    const searchInput = document.getElementById("searchInput");
    const closeSearch = document.getElementById("closeSearch");
    const searchResults = document.getElementById("searchResults");

    const audioPlayer = document.getElementById("audioPlayer");

    const musicPlayer = document.getElementById("musicPlayer");
    const mainPlayerButton = document.getElementById("mainPlayerButton");

    const playerTitle = document.getElementById("playerTitle");
    const playerArtist = document.getElementById("playerArtist");
    const playerCover = document.getElementById("playerCover");

    const progressBar = document.getElementById("progressBar");
    const currentTime = document.getElementById("currentTime");
    const duration = document.getElementById("duration");

    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");

    const closePlayer = document.getElementById("closePlayer");

    const featuredPlay = document.getElementById("featuredPlay");

    const newsletterForm =
        document.getElementById("newsletterForm");


    /* =====================================
       MOBILE MENU
       ===================================== */

    if (mobileMenu && navigation) {

        mobileMenu.addEventListener("click", function () {

            navigation.classList.toggle("open");

            const icon = mobileMenu.querySelector("i");

            if (navigation.classList.contains("open")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    }


    /* Close mobile menu after navigation */

    document.querySelectorAll(".navigation a").forEach(function (link) {

        link.addEventListener("click", function () {

            if (navigation) {
                navigation.classList.remove("open");
            }

            if (mobileMenu) {
                const icon = mobileMenu.querySelector("i");

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

        });

    });


    /* =====================================
       SEARCH
       ===================================== */

    if (searchButton && searchBox) {

        searchButton.addEventListener("click", function () {

            searchBox.classList.toggle("open");

            if (searchBox.classList.contains("open") && searchInput) {
                setTimeout(function () {
                    searchInput.focus();
                }, 100);
            }

        });

    }


    if (closeSearch) {

        closeSearch.addEventListener("click", function () {

            searchBox.classList.remove("open");

            if (searchInput) {
                searchInput.value = "";
            }

            if (searchResults) {
                searchResults.innerHTML = "";
            }

        });

    }


    /* =====================================
       SONG DATA
       ===================================== */

    const mbLevelsSong = {
        title: "MB Levels",
        artist: "Mr. Kings ft. Bravo Uja Lapa, Shax Morefire & Trykash",
        audio: "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3",
        cover: "mb-levels-cover.png"
    };


    const songs = [

        mbLevelsSong,

        {
            title: "Champion",
            artist: "Yo Maps",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Kuli Wanga",
            artist: "Jae Cash",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Number One",
            artist: "Macky 2",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Never Give Up",
            artist: "Kav Jr",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Better Days",
            artist: "Blood Kid",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "My Time",
            artist: "T-Sean",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Tuli Bwino",
            artist: "Chile One Zambia",
            audio: "",
            cover: "mb-levels-cover.png"
        },

        {
            title: "Ndi Ine",
            artist: "Slapdee",
            audio: "",
            cover: "mb-levels-cover.png"
        }

    ];


    let currentSongIndex = 0;


    /* =====================================
       FORMAT TIME
       ===================================== */

    function formatTime(seconds) {

        if (!isFinite(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return minutes + ":" + remainingSeconds;

    }


    /* =====================================
       UPDATE BUTTONS
       ===================================== */

    function updatePlayButtons() {

        document.querySelectorAll(".play-button, .card-play").forEach(function (button) {

            button.classList.remove("playing");

            button.innerHTML =
                '<i class="fa-solid fa-play"></i>';

        });


        if (featuredPlay) {

            featuredPlay.innerHTML =
                '<i class="fa-solid fa-play"></i>';

        }


        if (
            audioPlayer &&
            !audioPlayer.paused
        ) {

            document
                .querySelectorAll(
                    '[data-title="MB Levels"] .play-button, [data-title="MB Levels"] .card-play'
                )
                .forEach(function (button) {

                    button.classList.add("playing");

                    button.innerHTML =
                        '<i class="fa-solid fa-pause"></i>';

                });


            if (featuredPlay) {

                featuredPlay.innerHTML =
                    '<i class="fa-solid fa-pause"></i>';

            }

        }

    }


    /* =====================================
       LOAD SONG
       ===================================== */

    function loadSong(song, autoplay = false) {

        if (!song) {
            return;
        }


        currentSongIndex =
            songs.findIndex(function (item) {

                return item.title === song.title;

            });


        if (currentSongIndex < 0) {
            currentSongIndex = 0;
        }


        if (playerTitle) {
            playerTitle.textContent = song.title;
        }

        if (playerArtist) {
            playerArtist.textContent = song.artist;
        }

        if (playerCover) {

            playerCover.style.backgroundImage =
                "url('" + song.cover + "')";

        }


        /*
         * Only attempt audio playback when
         * an actual MP3 path exists.
         */

        if (song.audio) {

            audioPlayer.src = song.audio;

            audioPlayer.load();

            if (autoplay) {

                const playPromise =
                    audioPlayer.play();

                if (playPromise !== undefined) {

                    playPromise.catch(function (error) {

                        console.log(
                            "Playback waiting for user interaction.",
                            error
                        );

                    });

                }

            }

        }


        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }


        updatePlayButtons();

    }


    /* =====================================
       PLAY SONG
       ===================================== */

    function playSong(song) {

        if (!song) {
            return;
        }


        /*
         * If another song is selected,
         * load it first.
         */

        if (
            audioPlayer.src !==
            new URL(song.audio, window.location.href).href
        ) {

            loadSong(song, true);

            return;

        }


        if (audioPlayer.paused) {

            audioPlayer.play().catch(function (error) {

                console.log("Audio playback error:", error);

            });

        } else {

            audioPlayer.pause();

        }

    }


    /* =====================================
       TRACK BUTTONS
       ===================================== */

    document.querySelectorAll(".track").forEach(function (track) {

        track.addEventListener("click", function (event) {

            const button =
                track.querySelector(".play-button");

            /*
             * Only play when the button itself
             * or track area is clicked.
             */

            if (
                event.target.closest(".play-button") ||
                track.dataset.audio
            ) {

                const audio =
                    track.dataset.audio;

                if (!audio) {

                    /*
                     * These are demo tracks for now.
                     * Only MB Levels has a real MP3.
                     */

                    loadSong({
                        title: track.dataset.title || "Music",
                        artist: track.dataset.artist || "Mbzedmusic",
                        audio: "",
                        cover: track.dataset.cover || "mb-levels-cover.png"
                    });

                    return;

                }


                playSong({

                    title: track.dataset.title,

                    artist: track.dataset.artist,

                    audio: audio,

                    cover:
                        track.dataset.cover ||
                        "mb-levels-cover.png"

                });

            }

        });

    });


    /* =====================================
       RELEASE CARD BUTTONS
       ===================================== */

    document.querySelectorAll(".release-card").forEach(function (card) {

        const button =
            card.querySelector(".card-play");

        if (!button) {
            return;
        }


        button.addEventListener("click", function (event) {

            event.stopPropagation();


            const audio =
                card.dataset.audio;


            if (!audio) {

                return;

            }


            playSong({

                title:
                    card.dataset.title || "Music",

                artist:
                    card.dataset.artist || "Mbzedmusic",

                audio: audio,

                cover:
                    card.dataset.cover ||
                    "mb-levels-cover.png"

            });

        });

    });


    /* =====================================
       CHART BUTTONS
       ===================================== */

    document.querySelectorAll(".chart-item").forEach(function (item) {

        const button =
            item.querySelector(".play-button");

        if (!button) {
            return;
        }


        button.addEventListener("click", function (event) {

            event.stopPropagation();


            const audio =
                item.dataset.audio;


            if (!audio) {
                return;
            }


            playSong({

                title:
                    item.dataset.title || "Music",

                artist:
                    item.dataset.artist || "Mbzedmusic",

                audio: audio,

                cover:
                    item.dataset.cover ||
                    "mb-levels-cover.png"

            });

        });

    });


    /* =====================================
       FEATURED MB LEVELS BUTTON
       ===================================== */

    if (featuredPlay) {

        featuredPlay.addEventListener("click", function () {

            playSong(mbLevelsSong);

        });

    }


    /* =====================================
       MAIN PLAY / PAUSE
       ===================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener("click", function () {

            if (!audioPlayer.src) {

                loadSong(mbLevelsSong, true);

                return;

            }


            if (audioPlayer.paused) {

                audioPlayer.play().catch(function (error) {

                    console.log(
                        "Could not play audio:",
                        error
                    );

                });

            } else {

                audioPlayer.pause();

            }

        });

    }


    /* =====================================
       AUDIO PLAY
       ===================================== */

    audioPlayer.addEventListener("play", function () {

        if (mainPlayerButton) {

            mainPlayerButton.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

        }


        updatePlayButtons();

    });


    /* =====================================
       AUDIO PAUSE
       ===================================== */

    audioPlayer.addEventListener("pause", function () {

        if (mainPlayerButton) {

            mainPlayerButton.innerHTML =
                '<i class="fa-solid fa-play"></i>';

        }


        updatePlayButtons();

    });


    /* =====================================
       AUDIO TIME
       ===================================== */

    audioPlayer.addEventListener("timeupdate", function () {

        if (!audioPlayer.duration) {
            return;
        }


        const percent =
            (audioPlayer.currentTime /
            audioPlayer.duration) * 100;


        if (progressBar) {
            progressBar.value = percent;
        }


        if (currentTime) {
            currentTime.textContent =
                formatTime(audioPlayer.currentTime);
        }


        if (duration) {
            duration.textContent =
                formatTime(audioPlayer.duration);
        }

    });


    /* =====================================
       AUDIO LOADED
       ===================================== */

    audioPlayer.addEventListener("loadedmetadata", function () {

        if (duration) {

            duration.textContent =
                formatTime(audioPlayer.duration);

        }

    });


    /* =====================================
       PROGRESS BAR
       ===================================== */

    if (progressBar) {

        progressBar.addEventListener("input", function () {

            if (!audioPlayer.duration) {
                return;
            }


            audioPlayer.currentTime =
                (progressBar.value / 100) *
                audioPlayer.duration;

        });

    }


    /* =====================================
       PREVIOUS
       ===================================== */

    if (previousButton) {

        previousButton.addEventListener("click", function () {

            currentSongIndex--;

            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1;
            }


            const song =
                songs[currentSongIndex];


            if (song.audio) {

                loadSong(song, true);

            }

        });

    }


    /* =====================================
       NEXT
       ===================================== */

    if (nextButton) {

        nextButton.addEventListener("click", function () {

            currentSongIndex++;

            if (currentSongIndex >= songs.length) {
                currentSongIndex = 0;
            }


            const song =
                songs[currentSongIndex];


            if (song.audio) {

                loadSong(song, true);

            }

        });

    }


    /* =====================================
       WHEN SONG ENDS
       ===================================== */

    audioPlayer.addEventListener("ended", function () {

        currentSongIndex++;

        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }


        /*
         * Only automatically play songs
         * that have actual audio files.
         */

        let nextSong =
            songs[currentSongIndex];


        while (
            nextSong &&
            !nextSong.audio &&
            currentSongIndex < songs.length - 1
        ) {

            currentSongIndex++;

            nextSong =
                songs[currentSongIndex];

        }


        if (nextSong && nextSong.audio) {

            loadSong(nextSong, true);

        } else {

            audioPlayer.currentTime = 0;

        }

    });


    /* =====================================
       CLOSE PLAYER
       ===================================== */

    if (closePlayer) {

        closePlayer.addEventListener("click", function () {

            audioPlayer.pause();

            if (musicPlayer) {
                musicPlayer.style.display = "none";
            }

        });

    }


    /* =====================================
       SEARCH DATA
       ===================================== */

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchResults) {
                return;
            }


            if (!query) {

                searchResults.innerHTML = "";

                return;

            }


            const matches =
                songs.filter(function (song) {

                    return (
                        song.title.toLowerCase().includes(query) ||
                        song.artist.toLowerCase().includes(query)
                    );

                });


            if (!matches.length) {

                searchResults.innerHTML =
                    '<div class="search-result">No music found.</div>';

                return;

            }


            searchResults.innerHTML =
                matches.map(function (song, index) {

                    return `
                        <div
                            class="search-result"
                            data-search-index="${index}"
                        >
                            <strong>${song.title}</strong>
                            <br>
                            <small>${song.artist}</small>
                        </div>
                    `;

                }).join("");


            document
                .querySelectorAll(".search-result[data-search-index]")
                .forEach(function (result) {

                    result.addEventListener("click", function () {

                        const index =
                            Number(
                                result.dataset.searchIndex
                            );


                        const song =
                            matches[index];


                        if (song.audio) {

                            playSong(song);

                        }


                        searchBox.classList.remove("open");

                        searchInput.value = "";

                        searchResults.innerHTML = "";

                    });

                });

        });

    }


    /* =====================================
       NEWSLETTER
       ===================================== */

    if (newsletterForm) {

        newsletterForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const input =
                newsletterForm.querySelector("input");


            if (!input.value) {
                return;
            }


            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );


            input.value = "";

        });

    }


    /* =====================================
       INITIAL PLAYER
       ===================================== */

    loadSong(mbLevelsSong, false);

});

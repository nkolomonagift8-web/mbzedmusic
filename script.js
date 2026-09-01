/* =========================================================
   MBZEDMUSIC.COM
   NEXT-LEVEL MUSIC PLAYER + SUPABASE + SEARCH + MENU
   ========================================================= */

/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


/* =========================================================
   GLOBALS
   ========================================================= */

let mbzedSupabase = null;

let musicTracks = [];

let currentTrack = -1;

let isPlaying = false;

let playerInitialized = false;

const audio = new Audio();

audio.preload = "metadata";

audio.volume = 1;


/* =========================================================
   START WEBSITE
   ========================================================= */

function startMbzedMusic() {

    console.log("MBZEDMUSIC: Starting...");

    setupMusicPlayer();
    setupSearch();
    setupMobileMenu();
    setupNewsletter();
    setupBackToTop();
    setupUploadButtons();

    if (mbzedSupabase) {

        loadSongsFromSupabase();

    } else {

        console.warn(
            "MBZEDMUSIC: Supabase unavailable."
        );
    }
}


/* =========================================================
   SUPABASE LIBRARY
   ========================================================= */

function loadSupabase() {

    if (window.supabase) {

        connectSupabase();

        return;
    }

    const script =
        document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = function () {

        console.log(
            "MBZEDMUSIC: Supabase library loaded."
        );

        connectSupabase();
    };

    script.onerror = function () {

        console.error(
            "MBZEDMUSIC: Supabase library failed."
        );

        startMbzedMusic();
    };

    document.head.appendChild(script);
}


/* =========================================================
   CONNECT SUPABASE
   ========================================================= */

function connectSupabase() {

    try {

        mbzedSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

        console.log(
            "MBZEDMUSIC: Supabase connected."
        );

        startMbzedMusic();

    } catch (error) {

        console.error(
            "MBZEDMUSIC: Supabase connection error:",
            error
        );

        startMbzedMusic();
    }
}


/* =========================================================
   MUSIC PLAYER
   ========================================================= */

function setupMusicPlayer() {

    if (playerInitialized) {
        return;
    }

    playerInitialized = true;


    const player =
        document.getElementById(
            "musicPlayer"
        );


    const mainButton =
        document.getElementById(
            "mainPlayerButton"
        );


    const titleElement =
        document.getElementById(
            "playerTitle"
        );


    const artistElement =
        document.getElementById(
            "playerArtist"
        );


    const coverElement =
        document.querySelector(
            ".player-cover"
        );


    const progressContainer =
        document.querySelector(
            ".player-progress"
        );


    const progressBar =
        progressContainer
            ? progressContainer.querySelector("div")
            : null;


    /*
     * Time elements.
     *
     * We support several possible IDs so
     * your current HTML does not need to change.
     */

    const currentTimeElement =
        document.getElementById(
            "playerCurrentTime"
        ) ||
        document.getElementById(
            "currentTime"
        );


    const durationElement =
        document.getElementById(
            "playerDuration"
        ) ||
        document.getElementById(
            "duration"
        );


    /*
     * Previous / next buttons.
     */

    const previousButton =
        document.getElementById(
            "previousPlayerButton"
        ) ||
        document.getElementById(
            "prevPlayerButton"
        ) ||
        document.querySelector(
            "[data-player-action='previous']"
        );


    const nextButton =
        document.getElementById(
            "nextPlayerButton"
        ) ||
        document.querySelector(
            "[data-player-action='next']"
        );


    /*
     * Volume controls.
     */

    const volumeControl =
        document.getElementById(
            "playerVolume"
        ) ||
        document.getElementById(
            "volumeControl"
        ) ||
        document.querySelector(
            ".player-volume input[type='range']"
        );


    const muteButton =
        document.getElementById(
            "mutePlayerButton"
        ) ||
        document.getElementById(
            "playerMuteButton"
        ) ||
        document.querySelector(
            "[data-player-action='mute']"
        );


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(seconds) {

        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {

            return "0:00";
        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remainingSeconds =
            Math.floor(
                seconds % 60
            );


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2, "0")
        );
    }


    /* =====================================================
       UPDATE TIME
       ===================================================== */

    function updateTimeDisplay() {

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


    /* =====================================================
       UPDATE PLAY BUTTON
       ===================================================== */

    function updatePlayButton() {

        if (!mainButton) {
            return;
        }


        const icon =
            mainButton.querySelector("i");


        if (!icon) {
            return;
        }


        if (isPlaying) {

            icon.classList.remove(
                "fa-play"
            );

            icon.classList.add(
                "fa-pause"
            );

            mainButton.setAttribute(
                "aria-label",
                "Pause music"
            );

            mainButton.setAttribute(
                "title",
                "Pause"
            );

        } else {

            icon.classList.remove(
                "fa-pause"
            );

            icon.classList.add(
                "fa-play"
            );

            mainButton.setAttribute(
                "aria-label",
                "Play music"
            );

            mainButton.setAttribute(
                "title",
                "Play"
            );
        }
    }


    /* =====================================================
       UPDATE MUTE BUTTON
       ===================================================== */

    function updateMuteButton() {

        if (!muteButton) {
            return;
        }


        const icon =
            muteButton.querySelector("i");


        if (!icon) {
            return;
        }


        if (
            audio.muted ||
            audio.volume === 0
        ) {

            icon.classList.remove(
                "fa-volume-high"
            );

            icon.classList.remove(
                "fa-volume-low"
            );

            icon.classList.add(
                "fa-volume-xmark"
            );

        } else if (
            audio.volume < 0.5
        ) {

            icon.classList.remove(
                "fa-volume-high"
            );

            icon.classList.remove(
                "fa-volume-xmark"
            );

            icon.classList.add(
                "fa-volume-low"
            );

        } else {

            icon.classList.remove(
                "fa-volume-low"
            );

            icon.classList.remove(
                "fa-volume-xmark"
            );

            icon.classList.add(
                "fa-volume-high"
            );
        }
    }


    /* =====================================================
       LOAD TRACK
       ===================================================== */

    window.loadMbzedTrack =
        function(index) {

            if (
                !musicTracks.length ||
                !musicTracks[index]
            ) {

                console.warn(
                    "MBZEDMUSIC: Track does not exist."
                );

                return false;
            }


            const track =
                musicTracks[index];


            currentTrack =
                index;


            audio.pause();


            isPlaying = false;


            updatePlayButton();


            audio.src =
                track.audio;


            if (titleElement) {

                titleElement.textContent =
                    track.title ||
                    "Unknown Song";
            }


            if (artistElement) {

                artistElement.textContent =
                    track.artist ||
                    "Unknown Artist";
            }


            if (
                coverElement &&
                track.cover
            ) {

                coverElement.style.backgroundImage =
                    `url("${track.cover}")`;

                coverElement.style.backgroundSize =
                    "cover";

                coverElement.style.backgroundPosition =
                    "center";
            }


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


            audio.load();


            if (player) {

                player.classList.add(
                    "active"
                );
            }


            updateNowPlaying();


            return true;
        };


    /* =====================================================
       PLAY
       ===================================================== */

    window.playMbzedMusic =
        async function() {

            if (!musicTracks.length) {

                console.warn(
                    "MBZEDMUSIC: No music available."
                );

                return;
            }


            if (
                currentTrack < 0 ||
                !musicTracks[currentTrack]
            ) {

                currentTrack = 0;

                window.loadMbzedTrack(
                    currentTrack
                );
            }


            try {

                await audio.play();

                isPlaying = true;

                updatePlayButton();


                if (player) {

                    player.classList.add(
                        "active"
                    );
                }

            } catch (error) {

                console.error(
                    "MBZEDMUSIC: Playback failed:",
                    error
                );

                isPlaying = false;

                updatePlayButton();
            }
        };


    /* =====================================================
       PAUSE
       ===================================================== */

    window.pauseMbzedMusic =
        function() {

            audio.pause();

            isPlaying = false;

            updatePlayButton();
        };


    /* =====================================================
       TOGGLE
       ===================================================== */

    window.toggleMbzedMusic =
        function() {

            if (isPlaying) {

                window.pauseMbzedMusic();

            } else {

                window.playMbzedMusic();
            }
        };


    /* =====================================================
       NEXT TRACK
       ===================================================== */

    window.nextMbzedTrack =
        function() {

            if (!musicTracks.length) {
                return;
            }


            currentTrack++;


            if (
                currentTrack >=
                musicTracks.length
            ) {

                currentTrack = 0;
            }


            window.loadMbzedTrack(
                currentTrack
            );


            window.playMbzedMusic();
        };


    /* =====================================================
       PREVIOUS TRACK
       ===================================================== */

    window.previousMbzedTrack =
        function() {

            if (!musicTracks.length) {
                return;
            }


            currentTrack--;


            if (currentTrack < 0) {

                currentTrack =
                    musicTracks.length - 1;
            }


            window.loadMbzedTrack(
                currentTrack
            );


            window.playMbzedMusic();
        };


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    if (mainButton) {

        mainButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                window.toggleMbzedMusic();
            }
        );
    }


    /* =====================================================
       PREVIOUS BUTTON
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                window.previousMbzedTrack();
            }
        );
    }


    /* =====================================================
       NEXT BUTTON
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                window.nextMbzedTrack();
            }
        );
    }


    /* =====================================================
       PROGRESS
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        function() {

            if (
                !audio.duration ||
                !progressBar
            ) {

                updateTimeDisplay();

                return;
            }


            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            progressBar.style.width =
                Math.min(
                    100,
                    Math.max(
                        0,
                        percentage
                    )
                ) + "%";


            updateTimeDisplay();
        }
    );


    /* =====================================================
       METADATA LOADED
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        function() {

            updateTimeDisplay();
        }
    );


    /* =====================================================
       PROGRESS CLICK
       ===================================================== */

    if (progressContainer) {

        progressContainer.addEventListener(
            "click",
            function(event) {

                if (!audio.duration) {
                    return;
                }


                const rect =
                    progressContainer
                        .getBoundingClientRect();


                const position =
                    event.clientX -
                    rect.left;


                const percentage =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            position /
                            rect.width
                        )
                    );


                audio.currentTime =
                    percentage *
                    audio.duration;
            }
        );
    }


    /* =====================================================
       PROGRESS KEYBOARD CONTROL
       ===================================================== */

    if (progressContainer) {

        progressContainer.setAttribute(
            "tabindex",
            "0"
        );


        progressContainer.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key !== "ArrowLeft" &&
                    event.key !== "ArrowRight"
                ) {

                    return;
                }


                event.preventDefault();


                const jump =
                    5;


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    audio.currentTime =
                        Math.min(
                            audio.duration || 0,
                            audio.currentTime +
                            jump
                        );

                } else {

                    audio.currentTime =
                        Math.max(
                            0,
                            audio.currentTime -
                            jump
                        );
                }
            }
        );
    }


    /* =====================================================
       VOLUME CONTROL
       ===================================================== */

    if (volumeControl) {

        volumeControl.min =
            "0";

        volumeControl.max =
            "1";

        volumeControl.step =
            "0.01";


        if (
            !volumeControl.value ||
            Number(
                volumeControl.value
            ) > 1
        ) {

            volumeControl.value =
                audio.volume;
        }


        volumeControl.addEventListener(
            "input",
            function() {

                const value =
                    Number(
                        volumeControl.value
                    );


                audio.volume =
                    Math.min(
                        1,
                        Math.max(
                            0,
                            value
                        )
                    );


                if (
                    audio.volume >
                    0
                ) {

                    audio.muted =
                        false;
                }


                updateMuteButton();
            }
        );
    }


    /* =====================================================
       MUTE
       ===================================================== */

    if (muteButton) {

        muteButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                audio.muted =
                    !audio.muted;


                updateMuteButton();
            }
        );
    }


    /* =====================================================
       AUDIO PLAY EVENT
       ===================================================== */

    audio.addEventListener(
        "play",
        function() {

            isPlaying = true;

            updatePlayButton();
        }
    );


    /* =====================================================
       AUDIO PAUSE EVENT
       ===================================================== */

    audio.addEventListener(
        "pause",
        function() {

            isPlaying = false;

            updatePlayButton();
        }
    );


    /* =====================================================
       SONG ENDED
       ===================================================== */

    audio.addEventListener(
        "ended",
        function() {

            isPlaying = false;

            updatePlayButton();


            if (progressBar) {

                progressBar.style.width =
                    "0%";
            }


            if (currentTimeElement) {

                currentTimeElement.textContent =
                    "0:00";
            }


            /*
             * Automatically play next song.
             */

            if (musicTracks.length > 1) {

                window.nextMbzedTrack();
            }
        }
    );


    /* =====================================================
       AUDIO ERROR
       ===================================================== */

    audio.addEventListener(
        "error",
        function() {

            console.error(
                "MBZEDMUSIC: Audio error:",
                audio.error
            );


            isPlaying = false;

            updatePlayButton();
        }
    );


    /* =====================================================
       UPDATE NOW PLAYING
       ===================================================== */

    function updateNowPlaying() {

        const track =
            musicTracks[currentTrack];


        if (!track) {
            return;
        }


        document
            .querySelectorAll(
                ".now-playing-title"
            )
            .forEach(
                element => {

                    element.textContent =
                        track.title ||
                        "Unknown Song";
                }
            );


        document
            .querySelectorAll(
                ".now-playing-artist"
            )
            .forEach(
                element => {

                    element.textContent =
                        track.artist ||
                        "Unknown Artist";
                }
            );
    }


    /* =====================================================
       PUBLIC PLAYER FUNCTIONS
       ===================================================== */

    window.updateMbzedPlayButton =
        updatePlayButton;


    window.updateMbzedMuteButton =
        updateMuteButton;


    /*
     * Attach buttons already on the page.
     */

    attachPlayButtons();


    console.log(
        "MBZEDMUSIC: Music player ready."
    );
}


/* =========================================================
   ATTACH SONG PLAY BUTTONS
   ========================================================= */

function attachPlayButtons() {

    const buttons =
        document.querySelectorAll(
            ".play-button, .card-play"
        );


    buttons.forEach(
        function(button) {

            if (
                button.dataset.mbzedReady ===
                "true"
            ) {

                return;
            }


            button.dataset.mbzedReady =
                "true";


            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const title =
                        button.dataset.title ||
                        "Unknown Song";


                    const artist =
                        button.dataset.artist ||
                        "Unknown Artist";


                    const audioUrl =
                        button.dataset.audio;


                    const cover =
                        button.dataset.cover ||
                        "mb-levels-cover.jpg.jpeg";


                    if (!audioUrl) {

                        console.warn(
                            "MBZEDMUSIC: No audio URL."
                        );

                        return;
                    }


                    let index =
                        musicTracks.findIndex(
                            function(track) {

                                return (
                                    track.audio ===
                                    audioUrl
                                );
                            }
                        );


                    if (index === -1) {

                        musicTracks.push({

                            title:
                                title,

                            artist:
                                artist,

                            audio:
                                audioUrl,

                            cover:
                                cover
                        });


                        index =
                            musicTracks.length - 1;
                    }


                    window.loadMbzedTrack(
                        index
                    );


                    window.playMbzedMusic();
                }
            );
        }
    );
}


/* =========================================================
   LOAD SONGS FROM SUPABASE
   ========================================================= */

async function loadSongsFromSupabase() {

    if (!mbzedSupabase) {
        return;
    }


    console.log(
        "MBZEDMUSIC: Loading songs..."
    );


    try {

        const {
            data,
            error
        } =
            await mbzedSupabase
                .from("songs")
                .select(
                    "id,user_id,title,artist_name,genre,release_year,description,audio_url,cover_url,created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "MBZEDMUSIC: Supabase error:",
                error
            );

            showNoSongsMessage();

            return;
        }


        if (
            !data ||
            !data.length
        ) {

            console.log(
                "MBZEDMUSIC: No songs found."
            );

            showNoSongsMessage();

            return;
        }


        musicTracks =
            data
                .filter(
                    song =>
                        song.audio_url
                )
                .map(
                    song => ({

                        id:
                            song.id,

                        title:
                            song.title ||
                            "Untitled",

                        artist:
                            song.artist_name ||
                            "Unknown Artist",

                        genre:
                            song.genre ||
                            "",

                        cover:
                            song.cover_url ||
                            "mb-levels-cover.jpg.jpeg",

                        audio:
                            song.audio_url,

                        description:
                            song.description ||
                            "",

                        releaseYear:
                            song.release_year ||
                            "",

                        createdAt:
                            song.created_at ||
                            ""
                    })
                );


        console.log(
            "MBZEDMUSIC: Loaded",
            musicTracks.length,
            "tracks."
        );


        if (!musicTracks.length) {

            showNoSongsMessage();

            return;
        }


        renderTrendingSongs(data);

        renderNewReleases(data);

        renderChartSongs(data);


        currentTrack = 0;


        if (
            typeof window.loadMbzedTrack ===
            "function"
        ) {

            window.loadMbzedTrack(
                currentTrack
            );
        }

    } catch (error) {

        console.error(
            "MBZEDMUSIC: Loading error:",
            error
        );

        showNoSongsMessage();
    }
}


/* =========================================================
   TRENDING
   ========================================================= */

function renderTrendingSongs(songs) {

    const container =
        document.querySelector(
            ".music-panel:first-child .track-list"
        );


    if (!container) {
        return;
    }


    const tracks =
        songs
            .filter(
                song =>
                    song.audio_url
            )
            .slice(
                0,
                10
            );


    if (!tracks.length) {
        return;
    }


    container.innerHTML =
        tracks
            .map(
                (song, index) =>
                    createSongHTML(
                        song,
                        index + 1
                    )
            )
            .join("");


    attachPlayButtons();
}


/* =========================================================
   SONG HTML
   ========================================================= */

function createSongHTML(
    song,
    number
) {

    const title =
        escapeHtml(
            song.title ||
            "Untitled"
        );


    const artist =
        escapeHtml(
            song.artist_name ||
            "Unknown Artist"
        );


    const genre =
        escapeHtml(
            song.genre ||
            ""
        );


    const cover =
        song.cover_url ||
        "mb-levels-cover.jpg.jpeg";


    const audioUrl =
        song.audio_url ||
        "";


    return `

        <div class="track">

            <span class="track-number">
                ${number}
            </span>

            <div
                class="track-image"
                style="background-image:url('${escapeAttribute(cover)}');"
            ></div>

            <div class="track-info">

                <h3>
                    ${title}
                </h3>

                <p>
                    ${artist}
                    ${genre ? " • " + genre : ""}
                </p>

            </div>

            <button
                class="play-button"
                type="button"

                data-title="${escapeAttribute(
                    song.title ||
                    "Untitled"
                )}"

                data-artist="${escapeAttribute(
                    song.artist_name ||
                    "Unknown Artist"
                )}"

                data-audio="${escapeAttribute(
                    audioUrl
                )}"

                data-cover="${escapeAttribute(
                    cover
                )}"
            >

                <i class="fa-solid fa-play"></i>

            </button>

        </div>

    `;
}


/* =========================================================
   NEW RELEASES
   ========================================================= */

function renderNewReleases(songs) {

    const container =
        document.querySelector(
            ".release-grid"
        );


    if (!container) {
        return;
    }


    const releases =
        songs
            .filter(
                song =>
                    song.audio_url
            )
            .slice(
                0,
                8
            );


    if (!releases.length) {
        return;
    }


    container.innerHTML =
        releases
            .map(
                song => {

                    const title =
                        escapeHtml(
                            song.title ||
                            "Untitled"
                        );


                    const artist =
                        escapeHtml(
                            song.artist_name ||
                            "Unknown Artist"
                        );


                    const cover =
                        song.cover_url ||
                        "mb-levels-cover.jpg.jpeg";


                    return `

                        <div class="release-card">

                            <div
                                class="release-image"

                                style="
                                    background-image:url(
                                        '${escapeAttribute(cover)}'
                                    );
                                "
                            >

                                <span class="new-label">
                                    NEW
                                </span>

                                <button
                                    class="card-play"
                                    type="button"

                                    data-title="${escapeAttribute(
                                        song.title ||
                                        "Untitled"
                                    )}"

                                    data-artist="${escapeAttribute(
                                        song.artist_name ||
                                        "Unknown Artist"
                                    )}"

                                    data-audio="${escapeAttribute(
                                        song.audio_url ||
                                        ""
                                    )}"

                                    data-cover="${escapeAttribute(
                                        cover
                                    )}"
                                >

                                    <i class="fa-solid fa-play"></i>

                                </button>

                            </div>

                            <h3>
                                ${title}
                            </h3>

                            <p>
                                ${artist}
                            </p>

                        </div>

                    `;
                }
            )
            .join("");


    attachPlayButtons();
}


/* =========================================================
   CHART
   ========================================================= */

function renderChartSongs(songs) {

    const container =
        document.querySelector(
            ".chart-list"
        );


    if (!container) {
        return;
    }


    const chartSongs =
        songs
            .filter(
                song =>
                    song.audio_url
            )
            .slice(
                0,
                10
            );


    if (!chartSongs.length) {
        return;
    }


    container.innerHTML =
        chartSongs
            .map(
                (song, index) => {

                    const title =
                        escapeHtml(
                            song.title ||
                            "Untitled"
                        );


                    const artist =
                        escapeHtml(
                            song.artist_name ||
                            "Unknown Artist"
                        );


                    const cover =
                        song.cover_url ||
                        "mb-levels-cover.jpg.jpeg";


                    return `

                        <div class="chart-item">

                            <span>
                                ${index + 1}
                            </span>

                            <div
                                class="mini-cover"

                                style="
                                    background-image:url(
                                        '${escapeAttribute(cover)}'
                                    );
                                "
                            ></div>

                            <div>

                                <h3>
                                    ${title}
                                </h3>

                                <p>
                                    ${artist}
                                </p>

                            </div>

                            <button
                                class="play-button"
                                type="button"

                                data-title="${escapeAttribute(
                                    song.title ||
                                    "Untitled"
                                )}"

                                data-artist="${escapeAttribute(
                                    song.artist_name ||
                                    "Unknown Artist"
                                )}"

                                data-audio="${escapeAttribute(
                                    song.audio_url ||
                                    ""
                                )}"

                                data-cover="${escapeAttribute(
                                    cover
                                )}"
                            >

                                <i class="fa-solid fa-play"></i>

                            </button>

                        </div>

                    `;
                }
            )
            .join("");


    attachPlayButtons();
}


/* =========================================================
   NO SONGS
   ========================================================= */

function showNoSongsMessage() {

    const trackList =
        document.querySelector(
            ".track-list"
        );


    if (trackList) {

        trackList.innerHTML = `

            <div class="empty-music-message">

                <i class="fa-solid fa-music"></i>

                <h3>
                    No music uploaded yet
                </h3>

                <p>
                    Be the first artist to upload music.
                </p>

            </div>

        `;
    }


    const releaseGrid =
        document.querySelector(
            ".release-grid"
        );


    if (releaseGrid) {

        releaseGrid.innerHTML = `

            <div class="empty-music-message">

                <i class="fa-solid fa-cloud-arrow-up"></i>

                <h3>
                    No new releases yet
                </h3>

                <p>
                    Upload your music to appear here.
                </p>

            </div>

        `;
    }


    const chartList =
        document.querySelector(
            ".chart-list"
        );


    if (chartList) {

        chartList.innerHTML = `

            <div class="empty-music-message">

                <i class="fa-solid fa-chart-line"></i>

                <h3>
                    Chart is waiting for music
                </h3>

                <p>
                    Upload songs to start the chart.
                </p>

            </div>

        `;
    }
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const button =
        document.getElementById(
            "searchButton"
        );


    const box =
        document.getElementById(
            "searchBox"
        );


    const close =
        document.getElementById(
            "closeSearch"
        );


    const input =
        document.getElementById(
            "searchInput"
        );


    if (button && box) {

        button.addEventListener(
            "click",
            function() {

                box.classList.add(
                    "active"
                );


                if (input) {

                    setTimeout(
                        () =>
                            input.focus(),
                        100
                    );
                }
            }
        );
    }


    if (close && box) {

        close.addEventListener(
            "click",
            function() {

                box.classList.remove(
                    "active"
                );


                if (input) {

                    input.value =
                        "";
                }
            }
        );
    }


    if (input) {

        input.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;
                }


                const query =
                    input.value
                        .trim()
                        .toLowerCase();


                if (!query) {
                    return;
                }


                const result =
                    musicTracks.find(
                        track => {

                            return (

                                (
                                    track.title ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )

                                ||

                                (
                                    track.artist ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )

                                ||

                                (
                                    track.genre ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(
                                        query
                                    )
                            );
                        }
                    );


                if (!result) {

                    alert(
                        "No music found for: " +
                        input.value
                    );

                    return;
                }


                const index =
                    musicTracks.indexOf(
                        result
                    );


                window.loadMbzedTrack(
                    index
                );


                window.playMbzedMusic();
            }
        );
    }
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    const navigation =
        document.getElementById(
            "navigation"
        );


    if (
        !menu ||
        !navigation
    ) {

        return;
    }


    menu.addEventListener(
        "click",
        function() {

            navigation.classList.toggle(
                "active"
            );


            const icon =
                menu.querySelector(
                    "i"
                );


            if (!icon) {
                return;
            }


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


    navigation
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function() {

                        navigation.classList.remove(
                            "active"
                        );
                    }
                );
            }
        );
}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {

    const form =
        document.getElementById(
            "newsletterForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const input =
                form.querySelector(
                    "input[type='email']"
                );


            if (!input) {
                return;
            }


            const email =
                input.value.trim();


            if (!email) {
                return;
            }


            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );


            input.value =
                "";
        }
    );
}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

    const link =
        document.querySelector(
            ".footer-bottom a"
        );


    if (!link) {
        return;
    }


    link.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });
        }
    );
}


/* =========================================================
   UPLOAD BUTTONS
   ========================================================= */

function setupUploadButtons() {

    const buttons =
        document.querySelectorAll(
            ".upload-button, .primary-button, .secondary-button, .artist-upload"
        );


    buttons.forEach(
        button => {

            const href =
                button.getAttribute(
                    "href"
                );


            if (
                href === "#" ||
                !href
            ) {

                button.addEventListener(
                    "click",
                    function(event) {

                        const text =
                            button.textContent
                                .toLowerCase();


                        if (
                            text.includes(
                                "upload"
                            )
                        ) {

                            event.preventDefault();


                            window.location.href =
                                "upload.html";
                        }
                    }
                );
            }
        }
    );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   ESCAPE ATTRIBUTE
   ========================================================= */

function escapeAttribute(value) {

    return escapeHtml(
        value || ""
    );
}


/* =========================================================
   START WEBSITE
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        loadSupabase
    );

} else {

    loadSupabase();
}


/* =========================================================
   READY
   ========================================================= */

console.log(
    "MBZEDMUSIC.COM JavaScript loaded successfully."
);

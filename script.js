/* =========================================================
   MBZEDMUSIC.COM
   COMPLETE MUSIC PLATFORM SCRIPT
   MUSIC PLAYER + SUPABASE + SEARCH + MOBILE MENU
   SAFE REPLACEMENT
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let mbzedSupabase = null;

let musicTracks = [];

let currentTrack = -1;

let isPlaying = false;

let playerReady = false;

let supabaseLoading = false;

let supabaseLoaded = false;


/* =========================================================
   AUDIO ENGINE
   ========================================================= */

const audio = new Audio();

audio.preload = "metadata";

audio.crossOrigin = "anonymous";


/* =========================================================
   DEFAULT MB LEVELS TRACK
   ========================================================= */

const DEFAULT_TRACK = {

    id:
        "mb-levels-local",

    title:
        "MB LEVELS",

    artist:
        "Mr. Kings",

    genre:
        "African Music",

    cover:
        "mb-levels-cover.jpg.jpeg",

    audio:
        "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3",

    description:
        "MB LEVELS",

    releaseYear:
        "2026"

};


/* =========================================================
   START WEBSITE
   ========================================================= */

function startMbzedMusic() {

    console.log(
        "MBZEDMUSIC: Starting website..."
    );


    setupMusicPlayer();

    setupSearch();

    setupMobileMenu();

    setupNewsletter();

    setupBackToTop();

    setupUploadButtons();

    setupNavigationLinks();


    /*
     * Always keep MB LEVELS available.
     */

    ensureDefaultTrack();


    /*
     * If Supabase is connected,
     * load online music.
     */

    if (mbzedSupabase) {

        loadSongsFromSupabase();

    } else {

        console.warn(
            "MBZEDMUSIC: Supabase unavailable. Using local music."
        );

        renderLocalMusic();

    }

}


/* =========================================================
   ENSURE DEFAULT TRACK
   ========================================================= */

function ensureDefaultTrack() {

    const exists =
        musicTracks.some(
            track =>
                track.audio ===
                DEFAULT_TRACK.audio
        );


    if (!exists) {

        musicTracks.unshift(
            DEFAULT_TRACK
        );

    }


    if (
        currentTrack < 0 ||
        !musicTracks[currentTrack]
    ) {

        currentTrack = 0;

    }

}


/* =========================================================
   LOAD SUPABASE LIBRARY
   ========================================================= */

function loadSupabase() {

    /*
     * Prevent duplicate loading.
     */

    if (supabaseLoading) {

        return;

    }


    /*
     * Already available.
     */

    if (
        window.supabase &&
        typeof window.supabase.createClient ===
            "function"
    ) {

        connectSupabase();

        return;

    }


    supabaseLoading = true;


    const script =
        document.createElement(
            "script"
        );


    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


    script.async = true;


    script.onload =
        function() {

            console.log(
                "MBZEDMUSIC: Supabase library loaded."
            );


            supabaseLoading = false;

            connectSupabase();

        };


    script.onerror =
        function() {

            console.error(
                "MBZEDMUSIC: Supabase library failed to load."
            );


            supabaseLoading = false;

            mbzedSupabase = null;

            startMbzedMusic();

        };


    document.head.appendChild(
        script
    );

}


/* =========================================================
   CONNECT SUPABASE
   ========================================================= */

function connectSupabase() {

    if (supabaseLoaded) {

        return;

    }


    try {

        mbzedSupabase =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        supabaseLoaded = true;


        console.log(
            "MBZEDMUSIC: Supabase connected successfully."
        );


        startMbzedMusic();


    } catch (error) {

        console.error(
            "MBZEDMUSIC: Supabase connection error:",
            error
        );


        mbzedSupabase = null;

        supabaseLoaded = false;


        startMbzedMusic();

    }

}


/* =========================================================
   MUSIC PLAYER
   ========================================================= */

function setupMusicPlayer() {

    if (playerReady) {

        return;

    }


    playerReady = true;


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


            isPlaying =
                false;


            updatePlayButton();


            /*
             * Set audio.
             */

            audio.src =
                track.audio;


            /*
             * Update title.
             */

            if (titleElement) {

                titleElement.textContent =
                    track.title ||
                    "Unknown Song";

            }


            /*
             * Update artist.
             */

            if (artistElement) {

                artistElement.textContent =
                    track.artist ||
                    "Unknown Artist";

            }


            /*
             * Update cover.
             */

            if (
                coverElement &&
                track.cover
            ) {

                coverElement.style.backgroundImage =
                    `url("${escapeCssUrl(track.cover)}")`;

            }


            /*
             * Reset progress.
             */

            if (progressBar) {

                progressBar.style.width =
                    "0%";

            }


            /*
             * Load audio.
             */

            audio.load();


            /*
             * Show player.
             */

            if (player) {

                player.classList.add(
                    "active"
                );

            }


            console.log(
                "MBZEDMUSIC: Loaded:",
                track.title,
                "|",
                track.artist
            );


            return true;

        };


    /* =====================================================
       PLAY
    ===================================================== */

    window.playMbzedMusic =
        async function() {

            ensureDefaultTrack();


            if (
                currentTrack < 0 ||
                !musicTracks[currentTrack]
            ) {

                currentTrack = 0;

            }


            if (
                !audio.src ||
                audio.src ===
                    window.location.href
            ) {

                const loaded =
                    window.loadMbzedTrack(
                        currentTrack
                    );


                if (!loaded) {

                    return;

                }

            }


            try {

                await audio.play();


                isPlaying =
                    true;


                updatePlayButton();


                if (player) {

                    player.classList.add(
                        "active"
                    );

                }


                console.log(
                    "MBZEDMUSIC: Playing:",
                    musicTracks[currentTrack]?.title
                );


            } catch (error) {

                console.error(
                    "MBZEDMUSIC: Playback failed:",
                    error
                );


                isPlaying =
                    false;


                updatePlayButton();

            }

        };


    /* =====================================================
       PAUSE
    ===================================================== */

    window.pauseMbzedMusic =
        function() {

            audio.pause();

            isPlaying =
                false;

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
       NEXT
    ===================================================== */

    window.nextMbzedTrack =
        function() {

            ensureDefaultTrack();


            if (!musicTracks.length) {

                return;

            }


            currentTrack++;


            if (
                currentTrack >=
                musicTracks.length
            ) {

                currentTrack =
                    0;

            }


            window.loadMbzedTrack(
                currentTrack
            );


            window.playMbzedMusic();

        };


    /* =====================================================
       PREVIOUS
    ===================================================== */

    window.previousMbzedTrack =
        function() {

            ensureDefaultTrack();


            if (!musicTracks.length) {

                return;

            }


            currentTrack--;


            if (
                currentTrack < 0
            ) {

                currentTrack =
                    musicTracks.length - 1;

            }


            window.loadMbzedTrack(
                currentTrack
            );


            window.playMbzedMusic();

        };


    /* =====================================================
       MAIN PLAYER BUTTON
    ===================================================== */

    if (mainButton) {

        mainButton.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                window.toggleMbzedMusic();

            }
        );

    }


    /* =====================================================
       TIME UPDATE
    ===================================================== */

    audio.addEventListener(
        "timeupdate",
        function() {

            if (
                !audio.duration ||
                !progressBar
            ) {

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
                    progressContainer.getBoundingClientRect();


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
       AUDIO READY
    ===================================================== */

    audio.addEventListener(
        "canplay",
        function() {

            console.log(
                "MBZEDMUSIC: Audio ready."
            );

        }
    );


    /* =====================================================
       AUDIO METADATA
    ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        function() {

            console.log(
                "MBZEDMUSIC: Duration:",
                formatTime(audio.duration)
            );

        }
    );


    /* =====================================================
       SONG ENDED
    ===================================================== */

    audio.addEventListener(
        "ended",
        function() {

            isPlaying =
                false;


            updatePlayButton();


            if (progressBar) {

                progressBar.style.width =
                    "0%";

            }


            /*
             * Automatically play next song
             * when more than one track exists.
             */

            if (
                musicTracks.length > 1
            ) {

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


            isPlaying =
                false;


            updatePlayButton();

        }
    );


    /* =====================================================
       UPDATE PLAYER BUTTON
    ===================================================== */

    function updatePlayButton() {

        if (!mainButton) {

            return;

        }


        const icon =
            mainButton.querySelector(
                "i"
            );


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

        }

    }


    window.updateMbzedPlayButton =
        updatePlayButton;


    attachPlayButtons();

}


/* =========================================================
   ATTACH PLAY BUTTONS
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
                            "MBZEDMUSIC: This song does not have an audio file yet."
                        );


                        return;

                    }


                    /*
                     * Find existing track.
                     */

                    let index =
                        musicTracks.findIndex(
                            function(track) {

                                return (
                                    track.audio ===
                                    audioUrl
                                );

                            }
                        );


                    /*
                     * Add if missing.
                     */

                    if (index === -1) {

                        musicTracks.push({

                            id:
                                "local-" +
                                Date.now(),

                            title:
                                title,

                            artist:
                                artist,

                            genre:
                                "",

                            cover:
                                cover,

                            audio:
                                audioUrl

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
   LOCAL MUSIC
   ========================================================= */

function renderLocalMusic() {

    ensureDefaultTrack();

    attachPlayButtons();


    /*
     * Do not replace existing HTML.
     */

    console.log(
        "MBZEDMUSIC: Local music ready."
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
        "MBZEDMUSIC: Loading songs from Supabase..."
    );


    try {

        const response =
            await mbzedSupabase
                .from("songs")
                .select(
                    "id,user_id,title,artist_name,genre,release_year,description,audio_url,cover_url,created_at"
                )
                .not(
                    "audio_url",
                    "is",
                    null
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        const data =
            response.data || [];


        const error =
            response.error;


        if (error) {

            console.error(
                "MBZEDMUSIC: Supabase songs error:",
                error
            );


            ensureDefaultTrack();

            attachPlayButtons();

            return;

        }


        /*
         * Always start with MB LEVELS.
         */

        const remoteTracks =
            data
                .filter(
                    song =>
                        song.audio_url
                )
                .map(
                    function(song) {

                        return {

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

                        };

                    }
                );


        /*
         * Combine local + remote.
         */

        const combined =
            [
                DEFAULT_TRACK,
                ...remoteTracks
            ];


        /*
         * Remove duplicate audio URLs.
         */

        const uniqueTracks =
            [];


        const seen =
            new Set();


        combined.forEach(
            function(track) {

                if (
                    !track.audio ||
                    seen.has(
                        track.audio
                    )
                ) {

                    return;

                }


                seen.add(
                    track.audio
                );


                uniqueTracks.push(
                    track
                );

            }
        );


        musicTracks =
            uniqueTracks;


        console.log(
            "MBZEDMUSIC: Playable tracks:",
            musicTracks.length
        );


        /*
         * Render homepage.
         */

        renderTrendingSongs(
            data
        );


        renderNewReleases(
            data
        );


        renderChartSongs(
            data
        );


        /*
         * Reattach buttons.
         */

        attachPlayButtons();


        /*
         * Keep MB LEVELS selected.
         * Do not autoplay.
         */

        currentTrack =
            0;


        if (
            musicTracks[currentTrack]
        ) {

            window.loadMbzedTrack(
                currentTrack
            );

        }


    } catch (error) {

        console.error(
            "MBZEDMUSIC: Supabase exception:",
            error
        );


        musicTracks =
            [
                DEFAULT_TRACK
            ];


        currentTrack =
            0;


        attachPlayButtons();


        if (
            window.loadMbzedTrack
        ) {

            window.loadMbzedTrack(
                0
            );

        }

    }

}


/* =========================================================
   TRENDING SONGS
   ========================================================= */

function renderTrendingSongs(songs) {

    const container =
        document.querySelector(
            ".music-panel:first-child .track-list"
        );


    if (!container) {

        return;

    }


    const remoteTracks =
        songs
            .filter(
                song =>
                    song.audio_url
            )
            .slice(
                0,
                9
            );


    /*
     * If there are no online songs,
     * keep existing HTML.
     */

    if (!remoteTracks.length) {

        attachPlayButtons();

        return;

    }


    /*
     * Put MB LEVELS first.
     */

    const tracks =
        [
            DEFAULT_TRACK,
            ...remoteTracks
        ].slice(
            0,
            10
        );


    container.innerHTML =
        tracks
            .map(
                function(track, index) {

                    /*
                     * Local MB LEVELS.
                     */

                    if (
                        track.id ===
                        DEFAULT_TRACK.id
                    ) {

                        return createLocalTrackHTML(
                            track,
                            index + 1
                        );

                    }


                    return createSongHTML(
                        track,
                        index + 1
                    );

                }
            )
            .join("");


    attachPlayButtons();

}


/* =========================================================
   LOCAL TRACK HTML
   ========================================================= */

function createLocalTrackHTML(
    track,
    number
) {

    return `

        <div class="track">

            <span class="track-number">
                ${number}
            </span>


            <div
                class="track-image"
                style="
                    background-image:url('${escapeAttribute(track.cover)}');
                "
            ></div>


            <div class="track-info">

                <h3>
                    ${escapeHtml(track.title)}
                </h3>


                <p>
                    ${escapeHtml(track.artist)}
                </p>

            </div>


            <button
                class="play-button"
                type="button"

                data-title="${escapeAttribute(track.title)}"

                data-artist="${escapeAttribute(track.artist)}"

                data-audio="${escapeAttribute(track.audio)}"

                data-cover="${escapeAttribute(track.cover)}"

                aria-label="Play ${escapeAttribute(track.title)}"
            >

                <i class="fa-solid fa-play"></i>

            </button>

        </div>

    `;

}


/* =========================================================
   CREATE SONG HTML
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
            song.artist ||
            "Unknown Artist"
        );


    const genre =
        escapeHtml(
            song.genre ||
            ""
        );


    const cover =
        song.cover_url ||
        song.cover ||
        "mb-levels-cover.jpg.jpeg";


    const audioUrl =
        song.audio_url ||
        song.audio ||
        "";


    return `

        <div class="track">

            <span class="track-number">
                ${number}
            </span>


            <div
                class="track-image"
                style="
                    background-image:url('${escapeAttribute(cover)}');
                "
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
                    song.artist ||
                    "Unknown Artist"
                )}"

                data-audio="${escapeAttribute(
                    audioUrl
                )}"

                data-cover="${escapeAttribute(
                    cover
                )}"

                aria-label="Play ${escapeAttribute(
                    song.title ||
                    "song"
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


    /*
     * If database is empty,
     * preserve current HTML.
     */

    if (!releases.length) {

        attachPlayButtons();

        return;

    }


    /*
     * Put MB LEVELS first.
     */

    const allReleases =
        [
            {
                id:
                    DEFAULT_TRACK.id,

                title:
                    DEFAULT_TRACK.title,

                artist_name:
                    DEFAULT_TRACK.artist,

                audio_url:
                    DEFAULT_TRACK.audio,

                cover_url:
                    DEFAULT_TRACK.cover

            },

            ...releases
        ]
            .slice(
                0,
                8
            );


    container.innerHTML =
        allReleases
            .map(
                function(song) {

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


                    const audioUrl =
                        song.audio_url ||
                        "";


                    return `

                        <div class="release-card">

                            <div
                                class="release-image"
                                style="
                                    background-image:url('${escapeAttribute(cover)}');
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
                                        audioUrl
                                    )}"

                                    data-cover="${escapeAttribute(
                                        cover
                                    )}"

                                    aria-label="Play ${escapeAttribute(
                                        song.title ||
                                        "song"
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
                9
            );


    /*
     * If database has no songs,
     * keep existing chart.
     */

    if (!chartSongs.length) {

        attachPlayButtons();

        return;

    }


    const allCharts =
        [
            {
                id:
                    DEFAULT_TRACK.id,

                title:
                    DEFAULT_TRACK.title,

                artist_name:
                    DEFAULT_TRACK.artist,

                audio_url:
                    DEFAULT_TRACK.audio,

                cover_url:
                    DEFAULT_TRACK.cover

            },

            ...chartSongs
        ]
            .slice(
                0,
                10
            );


    container.innerHTML =
        allCharts
            .map(
                function(song, index) {

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


                    const audioUrl =
                        song.audio_url ||
                        "";


                    return `

                        <div class="chart-item">

                            <span>
                                ${index + 1}
                            </span>


                            <div
                                class="mini-cover"
                                style="
                                    background-image:url('${escapeAttribute(cover)}');
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
                                    audioUrl
                                )}"

                                data-cover="${escapeAttribute(
                                    cover
                                )}"

                                aria-label="Play ${escapeAttribute(
                                    song.title ||
                                    "song"
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


    if (
        button &&
        box
    ) {

        button.addEventListener(
            "click",
            function() {

                box.classList.add(
                    "active"
                );


                if (input) {

                    setTimeout(
                        function() {

                            input.focus();

                        },
                        100
                    );

                }

            }
        );

    }


    if (
        close &&
        box
    ) {

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
                        function(track) {

                            const title =
                                (
                                    track.title ||
                                    ""
                                )
                                    .toLowerCase();


                            const artist =
                                (
                                    track.artist ||
                                    ""
                                )
                                    .toLowerCase();


                            const genre =
                                (
                                    track.genre ||
                                    ""
                                )
                                    .toLowerCase();


                            return (
                                title.includes(query) ||
                                artist.includes(query) ||
                                genre.includes(query)
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


                box.classList.remove(
                    "active"
                );

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
            function(link) {

                link.addEventListener(
                    "click",
                    function() {

                        navigation.classList.remove(
                            "active"
                        );


                        const icon =
                            menu.querySelector(
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

            }
        );

}


/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

function setupNavigationLinks() {

    const links =
        document.querySelectorAll(
            ".navigation a"
        );


    links.forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    links.forEach(
                        function(item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
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

                top:
                    0,

                behavior:
                    "smooth"

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
        function(button) {

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
   ESCAPE CSS URL
   ========================================================= */

function escapeCssUrl(value) {

    return String(
        value || ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /"/g,
            '\\"'
        );

}


/* =========================================================
   FORMAT TIME
   ========================================================= */

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
        ).padStart(
            2,
            "0"
        )
    );

}


/* =========================================================
   GLOBAL DEBUG ACCESS
   ========================================================= */

window.mbzedMusic =
    {

        getTracks:
            function() {

                return musicTracks;

            },

        getCurrentTrack:
            function() {

                return (
                    musicTracks[currentTrack] ||
                    null
                );

            },

        getAudio:
            function() {

                return audio;

            },

        play:
            function() {

                return window.playMbzedMusic();

            },

        pause:
            function() {

                return window.pauseMbzedMusic();

            },

        next:
            function() {

                return window.nextMbzedTrack();

            },

        previous:
            function() {

                return window.previousMbzedTrack();

            }

    };


/* =========================================================
   START
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
   FINAL LOG
   ========================================================= */

console.log(
    "MBZEDMUSIC.COM — Music platform script loaded successfully."
);

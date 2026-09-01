/* =========================================================
   MBZEDMUSIC.COM
   MUSIC PLAYER + SUPABASE + SEARCH + MOBILE MENU
   SAFE REPLACEMENT VERSION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
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

let playerReady = false;

const audio = new Audio();

audio.preload = "metadata";


/* =========================================================
   DEFAULT LOCAL TRACK
   IMPORTANT:
   This file exists in your GitHub repository.
   ========================================================= */

const DEFAULT_TRACK = {

    id: "mb-levels-local",

    title: "MB LEVELS",

    artist: "Mr. Kings",

    genre: "African Music",

    cover: "mb-levels-cover.jpg.jpeg",

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


    /*
     * Always keep the local MB LEVELS song available.
     */

    ensureDefaultTrack();


    /*
     * If Supabase is connected,
     * load additional songs.
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


    /*
     * Make sure the first track is selected.
     */

    if (currentTrack < 0) {

        currentTrack = 0;

    }
}


/* =========================================================
   SUPABASE LIBRARY
   ========================================================= */

function loadSupabase() {

    /*
     * Prevent duplicate loading.
     */

    if (
        window.supabase &&
        typeof window.supabase.createClient ===
            "function"
    ) {

        connectSupabase();

        return;
    }


    const script =
        document.createElement("script");


    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


    script.async = true;


    script.onload =
        function() {

            console.log(
                "MBZEDMUSIC: Supabase library loaded."
            );

            connectSupabase();

        };


    script.onerror =
        function() {

            console.error(
                "MBZEDMUSIC: Supabase library failed to load."
            );

            /*
             * Do NOT break the website.
             */

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


        mbzedSupabase = null;


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


            /*
             * Stop current song.
             */

            audio.pause();


            isPlaying = false;


            updatePlayButton();


            /*
             * Set audio source.
             */

            audio.src =
                track.audio;


            /*
             * Update player information.
             */

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


            /*
             * Update cover.
             */

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
                track.audio
            );


            return true;

        };


    /* =====================================================
       PLAY
       ===================================================== */

    window.playMbzedMusic =
        async function() {

            if (!musicTracks.length) {

                ensureDefaultTrack();

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


            /*
             * If audio source is missing,
             * load the selected track again.
             */

            if (!audio.src) {

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


                console.log(
                    "MBZEDMUSIC: Playing:",
                    musicTracks[currentTrack]?.title
                );


            } catch (error) {

                console.error(
                    "MBZEDMUSIC: Playback failed:",
                    error
                );


                isPlaying = false;


                updatePlayButton();


                /*
                 * Give a useful message in console.
                 */

                if (
                    audio.error
                ) {

                    console.error(
                        "Audio error code:",
                        audio.error.code
                    );

                }

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
       MAIN PLAY BUTTON
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
       PROGRESS UPDATE
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
                    progressContainer
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
       AUDIO CAN PLAY
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
       AUDIO LOADED
       ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        function() {

            console.log(
                "MBZEDMUSIC: Audio duration:",
                audio.duration
            );

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


            /*
             * Automatically play next song.
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


            isPlaying = false;


            updatePlayButton();

        }
    );


    /* =====================================================
       UPDATE PLAY BUTTON
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


    /*
     * Attach existing buttons.
     */

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


                    /*
                     * If this is one of the placeholder
                     * buttons without an audio URL,
                     * do not break the player.
                     */

                    if (!audioUrl) {

                        console.warn(
                            "MBZEDMUSIC: This button has no audio file yet."
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
                     * Add track if not already loaded.
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
   RENDER LOCAL MUSIC
   ========================================================= */

function renderLocalMusic() {

    ensureDefaultTrack();

    renderStaticLocalTrack();

}


/* =========================================================
   RENDER STATIC LOCAL TRACK
   ========================================================= */

function renderStaticLocalTrack() {

    /*
     * We deliberately do NOT replace the whole page.
     * Your existing design stays intact.
     */

    const trending =
        document.querySelector(
            ".music-panel:first-child .track-list"
        );


    if (
        trending &&
        !trending.querySelector(
            "[data-audio]"
        )
    ) {

        /*
         * Nothing needed.
         * Existing HTML already contains MB LEVELS.
         */

    }


    attachPlayButtons();

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
                        ascending: false
                    }
                );


        const data =
            response.data;


        const error =
            response.error;


        if (error) {

            console.error(
                "MBZEDMUSIC: Supabase songs error:",
                error
            );


            /*
             * Do NOT remove local music.
             */

            ensureDefaultTrack();

            attachPlayButtons();

            return;

        }


        /*
         * Start with local MB LEVELS.
         */

        const localTrack =
            DEFAULT_TRACK;


        /*
         * Convert Supabase songs.
         */

        const remoteTracks =
            (data || [])
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


        /*
         * Prevent duplicate audio URLs.
         */

        const combined =
            [
                localTrack,
                ...remoteTracks
            ];


        const unique =
            [];


        const seen =
            new Set();


        combined.forEach(
            track => {

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


                unique.push(
                    track
                );

            }
        );


        musicTracks =
            unique;


        console.log(
            "MBZEDMUSIC: Total playable tracks:",
            musicTracks.length
        );


        /*
         * Re-render dynamic sections.
         */

        renderTrendingSongs(
            data || []
        );


        renderNewReleases(
            data || []
        );


        renderChartSongs(
            data || []
        );


        /*
         * Reattach all buttons after
         * dynamic HTML changes.
         */

        attachPlayButtons();


        /*
         * Load first song but DON'T autoplay.
         */

        currentTrack = 0;


        if (
            musicTracks[currentTrack]
        ) {

            window.loadMbzedTrack(
                currentTrack
            );

        }


    } catch (error) {

        console.error(
            "MBZEDMUSIC: Supabase loading exception:",
            error
        );


        /*
         * Fall back safely.
         */

        musicTracks = [
            DEFAULT_TRACK
        ];


        currentTrack = 0;


        window.loadMbzedTrack(
            currentTrack
        );


        attachPlayButtons();

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
                10
            );


    /*
     * If Supabase has no tracks,
     * keep the existing HTML.
     */

    if (!remoteTracks.length) {

        attachPlayButtons();

        return;

    }


    const tracks =
        remoteTracks;


    container.innerHTML =
        tracks
            .map(
                function(song, index) {

                    return createSongHTML(
                        song,
                        index + 1
                    );

                }
            )
            .join("");


    /*
     * Ensure local MB LEVELS remains playable
     * through the main player.
     */

    attachPlayButtons();

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
     * Keep existing cards if database
     * has no songs.
     */

    if (!releases.length) {

        attachPlayButtons();

        return;

    }


    container.innerHTML =
        releases
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
   CHART SONGS
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


    /*
     * Keep existing chart if no remote songs.
     */

    if (!chartSongs.length) {

        attachPlayButtons();

        return;

    }


    container.innerHTML =
        chartSongs
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

                    input.value = "";

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


                if (box) {

                    box.classList.remove(
                        "active"
                    );

                }

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


            input.value = "";

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
    "MBZEDMUSIC.COM player script loaded successfully."
);

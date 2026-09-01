/* =========================================================
   MBZEDMUSIC.COM
   MAIN JAVASCRIPT
   MUSIC PLAYER + SUPABASE + SEARCH + MOBILE MENU
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

let playerReady = false;

const audio = new Audio();

audio.preload = "metadata";


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("MBZEDMUSIC: Website starting...");

    setupMusicPlayer();
    setupSearch();
    setupMobileMenu();
    setupNewsletter();
    setupBackToTop();
    setupUploadButtons();

    loadSupabase();

});


/* =========================================================
   LOAD SUPABASE
   ========================================================= */

function loadSupabase() {

    if (window.supabase) {

        connectSupabase();

        return;

    }

    const script = document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = () => {

        console.log(
            "MBZEDMUSIC: Supabase library loaded."
        );

        connectSupabase();

    };

    script.onerror = () => {

        console.error(
            "MBZEDMUSIC: Supabase library failed to load."
        );

        loadLocalHomepageSong();

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

        loadSongsFromSupabase();

    } catch (error) {

        console.error(
            "MBZEDMUSIC: Supabase connection failed.",
            error
        );

        loadLocalHomepageSong();

    }

}


/* =========================================================
   LOCAL FALLBACK
   ========================================================= */

function loadLocalHomepageSong() {

    const localSong = {

        id: "local-mb-levels",

        title: "MB LEVELS",

        artist:
            "Mr. Kings ft. Bravo Uja Lapa, Shax Morefire & Trykash Wayayo",

        genre: "",

        cover:
            "mb-levels-cover.jpg.jpeg",

        audio:
            "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3"

    };

    musicTracks = [localSong];

    currentTrack = 0;

    attachPlayButtons();

    console.log(
        "MBZEDMUSIC: Local song fallback loaded."
    );

}


/* =========================================================
   MUSIC PLAYER
   ========================================================= */

function setupMusicPlayer() {

    const player =
        document.getElementById("musicPlayer");

    const mainButton =
        document.getElementById("mainPlayerButton");

    const title =
        document.getElementById("playerTitle");

    const artist =
        document.getElementById("playerArtist");

    const cover =
        document.querySelector(".player-cover");

    const progressContainer =
        document.querySelector(".player-progress");

    const progressBar =
        progressContainer
            ? progressContainer.querySelector("div")
            : null;


    /* -----------------------------------------------------
       LOAD TRACK
       ----------------------------------------------------- */

    window.loadMbzedTrack = function(index) {

        if (
            !musicTracks ||
            !musicTracks[index]
        ) {

            console.warn(
                "MBZEDMUSIC: Track does not exist."
            );

            return false;

        }

        const track =
            musicTracks[index];

        currentTrack = index;

        isPlaying = false;

        audio.pause();

        audio.currentTime = 0;

        audio.src = "";

        /* -------------------------------------------------
           PLAYER INFORMATION
           ------------------------------------------------- */

        if (title) {

            title.textContent =
                track.title ||
                "Unknown Song";

        }

        if (artist) {

            artist.textContent =
                track.artist ||
                "Unknown Artist";

        }

        if (
            cover &&
            track.cover
        ) {

            cover.style.backgroundImage =
                `url("${track.cover}")`;

            cover.style.backgroundSize =
                "cover";

            cover.style.backgroundPosition =
                "center";

        }

        if (progressBar) {

            progressBar.style.width =
                "0%";

        }

        /* -------------------------------------------------
           AUDIO
           ------------------------------------------------- */

        if (!track.audio) {

            console.error(
                "MBZEDMUSIC: Track has no audio URL."
            );

            return false;

        }

        audio.src = track.audio;

        audio.load();

        playerReady = true;

        updatePlayButton();

        console.log(
            "MBZEDMUSIC: Loaded:",
            track.title,
            track.audio
        );

        return true;

    };


    /* -----------------------------------------------------
       PLAY
       ----------------------------------------------------- */

    window.playMbzedMusic = async function() {

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

        }

        const track =
            musicTracks[currentTrack];

        /* Make sure correct song is loaded */

        if (
            !audio.src ||
            !audio.src.includes(
                encodeURI(track.audio).split("?")[0]
            )
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

            isPlaying = true;

            updatePlayButton();

            if (player) {

                player.classList.add(
                    "active"
                );

            }

            console.log(
                "MBZEDMUSIC: Playing:",
                track.title
            );

        } catch (error) {

            console.error(
                "MBZEDMUSIC: Playback failed:",
                error
            );

            /*
             * Some browsers reject playback if the source
             * cannot be loaded. Show useful information.
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


    /* -----------------------------------------------------
       PAUSE
       ----------------------------------------------------- */

    window.pauseMbzedMusic = function() {

        audio.pause();

        isPlaying = false;

        updatePlayButton();

    };


    /* -----------------------------------------------------
       TOGGLE
       ----------------------------------------------------- */

    function toggleMusic() {

        if (
            audio.paused
        ) {

            window.playMbzedMusic();

        } else {

            window.pauseMbzedMusic();

        }

    }


    /* -----------------------------------------------------
       MAIN PLAYER BUTTON
       ----------------------------------------------------- */

    if (mainButton) {

        mainButton.addEventListener(
            "click",
            toggleMusic
        );

    }


    /* -----------------------------------------------------
       AUDIO PLAY
       ----------------------------------------------------- */

    audio.addEventListener(
        "play",
        () => {

            isPlaying = true;

            updatePlayButton();

            if (player) {

                player.classList.add(
                    "active"
                );

            }

        }
    );


    /* -----------------------------------------------------
       AUDIO PAUSE
       ----------------------------------------------------- */

    audio.addEventListener(
        "pause",
        () => {

            isPlaying = false;

            updatePlayButton();

        }
    );


    /* -----------------------------------------------------
       AUDIO TIME UPDATE
       ----------------------------------------------------- */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !progressBar ||
                !audio.duration ||
                isNaN(audio.duration)
            ) {

                return;

            }

            const percent =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;

            progressBar.style.width =
                `${Math.min(100, Math.max(0, percent))}%`;

        }
    );


    /* -----------------------------------------------------
       AUDIO ENDED
       ----------------------------------------------------- */

    audio.addEventListener(
        "ended",
        () => {

            isPlaying = false;

            updatePlayButton();

            if (progressBar) {

                progressBar.style.width =
                    "0%";

            }

            /*
             * Automatically play next song when available.
             */

            if (
                musicTracks.length > 1 &&
                currentTrack <
                    musicTracks.length - 1
            ) {

                currentTrack++;

                window.loadMbzedTrack(
                    currentTrack
                );

                window.playMbzedMusic();

            }

        }
    );


    /* -----------------------------------------------------
       AUDIO ERROR
       ----------------------------------------------------- */

    audio.addEventListener(
        "error",
        () => {

            console.error(
                "MBZEDMUSIC: Audio could not be loaded:",
                audio.src
            );

            isPlaying = false;

            updatePlayButton();

        }
    );


    /* -----------------------------------------------------
       PROGRESS CLICK
       ----------------------------------------------------- */

    if (progressContainer) {

        progressContainer.addEventListener(
            "click",
            event => {

                if (
                    !audio.duration ||
                    isNaN(audio.duration)
                ) {

                    return;

                }

                const rect =
                    progressContainer.getBoundingClientRect();

                const position =
                    event.clientX -
                    rect.left;

                const percent =
                    position /
                    rect.width;

                audio.currentTime =
                    Math.max(
                        0,
                        Math.min(
                            audio.duration,
                            percent *
                                audio.duration
                        )
                    );

            }
        );

    }


    /* -----------------------------------------------------
       UPDATE MAIN BUTTON
       ----------------------------------------------------- */

    function updatePlayButton() {

        if (!mainButton) {

            return;

        }

        const icon =
            mainButton.querySelector("i");

        if (!icon) {

            return;

        }

        if (
            !audio.paused &&
            !audio.ended
        ) {

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


    /*
     * Make function available to other parts.
     */

    window.updateMbzedPlayButton =
        updatePlayButton;


    attachPlayButtons();

}


/* =========================================================
   PLAY BUTTONS ON SONG CARDS
   ========================================================= */

function attachPlayButtons() {

    const buttons =
        document.querySelectorAll(
            ".play-button, .card-play"
        );

    buttons.forEach(button => {

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
            event => {

                event.preventDefault();

                event.stopPropagation();


                const title =
                    button.dataset.title ||
                    "Unknown Song";

                const artist =
                    button.dataset.artist ||
                    "Unknown Artist";

                const audioUrl =
                    button.dataset.audio ||
                    "";

                const cover =
                    button.dataset.cover ||
                    "mb-levels-cover.jpg.jpeg";


                if (!audioUrl) {

                    console.error(
                        "MBZEDMUSIC: No audio file attached to this button."
                    );

                    return;

                }


                let index =
                    musicTracks.findIndex(
                        track =>
                            track.audio ===
                            audioUrl
                    );


                /*
                 * If this song came from the
                 * static HTML rather than Supabase,
                 * add it to the player.
                 */

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


                currentTrack =
                    index;


                const loaded =
                    window.loadMbzedTrack(
                        currentTrack
                    );


                if (loaded) {

                    window.playMbzedMusic();

                }

            }
        );

    });

}


/* =========================================================
   LOAD SONGS FROM SUPABASE
   ========================================================= */

async function loadSongsFromSupabase() {

    if (!mbzedSupabase) {

        loadLocalHomepageSong();

        return;

    }


    console.log(
        "MBZEDMUSIC: Loading songs from Supabase..."
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
                "MBZEDMUSIC: Supabase songs error:",
                error
            );

            /*
             * Important:
             * Don't destroy the working homepage song
             * if Supabase fails.
             */

            loadLocalHomepageSong();

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            console.log(
                "MBZEDMUSIC: No uploaded songs yet."
            );

            loadLocalHomepageSong();

            return;

        }


        const validSongs =
            data.filter(
                song =>
                    song.audio_url
            );


        if (!validSongs.length) {

            loadLocalHomepageSong();

            return;

        }


        musicTracks =
            validSongs.map(song => ({

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

            }));


        console.log(
            "MBZEDMUSIC: Loaded",
            musicTracks.length,
            "songs."
        );


        renderTrendingSongs(
            validSongs
        );

        renderNewReleases(
            validSongs
        );

        renderChartSongs(
            validSongs
        );


        currentTrack = 0;


        if (
            musicTracks.length
        ) {

            window.loadMbzedTrack(
                0
            );

        }

    } catch (error) {

        console.error(
            "MBZEDMUSIC: Unexpected Supabase error:",
            error
        );

        loadLocalHomepageSong();

    }

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

    const cover =
        song.cover_url ||
        "mb-levels-cover.jpg.jpeg";

    const audioUrl =
        song.audio_url ||
        "";

    const genre =
        escapeHtml(
            song.genre ||
            ""
        );


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
                data-title="${escapeAttribute(song.title || "Untitled")}"
                data-artist="${escapeAttribute(song.artist_name || "Unknown Artist")}"
                data-audio="${escapeAttribute(audioUrl)}"
                data-cover="${escapeAttribute(cover)}"
            >

                <i class="fa-solid fa-play"></i>

            </button>

        </div>

    `;

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
            .map(song => {

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
                            style="background-image:url('${escapeAttribute(cover)}');"
                        >

                            <span class="new-label">
                                NEW
                            </span>

                            <button
                                class="card-play"
                                type="button"
                                data-title="${escapeAttribute(song.title || "Untitled")}"
                                data-artist="${escapeAttribute(song.artist_name || "Unknown Artist")}"
                                data-audio="${escapeAttribute(song.audio_url || "")}"
                                data-cover="${escapeAttribute(cover)}"
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

            })
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
                                style="background-image:url('${escapeAttribute(cover)}');"
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
                                data-title="${escapeAttribute(song.title || "Untitled")}"
                                data-artist="${escapeAttribute(song.artist_name || "Unknown Artist")}"
                                data-audio="${escapeAttribute(song.audio_url || "")}"
                                data-cover="${escapeAttribute(cover)}"
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

    const searchButton =
        document.getElementById(
            "searchButton"
        );

    const searchBox =
        document.getElementById(
            "searchBox"
        );

    const closeSearch =
        document.getElementById(
            "closeSearch"
        );

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (
        searchButton &&
        searchBox
    ) {

        searchButton.addEventListener(
            "click",
            () => {

                searchBox.classList.add(
                    "active"
                );

                if (searchInput) {

                    setTimeout(
                        () =>
                            searchInput.focus(),
                        100
                    );

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

                if (searchInput) {

                    searchInput.value =
                        "";

                }

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;

                }


                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!query) {

                    return;

                }


                const resultIndex =
                    musicTracks.findIndex(
                        track => {

                            const title =
                                (
                                    track.title ||
                                    ""
                                ).toLowerCase();

                            const artist =
                                (
                                    track.artist ||
                                    ""
                                ).toLowerCase();

                            const genre =
                                (
                                    track.genre ||
                                    ""
                                ).toLowerCase();

                            return (
                                title.includes(query) ||
                                artist.includes(query) ||
                                genre.includes(query)
                            );

                        }
                    );


                if (
                    resultIndex >= 0
                ) {

                    currentTrack =
                        resultIndex;

                    window.loadMbzedTrack(
                        currentTrack
                    );

                    window.playMbzedMusic();

                } else {

                    alert(
                        "No music found for: " +
                        searchInput.value
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

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const navigation =
        document.getElementById(
            "navigation"
        );


    if (
        !mobileMenu ||
        !navigation
    ) {

        return;

    }


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


            if (!icon) {

                return;

            }


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
    );


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
                        mobileMenu.querySelector(
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
        event => {

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
        event => {

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

    document
        .querySelectorAll(
            ".upload-button, .artist-upload"
        )
        .forEach(button => {

            const href =
                button.getAttribute("href");


            if (
                !href ||
                href === "#"
            ) {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        window.location.href =
                            "upload.html";

                    }
                );

            }

        });

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
   END
   ========================================================= */

console.log(
    "MBZEDMUSIC.COM JavaScript loaded successfully."
);

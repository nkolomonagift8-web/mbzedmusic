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

const audio = new Audio();

audio.preload = "metadata";


/* =========================================================
   START
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
        console.warn("MBZEDMUSIC: Supabase unavailable.");
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
   CONNECT
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

    const player =
        document.getElementById("musicPlayer");

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

            audio.load();

            if (player) {

                player.classList.add("active");
            }

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
       PROGRESS
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
                percentage + "%";
        }
    );


    /* =====================================================
       CLICK PROGRESS
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
                    position /
                    rect.width;

                audio.currentTime =
                    percentage *
                    audio.duration;
            }
        );
    }


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
             * Automatically play next song
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
       UPDATE BUTTON
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

        } else {

            icon.classList.remove(
                "fa-pause"
            );

            icon.classList.add(
                "fa-play"
            );
        }
    }


    window.updateMbzedPlayButton =
        updatePlayButton;


    attachPlayButtons();
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
   LOAD SONGS
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


        if (!data || !data.length) {

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

        window.loadMbzedTrack(
            currentTrack
        );


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
            .filter(song => song.audio_url)
            .slice(0, 10);


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

function createSongHTML(song, number) {

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
                    song.title || "Untitled"
                )}"

                data-artist="${escapeAttribute(
                    song.artist_name || "Unknown Artist"
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
            .filter(song => song.audio_url)
            .slice(0, 8);


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
                                        song.title || "Untitled"
                                    )}"

                                    data-artist="${escapeAttribute(
                                        song.artist_name || "Unknown Artist"
                                    )}"

                                    data-audio="${escapeAttribute(
                                        song.audio_url || ""
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
            .filter(song => song.audio_url)
            .slice(0, 10);


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
                                    song.title || "Untitled"
                                )}"

                                data-artist="${escapeAttribute(
                                    song.artist_name || "Unknown Artist"
                                )}"

                                data-audio="${escapeAttribute(
                                    song.audio_url || ""
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
                        track => {

                            return (

                                (
                                    track.title ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(query)

                                ||

                                (
                                    track.artist ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(query)

                                ||

                                (
                                    track.genre ||
                                    ""
                                )
                                    .toLowerCase()
                                    .includes(query)
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


    if (!menu || !navigation) {
        return;
    }


    menu.addEventListener(
        "click",
        function() {

            navigation.classList.toggle(
                "active"
            );


            const icon =
                menu.querySelector("i");


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
        button => {

            const href =
                button.getAttribute("href");


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

    return String(value ?? "")
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


console.log(
    "MBZEDMUSIC.COM JavaScript loaded successfully."
);

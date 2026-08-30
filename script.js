/* =========================================================
   MBZEDMUSIC.COM - MAIN JAVASCRIPT
   Supabase music loading + player + search + mobile menu
   + newsletter
   ========================================================= */


/* =========================================================
   SUPABASE SETTINGS
   ========================================================= */

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


/* =========================================================
   GLOBAL VARIABLES
   ========================================================= */

let mbzedSupabase = null;

let musicTracks = [];

let currentTrack = 0;

let isPlaying = false;

const audio = new Audio();


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


    if (mbzedSupabase) {

        loadSongsFromSupabase();

    } else {

        console.warn(
            "MBZEDMUSIC: Supabase is not connected."
        );

    }

}


/* =========================================================
   LOAD SUPABASE
   ========================================================= */

function loadSupabase() {

    if (
        window.supabase
    ) {

        connectSupabase();

        return;

    }


    const supabaseScript =
        document.createElement("script");


    supabaseScript.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


    supabaseScript.onload =
        () => {

            console.log(
                "MBZEDMUSIC: Supabase library loaded."
            );

            connectSupabase();

        };


    supabaseScript.onerror =
        () => {

            console.error(
                "MBZEDMUSIC: Could not load Supabase library."
            );

            startMbzedMusic();

        };


    document.head.appendChild(
        supabaseScript
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
            "MBZEDMUSIC: Supabase connection failed:",
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
        document.getElementById(
            "musicPlayer"
        );


    const mainPlayerButton =
        document.getElementById(
            "mainPlayerButton"
        );


    const playerTitle =
        document.getElementById(
            "playerTitle"
        );


    const playerArtist =
        document.getElementById(
            "playerArtist"
        );


    const playerCover =
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
                !musicTracks[index]
            ) {

                console.log(
                    "MBZEDMUSIC: No track available."
                );

                return;

            }


            const track =
                musicTracks[index];


            audio.src =
                track.audio;


            if (playerTitle) {

                playerTitle.textContent =
                    track.title ||
                    "Unknown Song";

            }


            if (playerArtist) {

                playerArtist.textContent =
                    track.artist ||
                    "Unknown Artist";

            }


            if (
                playerCover &&
                track.cover
            ) {

                playerCover.style.backgroundImage =
                    `url("${track.cover}")`;

                playerCover.style.backgroundSize =
                    "cover";

                playerCover.style.backgroundPosition =
                    "center";

            }


            audio.load();

        };


    /* =====================================================
       PLAY
       ===================================================== */

    window.playMbzedMusic =
        function() {

            if (
                !musicTracks.length
            ) {

                console.warn(
                    "MBZEDMUSIC: There are no songs available."
                );

                return;

            }


            if (
                !audio.src
            ) {

                window.loadMbzedTrack(
                    currentTrack
                );

            }


            audio.play()
                .then(
                    () => {

                        isPlaying =
                            true;


                        updateMainPlayButton();


                        if (player) {

                            player.classList.add(
                                "active"
                            );

                        }

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "MBZEDMUSIC: Music could not play:",
                            error
                        );

                    }
                );

        };


    /* =====================================================
       PAUSE
       ===================================================== */

    window.pauseMbzedMusic =
        function() {

            audio.pause();

            isPlaying =
                false;

            updateMainPlayButton();

        };


    /* =====================================================
       TOGGLE PLAY
       ===================================================== */

    function toggleMusic() {

        if (isPlaying) {

            window.pauseMbzedMusic();

        } else {

            window.playMbzedMusic();

        }

    }


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    if (
        mainPlayerButton
    ) {

        mainPlayerButton.addEventListener(
            "click",
            toggleMusic
        );

    }


    /* =====================================================
       AUDIO PROGRESS
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

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
                `${percentage}%`;

        }
    );


    /* =====================================================
       PROGRESS BAR CLICK
       ===================================================== */

    if (
        progressContainer
    ) {

        progressContainer.addEventListener(
            "click",
            event => {

                if (
                    !audio.duration
                ) {

                    return;

                }


                const rect =
                    progressContainer.getBoundingClientRect();


                const clickPosition =
                    event.clientX -
                    rect.left;


                const percentage =
                    clickPosition /
                    rect.width;


                audio.currentTime =
                    percentage *
                    audio.duration;

            }
        );

    }


    /* =====================================================
       MUSIC ENDED
       ===================================================== */

    audio.addEventListener(
        "ended",
        () => {

            isPlaying =
                false;


            updateMainPlayButton();


            if (
                progressBar
            ) {

                progressBar.style.width =
                    "0%";

            }

        }
    );


    /* =====================================================
       UPDATE PLAY BUTTON
       ===================================================== */

    function updateMainPlayButton() {

        if (
            !mainPlayerButton
        ) {

            return;

        }


        const icon =
            mainPlayerButton.querySelector(
                "i"
            );


        if (!icon) {

            return;

        }


        if (
            isPlaying
        ) {

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


    attachPlayButtons();

}


/* =========================================================
   ATTACH PLAY BUTTONS
   ========================================================= */

function attachPlayButtons() {

    const playButtons =
        document.querySelectorAll(
            ".play-button, .card-play"
        );


    playButtons.forEach(
        button => {

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
                        button.dataset.audio;


                    const cover =
                        button.dataset.cover ||
                        "mb-levels-cover.jpg.jpeg";


                    if (
                        !audioUrl
                    ) {

                        console.warn(
                            "MBZEDMUSIC: This song has no audio URL."
                        );

                        return;

                    }


                    const existingIndex =
                        musicTracks.findIndex(
                            track =>
                                track.audio ===
                                audioUrl
                        );


                    if (
                        existingIndex >= 0
                    ) {

                        currentTrack =
                            existingIndex;

                    } else {

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


                        currentTrack =
                            musicTracks.length - 1;

                    }


                    window.loadMbzedTrack(
                        currentTrack
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

    console.log(
        "MBZEDMUSIC: Loading songs..."
    );


    if (
        !mbzedSupabase
    ) {

        console.error(
            "MBZEDMUSIC: Supabase client is missing."
        );

        return;

    }


    try {

        const response =
            await mbzedSupabase
                .from("songs")
                .select(
                    "id,user_id,title,artist_name,genre,release_year,description,audio_url,cover_url,created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                );


        const data =
            response.data;


        const error =
            response.error;


        if (
            error
        ) {

            console.error(
                "MBZEDMUSIC: Could not load songs:",
                error
            );

            return;

        }


        console.log(
            "MBZEDMUSIC: Songs returned from Supabase:",
            data
        );


        if (
            !data ||
            data.length === 0
        ) {

            console.log(
                "MBZEDMUSIC: No uploaded songs found."
            );

            showNoSongsMessage();

            return;

        }


        /* =================================================
           CONVERT DATABASE SONGS TO PLAYER TRACKS
           ================================================= */

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
            "MBZEDMUSIC: Player tracks:",
            musicTracks
        );


        if (
            musicTracks.length === 0
        ) {

            console.warn(
                "MBZEDMUSIC: Songs exist, but none have an audio_url."
            );

            showNoSongsMessage();

            return;

        }


        /* =================================================
           RENDER HOMEPAGE
           ================================================= */

        renderTrendingSongs(
            data
        );


        renderNewReleases(
            data
        );


        renderChartSongs(
            data
        );


        /* =================================================
           LOAD FIRST SONG
           ================================================= */

        currentTrack =
            0;


        window.loadMbzedTrack(
            currentTrack
        );


        console.log(
            "MBZEDMUSIC: Songs loaded successfully."
        );

    } catch (error) {

        console.error(
            "MBZEDMUSIC: Unexpected loading error:",
            error
        );

    }

}


/* =========================================================
   SHOW NO SONGS MESSAGE
   ========================================================= */

function showNoSongsMessage() {

    const trackList =
        document.querySelector(
            ".track-list"
        );


    if (
        trackList
    ) {

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


    if (
        releaseGrid
    ) {

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


    if (
        chartList
    ) {

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
   CREATE TRENDING SONG HTML
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

function renderTrendingSongs(
    songs
) {

    const container =
        document.querySelector(
            ".music-panel:first-child .track-list"
        );


    if (
        !container
    ) {

        console.warn(
            "MBZEDMUSIC: Trending container not found."
        );

        return;

    }


    const trending =
        songs
            .filter(
                song =>
                    song.audio_url
            )
            .slice(
                0,
                10
            );


    if (
        !trending.length
    ) {

        return;

    }


    container.innerHTML =
        trending
            .map(
                (
                    song,
                    index
                ) =>
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

function renderNewReleases(
    songs
) {

    const container =
        document.querySelector(
            ".release-grid"
        );


    if (
        !container
    ) {

        console.warn(
            "MBZEDMUSIC: New releases container not found."
        );

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


    if (
        !releases.length
    ) {

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

                }
            )
            .join("");


    attachPlayButtons();

}


/* =========================================================
   CHART
   ========================================================= */

function renderChartSongs(
    songs
) {

    const container =
        document.querySelector(
            ".chart-list"
        );


    if (
        !container
    ) {

        console.warn(
            "MBZEDMUSIC: Chart container not found."
        );

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


    if (
        !chartSongs.length
    ) {

        return;

    }


    container.innerHTML =
        chartSongs
            .map(
                (
                    song,
                    index
                ) => {

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


                if (
                    searchInput
                ) {

                    setTimeout(
                        () => {

                            searchInput.focus();

                        },
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


                if (
                    searchInput
                ) {

                    searchInput.value =
                        "";

                }

            }
        );

    }


    if (
        searchInput
    ) {

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


                if (
                    !query
                ) {

                    return;

                }


                const results =
                    musicTracks.filter(
                        track =>

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


                if (
                    results.length
                ) {

                    currentTrack =
                        musicTracks.indexOf(
                            results[0]
                        );


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


            if (
                !icon
            ) {

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


    const navigationLinks =
        navigation.querySelectorAll(
            "a"
        );


    navigationLinks.forEach(
        link => {

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


                    if (
                        icon
                    ) {

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
   NEWSLETTER
   ========================================================= */

function setupNewsletter() {

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );


    if (
        !newsletterForm
    ) {

        return;

    }


    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const emailInput =
                newsletterForm.querySelector(
                    "input[type='email']"
                );


            if (
                !emailInput
            ) {

                return;

            }


            const email =
                emailInput.value.trim();


            if (
                !email
            ) {

                return;

            }


            alert(
                "Thank you for subscribing to Mbzedmusic.com!"
            );


            emailInput.value =
                "";

        }
    );

}


/* =========================================================
   BACK TO TOP
   ========================================================= */

function setupBackToTop() {

    const backToTop =
        document.querySelector(
            ".footer-bottom a"
        );


    if (
        !backToTop
    ) {

        return;

    }


    backToTop.addEventListener(
        "click",
        event => {

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

    const uploadButtons =
        document.querySelectorAll(
            ".upload-button, .primary-button, .secondary-button, .artist-upload"
        );


    uploadButtons.forEach(
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
                    event => {

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

function escapeHtml(
    value
) {

    return String(
        value
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

function escapeAttribute(
    value
) {

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


console.log(
    "MBZEDMUSIC.COM JavaScript loaded."
);

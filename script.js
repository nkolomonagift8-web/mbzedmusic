// ============================================
// MBZEDMUSIC.COM - MAIN JAVASCRIPT
// ============================================


// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


// ============================================
// SUPABASE HELPER
// ============================================

async function supabaseRequest(endpoint, options = {}) {

    const response = await fetch(
        `${SUPABASE_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,

                ...(options.headers || {})
            }
        }
    );

    const text = await response.text();

    let data = null;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error_description ||
            "Supabase request failed"
        );

    }

    return data;
}


// ============================================
// TEST SUPABASE CONNECTION
// ============================================

async function testSupabaseConnection() {

    try {

        const artists =
            await supabaseRequest(
                "/rest/v1/artists?select=id&limit=1"
            );

        console.log(
            "MBZEDMUSIC Supabase connected successfully."
        );

        console.log(
            "Artists found:",
            artists
        );

    } catch (error) {

        console.error(
            "Supabase connection error:",
            error.message
        );

    }

}


// ============================================
// MOBILE MENU
// ============================================

const mobileMenu =
    document.getElementById("mobileMenu");

const navigation =
    document.getElementById("navigation");


if (mobileMenu && navigation) {

    mobileMenu.addEventListener(
        "click",
        () => {

            navigation.classList.toggle(
                "mobile-open"
            );

        }
    );

}


// ============================================
// SEARCH
// ============================================

const searchButton =
    document.getElementById("searchButton");

const searchBox =
    document.getElementById("searchBox");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");


if (searchButton && searchBox) {

    searchButton.addEventListener(
        "click",
        () => {

            searchBox.classList.add(
                "active"
            );

            if (searchInput) {

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


// ============================================
// SEARCH FUNCTION
// ============================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Enter") {
                return;
            }

            const searchTerm =
                searchInput.value.trim();

            if (!searchTerm) {
                return;
            }

            console.log(
                "Searching MBZEDMUSIC for:",
                searchTerm
            );

            alert(
                `Search for "${searchTerm}" will be connected to the music database next.`
            );

        }
    );

}


// ============================================
// REAL MBZEDMUSIC AUDIO PLAYER
// ============================================

const musicAudio =
    new Audio();


const testSong =
    "MB-LEVELS-Mr.-Kings-ft-Bravo-Uja-Lapa-Shax-Morefire-Trykash-Wayayo-Prod.-by-Dj-Widdah.mp3";


let currentSong = {

    title:
        "MB LEVELS",

    artist:
        "Mr. Kings ft. Bravo, Uja Lapa, Shax Morefire & Trykash",

    file:
        testSong

};


let isPlaying = false;


// ============================================
// PLAYER ELEMENTS
// ============================================

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


// ============================================
// LOAD SONG
// ============================================

function loadSong(song) {

    currentSong = song;

    musicAudio.src =
        encodeURI(song.file);


    if (playerTitle) {

        playerTitle.textContent =
            song.title;

    }


    if (playerArtist) {

        playerArtist.textContent =
            song.artist;

    }

}


// ============================================
// PLAY / PAUSE
// ============================================

async function toggleMusic() {

    try {

        if (musicAudio.paused) {

            await musicAudio.play();

            isPlaying = true;

        } else {

            musicAudio.pause();

            isPlaying = false;

        }

        updatePlayerButton();

    } catch (error) {

        console.error(
            "Unable to play music:",
            error
        );

    }

}


// ============================================
// UPDATE PLAYER BUTTON
// ============================================

function updatePlayerButton() {

    if (!mainPlayerButton) {
        return;
    }


    const icon =
        mainPlayerButton.querySelector(
            "i"
        );


    if (!icon) {
        return;
    }


    icon.className =
        isPlaying
            ? "fa-solid fa-pause"
            : "fa-solid fa-play";

}


// ============================================
// MAIN PLAYER BUTTON
// ============================================

if (mainPlayerButton) {

    mainPlayerButton.addEventListener(
        "click",
        toggleMusic
    );

}


// ============================================
// MUSIC ENDED
// ============================================

musicAudio.addEventListener(
    "ended",
    () => {

        isPlaying = false;

        updatePlayerButton();

    }
);


// ============================================
// MUSIC ERROR
// ============================================

musicAudio.addEventListener(
    "error",
    () => {

        console.error(
            "The MBZEDMUSIC audio file could not be loaded."
        );

    }
);


// ============================================
// SONG PLAY BUTTONS
// ============================================

const playButtons =
    document.querySelectorAll(
        ".play-button, .card-play"
    );


playButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            async () => {

                const track =
                    button.closest(
                        ".track, .release-card, .chart-item"
                    );


                if (!track) {
                    return;
                }


                const titleElement =
                    track.querySelector(
                        "h3"
                    );


                const artistElement =
                    track.querySelector(
                        "p"
                    );


                const title =
                    titleElement
                        ? titleElement.textContent.trim()
                        : "MB LEVELS";


                const artist =
                    artistElement
                        ? artistElement.textContent.trim()
                        : "Mr. Kings";


                loadSong({

                    title:
                        title,

                    artist:
                        artist,

                    file:
                        testSong

                });


                try {

                    await musicAudio.play();

                    isPlaying = true;

                    updatePlayerButton();

                } catch (error) {

                    console.error(
                        "Unable to play track:",
                        error
                    );

                }

            }
        );

    }
);


// ============================================
// INITIAL SONG
// ============================================

loadSong(
    currentSong
);


// ============================================
// NEWSLETTER
// ============================================

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const email =
                newsletterForm
                    .querySelector(
                        "input[type='email']"
                    )
                    ?.value.trim();


            if (!email) {
                return;
            }


            alert(
                "Thank you for subscribing to MBZEDMUSIC!"
            );


            newsletterForm.reset();

        }
    );

}


// ============================================
// BACK TO TOP
// ============================================

document
    .querySelectorAll(
        "a[href='#']"
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (href === "#") {

                        event.preventDefault();


                        window.scrollTo({

                            top: 0,

                            behavior: "smooth"

                        });

                    }

                }
            );

        }
    );


// ============================================
// START SUPABASE CONNECTION TEST
// ============================================

testSupabaseConnection();

// ============================================
// MBZEDMUSIC.COM - SUPABASE CONNECTION
// ============================================

const SUPABASE_URL = "https://uutfftxqupzxqfmcryqg.supabase.co";

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

        const artists = await supabaseRequest(
            "/rest/v1/artists?select=id&limit=1"
        );

        console.log("MBZEDMUSIC Supabase connected successfully.");

        console.log("Artists found:", artists);

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

    mobileMenu.addEventListener("click", () => {

        navigation.classList.toggle("mobile-open");

    });

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

    searchButton.addEventListener("click", () => {

        searchBox.classList.add("active");

        if (searchInput) {
            searchInput.focus();
        }

    });

}


if (closeSearch && searchBox) {

    closeSearch.addEventListener("click", () => {

        searchBox.classList.remove("active");

    });

}


// ============================================
// SEARCH ENTER
// ============================================

if (searchInput) {

    searchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            const searchTerm =
                searchInput.value.trim();

            if (!searchTerm) return;

            console.log(
                "Searching MBZEDMUSIC for:",
                searchTerm
            );

            alert(
                `Search for "${searchTerm}" will be connected to the music database next.`
            );

        }

    });

}


// ============================================
// MUSIC PLAYER UI
// ============================================

const mainPlayerButton =
    document.getElementById("mainPlayerButton");

let isPlaying = false;


if (mainPlayerButton) {

    mainPlayerButton.addEventListener("click", () => {

        isPlaying = !isPlaying;

        const icon =
            mainPlayerButton.querySelector("i");

        if (icon) {

            icon.className = isPlaying
                ? "fa-solid fa-pause"
                : "fa-solid fa-play";

        }

    });

}


// ============================================
// PLAY BUTTONS
// ============================================

const playButtons =
    document.querySelectorAll(
        ".play-button, .card-play"
    );


playButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const track =
            button.closest(".track, .release-card, .chart-item");

        if (!track) return;

        const titleElement =
            track.querySelector("h3");

        const artistElement =
            track.querySelector("p");

        const title =
            titleElement
                ? titleElement.textContent.trim()
                : "Unknown Track";

        const artist =
            artistElement
                ? artistElement.textContent.trim()
                : "Unknown Artist";

        const playerTitle =
            document.getElementById("playerTitle");

        const playerArtist =
            document.getElementById("playerArtist");

        if (playerTitle)
            playerTitle.textContent = title;

        if (playerArtist)
            playerArtist.textContent = artist;

        console.log(
            `Playing: ${title} - ${artist}`
        );

    });

});


// ============================================
// NEWSLETTER
// ============================================

const newsletterForm =
    document.getElementById("newsletterForm");


if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const email =
                newsletterForm
                    .querySelector("input[type='email']")
                    ?.value.trim();

            if (!email) return;

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
    .querySelectorAll("a[href='#']")
    .forEach((link) => {

        link.addEventListener("click", (event) => {

            const href =
                link.getAttribute("href");

            if (href === "#") {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        });

    });


// ============================================
// START CONNECTION TEST
// ============================================

testSupabaseConnection();

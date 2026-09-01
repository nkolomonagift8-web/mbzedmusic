/* =========================================================
   MBZEDMUSIC.COM
   AFRICAN MUSIC • OUR CULTURE • OUR SOUND
   COMPLETE WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. MOBILE MENU
       ===================================================== */

    const mobileMenu = document.querySelector(".mobile-menu");
    const navigation = document.querySelector(".navigation");

    if (mobileMenu && navigation) {
        mobileMenu.addEventListener("click", () => {
            navigation.classList.toggle("active");

            const icon = mobileMenu.querySelector("i");

            if (icon) {
                if (navigation.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                } else {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile menu after clicking a link
        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("active");

                const icon = mobileMenu.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }


    /* =====================================================
       2. SEARCH BOX
       ===================================================== */

    const searchButton = document.querySelector(".search-button");
    const searchBox = document.querySelector(".search-box");
    const searchInput = document.querySelector(".search-inner input");
    const searchSubmit = document.querySelector(".search-inner button");

    if (searchButton && searchBox) {

        searchButton.addEventListener("click", () => {
            searchBox.classList.toggle("active");

            if (searchBox.classList.contains("active") && searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 150);
            }
        });
    }


    /* =====================================================
       3. WEBSITE SEARCH
       ===================================================== */

    function performSearch() {

        if (!searchInput) return;

        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            alert("Please enter an artist, song, genre or keyword.");
            searchInput.focus();
            return;
        }

        const searchableItems = document.querySelectorAll(
            ".track, .release-card, .chart-item, .genre-card"
        );

        let found = false;

        searchableItems.forEach(item => {

            const text = item.textContent.toLowerCase();

            if (text.includes(searchTerm)) {
                item.style.display = "";
                item.style.outline = "2px solid var(--gold)";
                item.style.borderRadius = "8px";
                found = true;

                setTimeout(() => {
                    item.style.outline = "";
                }, 3000);

                if (!found) {
                    item.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            } else {
                item.style.display = "";
            }
        });

        if (found) {

            const firstMatch = Array.from(searchableItems).find(item =>
                item.textContent.toLowerCase().includes(searchTerm)
            );

            if (firstMatch) {
                firstMatch.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

        } else {
            alert(
                `No results found for "${searchInput.value}".\n\nTry searching for an artist, song or genre.`
            );
        }
    }

    if (searchSubmit) {
        searchSubmit.addEventListener("click", performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
            }
        });
    }


    /* =====================================================
       4. CLOSE SEARCH WITH ESCAPE
       ===================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (searchBox) {
                searchBox.classList.remove("active");
            }

            if (navigation) {
                navigation.classList.remove("active");
            }

            if (mobileMenu) {
                const icon = mobileMenu.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        }
    });


    /* =====================================================
       5. MUSIC PLAYER
       ===================================================== */

    const musicPlayer = document.querySelector(".music-player");
    const playerCover = document.querySelector(".player-cover");
    const playerTitle = document.querySelector(".player-info h3");
    const playerArtist = document.querySelector(".player-info p");
    const mainPlayerButton = document.querySelector(".main-player-button");
    const progressBar = document.querySelector(".player-progress");
    const progressFill = document.querySelector(".player-progress > div");

    let audio = null;
    let currentTrackButton = null;
    let currentTrackData = null;


    /* =====================================================
       6. AUDIO CREATION
       ===================================================== */

    function createAudio(src) {

        if (audio) {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
        }

        audio = new Audio();

        audio.preload = "metadata";

        audio.src = src;

        audio.addEventListener("timeupdate", updateProgress);

        audio.addEventListener("ended", () => {

            if (progressFill) {
                progressFill.style.width = "0%";
            }

            if (mainPlayerButton) {
                mainPlayerButton.innerHTML =
                    '<i class="fas fa-play"></i>';
            }

            if (currentTrackButton) {
                currentTrackButton.innerHTML =
                    '<i class="fas fa-play"></i>';
            }
        });

        audio.addEventListener("error", () => {
            console.warn(
                "Mbzedmusic: Audio file could not be loaded:",
                src
            );

            if (mainPlayerButton) {
                mainPlayerButton.innerHTML =
                    '<i class="fas fa-play"></i>';
            }
        });
    }


    /* =====================================================
       7. FIND AUDIO SOURCE
       ===================================================== */

    function getAudioSource(button) {

        if (!button) return null;

        let source =
            button.dataset.audio ||
            button.getAttribute("data-audio") ||
            button.closest("[data-audio]")?.dataset.audio;

        return source || null;
    }


    /* =====================================================
       8. GET TRACK INFORMATION
       ===================================================== */

    function getTrackInformation(button) {

        const track =
            button.closest(".track") ||
            button.closest(".release-card") ||
            button.closest(".chart-item");

        if (!track) {
            return {
                title: "Mbzedmusic Track",
                artist: "African Music"
            };
        }

        let title = "Unknown Track";
        let artist = "Unknown Artist";

        const titleElement =
            track.querySelector(
                ".track-info h3, .release-card h3, .chart-item h3"
            );

        const artistElement =
            track.querySelector(
                ".track-info p, .release-card p, .chart-item p"
            );

        if (titleElement) {
            title = titleElement.textContent.trim();
        }

        if (artistElement) {
            artist = artistElement.textContent.trim();
        }

        return {
            title,
            artist,
            element: track
        };
    }


    /* =====================================================
       9. GET COVER ART
       ===================================================== */

    function getTrackCover(track) {

        if (!track) return null;

        const imageElement =
            track.querySelector(
                ".track-image, .release-image, .mini-cover"
            );

        if (!imageElement) return null;

        // Background image
        const background =
            window.getComputedStyle(imageElement)
                .backgroundImage;

        if (
            background &&
            background !== "none" &&
            background.includes("url")
        ) {
            return background;
        }

        // Normal image
        if (imageElement.tagName === "IMG") {
            return `url("${imageElement.src}")`;
        }

        return null;
    }


    /* =====================================================
       10. PLAY TRACK
       ===================================================== */

    function playTrack(button) {

        const source = getAudioSource(button);

        const information =
            getTrackInformation(button);

        currentTrackData = information;

        currentTrackButton = button;

        /*
         * If there is no audio URL yet, keep the player
         * working visually instead of crashing.
         */

        if (!source) {

            if (musicPlayer) {
                musicPlayer.classList.add("active");
            }

            if (playerTitle) {
                playerTitle.textContent =
                    information.title;
            }

            if (playerArtist) {
                playerArtist.textContent =
                    information.artist;
            }

            const cover =
                getTrackCover(information.element);

            if (cover && playerCover) {
                playerCover.style.backgroundImage = cover;
            }

            alert(
                "This track does not have an audio file connected yet."
            );

            return;
        }

        /* Same track */
        if (
            audio &&
            audio.src.includes(source)
        ) {

            if (audio.paused) {
                audio.play()
                    .then(() => {
                        updatePlayButtons(true);
                    })
                    .catch(error => {
                        console.warn(error);
                    });
            } else {
                audio.pause();
                updatePlayButtons(false);
            }

            return;
        }

        /* New track */
        createAudio(source);

        if (playerTitle) {
            playerTitle.textContent =
                information.title;
        }

        if (playerArtist) {
            playerArtist.textContent =
                information.artist;
        }

        const cover =
            getTrackCover(information.element);

        if (cover && playerCover) {
            playerCover.style.backgroundImage =
                cover;
        }

        if (musicPlayer) {
            musicPlayer.classList.add("active");
        }

        audio.play()
            .then(() => {
                updatePlayButtons(true);
            })
            .catch(error => {
                console.warn(
                    "Mbzedmusic audio playback error:",
                    error
                );
            });
    }


    /* =====================================================
       11. PLAY BUTTONS
       ===================================================== */

    function updatePlayButtons(isPlaying) {

        if (mainPlayerButton) {

            mainPlayerButton.innerHTML =
                isPlaying
                    ? '<i class="fas fa-pause"></i>'
                    : '<i class="fas fa-play"></i>';
        }

        document
            .querySelectorAll(
                ".play-button, .card-play"
            )
            .forEach(button => {

                if (button === currentTrackButton) {

                    button.innerHTML =
                        isPlaying
                            ? '<i class="fas fa-pause"></i>'
                            : '<i class="fas fa-play"></i>';

                } else {

                    button.innerHTML =
                        '<i class="fas fa-play"></i>';
                }
            });
    }


    /* =====================================================
       12. CONNECT ALL PLAY BUTTONS
       ===================================================== */

    const playButtons =
        document.querySelectorAll(
            ".play-button, .card-play"
        );

    playButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            playTrack(button);

        });

    });


    /* =====================================================
       13. MAIN PLAYER BUTTON
       ===================================================== */

    if (mainPlayerButton) {

        mainPlayerButton.addEventListener("click", () => {

            if (!audio) return;

            if (audio.paused) {

                audio.play()
                    .then(() => {
                        updatePlayButtons(true);
                    })
                    .catch(error => {
                        console.warn(error);
                    });

            } else {

                audio.pause();

                updatePlayButtons(false);
            }
        });
    }


    /* =====================================================
       14. PLAYER PROGRESS
       ===================================================== */

    function updateProgress() {

        if (!audio || !progressFill) return;

        if (!audio.duration) return;

        const percentage =
            (audio.currentTime /
                audio.duration) *
            100;

        progressFill.style.width =
            `${percentage}%`;
    }


    /* =====================================================
       15. CLICK PLAYER PROGRESS
       ===================================================== */

    if (progressBar) {

        progressBar.addEventListener("click", event => {

            if (!audio || !audio.duration) return;

            const rect =
                progressBar.getBoundingClientRect();

            const position =
                event.clientX - rect.left;

            const percentage =
                position / rect.width;

            audio.currentTime =
                percentage * audio.duration;
        });
    }


    /* =====================================================
       16. HERO BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href="#music"], a[href="#music-section"]'
        )
        .forEach(link => {

            link.addEventListener("click", event => {

                const target =
                    document.querySelector("#music") ||
                    document.querySelector(".music-section");

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });
                }

            });

        });


    /* =====================================================
       17. SMOOTH SCROLL FOR INTERNAL LINKS
       ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });

        });


    /* =====================================================
       18. ACTIVE NAVIGATION
       ===================================================== */

    const navLinks =
        document.querySelectorAll(
            ".navigation a"
        );

    function updateActiveNavigation() {

        const sections =
            document.querySelectorAll(
                "section[id]"
            );

        let currentSection = "";

        sections.forEach(section => {

            const top =
                section.getBoundingClientRect().top;

            if (top <= 150) {
                currentSection =
                    section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (
                href &&
                href === `#${currentSection}`
            ) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    /* =====================================================
       19. SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".music-panel, .genre-card, .artist-banner, .promote-box, .about-content, .contact-content"
        );

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.08
                }
            );

        revealElements.forEach(element => {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";

            observer.observe(element);

        });
    }


    /* =====================================================
       20. NEWSLETTER FORM
       ===================================================== */

    const newsletterForm =
        document.querySelector(
            ".newsletter-form"
        );

    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const emailInput =
                    newsletterForm.querySelector(
                        "input[type='email'], input"
                    );

                if (!emailInput) return;

                const email =
                    emailInput.value.trim();

                if (!email) {

                    alert(
                        "Please enter your email address."
                    );

                    return;
                }

                if (!email.includes("@")) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;
                }

                alert(
                    "Thank you for joining the Mbzedmusic community!"
                );

                emailInput.value = "";
            }
        );
    }


    /* =====================================================
       21. UPLOAD BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            ".upload-button, .primary-button, .secondary-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    const text =
                        button.textContent
                            .trim()
                            .toLowerCase();

                    if (
                        text.includes("upload")
                    ) {

                        const href =
                            button.getAttribute(
                                "href"
                            );

                        /*
                         * Only intercept if there is
                         * no real destination.
                         */

                        if (
                            !href ||
                            href === "#"
                        ) {

                            event.preventDefault();

                            alert(
                                "Mbzedmusic artist upload is coming soon."
                            );
                        }
                    }
                }
            );

        });


    /* =====================================================
       22. HOVER EFFECT FOR MUSIC CARDS
       ===================================================== */

    document
        .querySelectorAll(
            ".release-card, .genre-card, .music-panel"
        )
        .forEach(card => {

            card.addEventListener(
                "mouseenter",
                () => {
                    card.style.transition =
                        "transform .25s ease, border-color .25s ease";
                }
            );

        });


    /* =====================================================
       23. PREVENT EMPTY LINKS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {
                    event.preventDefault();
                }
            );

        });


    /* =====================================================
       24. HEADER SHADOW ON SCROLL
       ===================================================== */

    const header =
        document.querySelector(".header");

    if (header) {

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 30
                ) {

                    header.style.boxShadow =
                        "0 12px 35px rgba(0,0,0,.35)";

                } else {

                    header.style.boxShadow =
                        "none";
                }

            },
            {
                passive: true
            }
        );
    }


    /* =====================================================
       25. INITIALIZE
       ===================================================== */

    updateActiveNavigation();

    console.log(
        "MBZEDMUSIC.COM loaded successfully."
    );

});

// ============================================================
// MBZEDMUSIC.COM - UPLOAD SYSTEM
// ============================================================

// Supabase CDN
const SUPABASE_CDN =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

// Your Supabase project
const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

// Your PUBLIC/PUBLISHABLE key
const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


// ============================================================
// LOAD SUPABASE
// ============================================================

const supabaseScript = document.createElement("script");

supabaseScript.src = SUPABASE_CDN;

supabaseScript.onload = function () {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log("Supabase connected successfully.");

    startUploadSystem();

};

supabaseScript.onerror = function () {

    console.error(
        "Could not load Supabase."
    );

};

document.head.appendChild(supabaseScript);



// ============================================================
// UPLOAD SYSTEM
// ============================================================

function startUploadSystem() {

    const form =
        document.getElementById("musicUploadForm");

    const audioInput =
        document.getElementById("audioFile");

    const coverInput =
        document.getElementById("coverImage");

    const audioName =
        document.getElementById("audioFileName");

    const coverName =
        document.getElementById("coverFileName");

    const coverPreview =
        document.getElementById("coverPreview");

    const coverPreviewImage =
        document.getElementById("coverPreviewImage");

    const submitButton =
        document.getElementById("uploadSubmit");

    const message =
        document.getElementById("uploadMessage");


    if (!form) {

        console.error(
            "Upload form was not found."
        );

        return;

    }


    // ========================================================
    // SHOW MESSAGE
    // ========================================================

    function showMessage(text, type) {

        if (!message) return;

        message.textContent = text;

        message.className =
            "upload-message " + type;

    }


    // ========================================================
    // FORMAT FILE SIZE
    // ========================================================

    function formatFileSize(bytes) {

        if (bytes === 0) {
            return "0 Bytes";
        }

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const i =
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            );

        return (
            Math.round(
                bytes /
                Math.pow(1024, i) *
                100
            ) / 100
        ) +
        " " +
        sizes[i];

    }


    // ========================================================
    // MP3 SELECTION
    // ========================================================

    if (audioInput) {

        audioInput.addEventListener(
            "change",
            function () {

                if (!audioInput.files.length) {

                    audioName.textContent =
                        "No file selected";

                    return;

                }

                const file =
                    audioInput.files[0];


                if (
                    !file.name
                        .toLowerCase()
                        .endsWith(".mp3")
                ) {

                    showMessage(
                        "Please select an MP3 file.",
                        "error"
                    );

                    audioInput.value = "";

                    audioName.textContent =
                        "No file selected";

                    return;

                }


                // Maximum 50 MB

                if (
                    file.size >
                    50 * 1024 * 1024
                ) {

                    showMessage(
                        "Your MP3 is larger than 50 MB.",
                        "error"
                    );

                    audioInput.value = "";

                    audioName.textContent =
                        "No file selected";

                    return;

                }


                audioName.textContent =
                    file.name +
                    " (" +
                    formatFileSize(file.size) +
                    ")";


                showMessage(
                    "MP3 selected successfully.",
                    "success"
                );

            }
        );

    }



    // ========================================================
    // COVER IMAGE SELECTION
    // ========================================================

    if (coverInput) {

        coverInput.addEventListener(
            "change",
            function () {

                if (!coverInput.files.length) {

                    coverName.textContent =
                        "No image selected";

                    return;

                }

                const file =
                    coverInput.files[0];


                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    showMessage(
                        "Please select a JPG, PNG or WEBP image.",
                        "error"
                    );

                    coverInput.value = "";

                    coverName.textContent =
                        "No image selected";

                    return;

                }


                // Maximum 10 MB

                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    showMessage(
                        "Your cover image is larger than 10 MB.",
                        "error"
                    );

                    coverInput.value = "";

                    coverName.textContent =
                        "No image selected";

                    return;

                }


                coverName.textContent =
                    file.name +
                    " (" +
                    formatFileSize(file.size) +
                    ")";


                // Preview

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        if (coverPreviewImage) {

                            coverPreviewImage.src =
                                event.target.result;

                        }


                        if (coverPreview) {

                            coverPreview.classList.add(
                                "show"
                            );

                        }

                    };


                reader.readAsDataURL(file);


                showMessage(
                    "Cover artwork selected successfully.",
                    "success"
                );

            }
        );

    }



    // ========================================================
    // FORM SUBMISSION
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ------------------------------------------------
            // GET FORM VALUES
            // ------------------------------------------------

            const title =
                document
                    .getElementById("songTitle")
                    .value
                    .trim();


            const artist =
                document
                    .getElementById("artistName")
                    .value
                    .trim();


            const genre =
                document
                    .getElementById("genre")
                    .value;


            const releaseYearElement =
                document.getElementById(
                    "releaseYear"
                );


            const descriptionElement =
                document.getElementById(
                    "songDescription"
                );


            const releaseYear =
                releaseYearElement
                    ? releaseYearElement.value
                    : "";


            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            const audioFile =
                audioInput.files[0];


            const coverFile =
                coverInput.files[0];


            const agreement =
                document.getElementById(
                    "copyrightAgreement"
                );


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (!title) {

                showMessage(
                    "Please enter the song title.",
                    "error"
                );

                return;

            }


            if (!artist) {

                showMessage(
                    "Please enter the artist name.",
                    "error"
                );

                return;

            }


            if (!genre) {

                showMessage(
                    "Please select a genre.",
                    "error"
                );

                return;

            }


            if (!audioFile) {

                showMessage(
                    "Please choose an MP3 file.",
                    "error"
                );

                return;

            }


            if (!coverFile) {

                showMessage(
                    "Please choose your cover artwork.",
                    "error"
                );

                return;

            }


            if (!agreement.checked) {

                showMessage(
                    "Please confirm that you have permission to upload this music.",
                    "error"
                );

                return;

            }



            // ------------------------------------------------
            // DISABLE BUTTON
            // ------------------------------------------------

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> UPLOADING...';


            showMessage(
                "Uploading your music. Please wait...",
                "success"
            );


            try {


                // =================================================
                // CREATE UNIQUE FILE NAMES
                // =================================================

                const uniqueId =
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 9);


                const cleanTitle =
                    title
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        );


                const cleanArtist =
                    artist
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        );


                // =================================================
                // FILE EXTENSIONS
                // =================================================

                const audioPath =
                    uniqueId +
                    "-" +
                    cleanArtist +
                    "-" +
                    cleanTitle +
                    ".mp3";


                let extension =
                    "jpg";


                if (
                    coverFile.type ===
                    "image/png"
                ) {

                    extension = "png";

                }


                if (
                    coverFile.type ===
                    "image/webp"
                ) {

                    extension = "webp";

                }


                const coverPath =
                    uniqueId +
                    "-" +
                    cleanArtist +
                    "-" +
                    cleanTitle +
                    "." +
                    extension;



                // =================================================
                // UPLOAD MP3
                // =================================================

                showMessage(
                    "Uploading MP3...",
                    "success"
                );


                const {
                    error: audioError
                } =
                    await window.supabaseClient
                        .storage
                        .from("music")
                        .upload(
                            audioPath,
                            audioFile,
                            {
                                cacheControl:
                                    "3600",

                                contentType:
                                    "audio/mpeg",

                                upsert:
                                    false
                            }
                        );


                if (audioError) {

                    throw new Error(
                        "MP3 upload failed: " +
                        audioError.message
                    );

                }



                // =================================================
                // UPLOAD COVER
                // =================================================

                showMessage(
                    "Uploading cover artwork...",
                    "success"
                );


                const {
                    error: coverError
                } =
                    await window.supabaseClient
                        .storage
                        .from("covers")
                        .upload(
                            coverPath,
                            coverFile,
                            {
                                cacheControl:
                                    "3600",

                                contentType:
                                    coverFile.type,

                                upsert:
                                    false
                            }
                        );


                if (coverError) {

                    // Try to remove MP3
                    // if cover upload fails.

                    await window.supabaseClient
                        .storage
                        .from("music")
                        .remove([
                            audioPath
                        ]);


                    throw new Error(
                        "Cover upload failed: " +
                        coverError.message
                    );

                }



                // =================================================
                // GET PUBLIC URLS
                // =================================================

                const audioResult =
                    window.supabaseClient
                        .storage
                        .from("music")
                        .getPublicUrl(
                            audioPath
                        );


                const coverResult =
                    window.supabaseClient
                        .storage
                        .from("covers")
                        .getPublicUrl(
                            coverPath
                        );


                const audioUrl =
                    audioResult.data.publicUrl;


                const coverUrl =
                    coverResult.data.publicUrl;



                // =================================================
                // SAVE SONG INFORMATION
                // =================================================

                showMessage(
                    "Saving song information...",
                    "success"
                );


                const {
                    data,
                    error: databaseError
                } =
                    await window.supabaseClient
                        .from("songs")
                        .insert({

                            title:
                                title,

                            artist:
                                artist,

                            genre:
                                genre,

                            release_year:
                                releaseYear
                                    ? Number(
                                        releaseYear
                                    )
                                    : null,

                            description:
                                description,

                            audio_url:
                                audioUrl,

                            cover_url:
                                coverUrl

                        })
                        .select()
                        .single();


                if (databaseError) {

                    // Remove files if database
                    // insert fails.

                    await window.supabaseClient
                        .storage
                        .from("music")
                        .remove([
                            audioPath
                        ]);


                    await window.supabaseClient
                        .storage
                        .from("covers")
                        .remove([
                            coverPath
                        ]);


                    throw new Error(
                        "Could not save song information: " +
                        databaseError.message
                    );

                }



                // =================================================
                // SUCCESS
                // =================================================

                console.log(
                    "Song uploaded:",
                    data
                );


                showMessage(
                    "🎉 Your music was uploaded successfully!",
                    "success"
                );


                submitButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> UPLOADED';


                // Reset form

                form.reset();


                audioName.textContent =
                    "No file selected";


                coverName.textContent =
                    "No image selected";


                if (coverPreviewImage) {

                    coverPreviewImage.src =
                        "";

                }


                if (coverPreview) {

                    coverPreview.classList.remove(
                        "show"
                    );

                }


                // Return button after 4 seconds

                setTimeout(
                    function () {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            '<i class="fa-solid fa-cloud-arrow-up"></i> <span>UPLOAD MUSIC</span>';

                    },
                    4000
                );


            } catch (error) {

                console.error(
                    "Upload error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Something went wrong during the upload.",
                    "error"
                );


                submitButton.disabled =
                    false;


                submitButton.innerHTML =
                    '<i class="fa-solid fa-cloud-arrow-up"></i> <span>UPLOAD MUSIC</span>';

            }

        }
    );

}

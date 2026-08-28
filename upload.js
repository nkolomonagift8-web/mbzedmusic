// ============================================================
// MBZEDMUSIC.COM - COMPLETE UPLOAD SYSTEM
// ============================================================

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";


// ============================================================
// LOAD SUPABASE
// ============================================================

const supabaseScript =
    document.createElement("script");

supabaseScript.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = function () {

    window.mbzedSupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "MBZEDMUSIC: Supabase connected"
    );

    initializeUpload();

};

supabaseScript.onerror = function () {

    console.error(
        "MBZEDMUSIC: Could not load Supabase"
    );

};

document.head.appendChild(
    supabaseScript
);


// ============================================================
// INITIALIZE UPLOAD
// ============================================================

function initializeUpload() {

    const form =
        document.getElementById(
            "musicUploadForm"
        );

    if (!form) {

        console.error(
            "Upload form not found."
        );

        return;

    }


    const audioInput =
        document.getElementById(
            "audioFile"
        );

    const coverInput =
        document.getElementById(
            "coverImage"
        );

    const audioName =
        document.getElementById(
            "audioFileName"
        );

    const coverName =
        document.getElementById(
            "coverFileName"
        );

    const coverPreview =
        document.getElementById(
            "coverPreview"
        );

    const coverPreviewImage =
        document.getElementById(
            "coverPreviewImage"
        );

    const uploadButton =
        document.getElementById(
            "uploadSubmit"
        );

    const message =
        document.getElementById(
            "uploadMessage"
        );

    const agreement =
        document.getElementById(
            "copyrightAgreement"
        );


    // =========================================================
    // MESSAGE
    // =========================================================

    function showMessage(
        text,
        type = ""
    ) {

        if (!message) return;

        message.textContent =
            text;

        message.className =
            "upload-message";

        if (type) {

            message.classList.add(
                type
            );

        }

    }


    // =========================================================
    // FILE SIZE
    // =========================================================

    function formatSize(bytes) {

        if (!bytes) {

            return "0 KB";

        }

        const mb =
            bytes /
            (1024 * 1024);

        if (mb < 1) {

            return Math.round(
                bytes / 1024
            ) + " KB";

        }

        return mb.toFixed(2) +
            " MB";

    }


    // =========================================================
    // MP3 SELECTION
    // =========================================================

    if (audioInput) {

        audioInput.addEventListener(
            "change",
            function () {

                if (
                    !audioInput.files ||
                    !audioInput.files.length
                ) {

                    audioName.textContent =
                        "No file selected";

                    return;

                }


                const file =
                    audioInput.files[0];


                const validMP3 =
                    file.type === "audio/mpeg" ||
                    file.name
                        .toLowerCase()
                        .endsWith(".mp3");


                if (!validMP3) {

                    showMessage(
                        "Please select an MP3 file.",
                        "error"
                    );

                    audioInput.value =
                        "";

                    audioName.textContent =
                        "No file selected";

                    return;

                }


                if (
                    file.size >
                    50 * 1024 * 1024
                ) {

                    showMessage(
                        "MP3 must be smaller than 50 MB.",
                        "error"
                    );

                    audioInput.value =
                        "";

                    audioName.textContent =
                        "No file selected";

                    return;

                }


                audioName.textContent =
                    file.name +
                    " • " +
                    formatSize(
                        file.size
                    );


                showMessage(
                    "MP3 selected successfully.",
                    "success"
                );

            }
        );

    }


    // =========================================================
    // COVER SELECTION
    // =========================================================

    if (coverInput) {

        coverInput.addEventListener(
            "change",
            function () {

                if (
                    !coverInput.files ||
                    !coverInput.files.length
                ) {

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
                        "Please select JPG, PNG or WEBP.",
                        "error"
                    );

                    coverInput.value =
                        "";

                    coverName.textContent =
                        "No image selected";

                    return;

                }


                if (
                    file.size >
                    10 * 1024 * 1024
                ) {

                    showMessage(
                        "Cover image must be smaller than 10 MB.",
                        "error"
                    );

                    coverInput.value =
                        "";

                    coverName.textContent =
                        "No image selected";

                    return;

                }


                coverName.textContent =
                    file.name +
                    " • " +
                    formatSize(
                        file.size
                    );


                // =================================================
                // COVER PREVIEW
                // =================================================

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        if (
                            coverPreviewImage
                        ) {

                            coverPreviewImage.src =
                                event.target.result;

                        }


                        if (
                            coverPreview
                        ) {

                            coverPreview.style.display =
                                "block";

                        }

                    };


                reader.readAsDataURL(
                    file
                );


                showMessage(
                    "Cover artwork selected successfully.",
                    "success"
                );

            }
        );

    }


    // =========================================================
    // FORM SUBMISSION
    // =========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // -------------------------------------------------
            // GET FORM VALUES
            // -------------------------------------------------

            const titleElement =
                document.getElementById(
                    "songTitle"
                );

            const artistElement =
                document.getElementById(
                    "artistName"
                );

            const genreElement =
                document.getElementById(
                    "genre"
                );

            const yearElement =
                document.getElementById(
                    "releaseYear"
                );

            const descriptionElement =
                document.getElementById(
                    "songDescription"
                );


            const title =
                titleElement
                    ? titleElement.value.trim()
                    : "";


            const artistName =
                artistElement
                    ? artistElement.value.trim()
                    : "";


            const genre =
                genreElement
                    ? genreElement.value
                    : "";


            const releaseYear =
                yearElement
                    ? yearElement.value
                    : "";


            const description =
                descriptionElement
                    ? descriptionElement.value.trim()
                    : "";


            const audioFile =
                audioInput &&
                audioInput.files.length
                    ? audioInput.files[0]
                    : null;


            const coverFile =
                coverInput &&
                coverInput.files.length
                    ? coverInput.files[0]
                    : null;


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!title) {

                showMessage(
                    "Please enter the song title.",
                    "error"
                );

                return;

            }


            if (!artistName) {

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
                    "Please choose cover artwork.",
                    "error"
                );

                return;

            }


            if (
                agreement &&
                !agreement.checked
            ) {

                showMessage(
                    "Please confirm that you have permission to upload this music.",
                    "error"
                );

                return;

            }


            // -------------------------------------------------
            // DISABLE BUTTON
            // -------------------------------------------------

            uploadButton.disabled =
                true;

            uploadButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> UPLOADING...';


            try {


                // =================================================
                // CREATE UNIQUE FILE NAME
                // =================================================

                const uniqueId =
                    Date.now() +
                    "-" +
                    Math.random()
                        .toString(36)
                        .substring(2, 10);


                function cleanName(
                    value
                ) {

                    return value
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9]+/g,
                            "-"
                        )
                        .replace(
                            /^-+|-+$/g,
                            ""
                        );

                }


                const safeArtist =
                    cleanName(
                        artistName
                    );


                const safeTitle =
                    cleanName(
                        title
                    );


                // =================================================
                // MP3 PATH
                // =================================================

                const audioPath =
                    uniqueId +
                    "-" +
                    safeArtist +
                    "-" +
                    safeTitle +
                    ".mp3";


                // =================================================
                // COVER PATH
                // =================================================

                let extension =
                    "jpg";


                if (
                    coverFile.type ===
                    "image/png"
                ) {

                    extension =
                        "png";

                }


                if (
                    coverFile.type ===
                    "image/webp"
                ) {

                    extension =
                        "webp";

                }


                const coverPath =
                    uniqueId +
                    "-" +
                    safeArtist +
                    "-" +
                    safeTitle +
                    "." +
                    extension;



                // =================================================
                // UPLOAD MP3
                // =================================================

                showMessage(
                    "Uploading your MP3...",
                    "success"
                );


                const {
                    error:
                    audioError
                } =
                    await window
                        .mbzedSupabase
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
                    error:
                    coverError
                } =
                    await window
                        .mbzedSupabase
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


                    await window
                        .mbzedSupabase
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

                const audioPublic =
                    window
                        .mbzedSupabase
                        .storage
                        .from("music")
                        .getPublicUrl(
                            audioPath
                        );


                const coverPublic =
                    window
                        .mbzedSupabase
                        .storage
                        .from("covers")
                        .getPublicUrl(
                            coverPath
                        );


                const audioUrl =
                    audioPublic
                        .data
                        .publicUrl;


                const coverUrl =
                    coverPublic
                        .data
                        .publicUrl;



                // =================================================
                // SAVE TO SONGS TABLE
                // =================================================

                showMessage(
                    "Saving song information...",
                    "success"
                );


                /*
                 * IMPORTANT:
                 *
                 * Your table uses:
                 *
                 * id
                 * user_id
                 * title
                 * artist_name
                 * genre
                 * release_year
                 * description
                 * audio_url
                 * cover_url
                 * created_at
                 *
                 * Therefore we use artist_name,
                 * NOT artist.
                 */


                const {
                    data:
                    songData,

                    error:
                    databaseError
                } =
                    await window
                        .mbzedSupabase
                        .from("songs")
                        .insert({

                            title:
                                title,

                            artist_name:
                                artistName,

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
                    // saving fails.

                    await window
                        .mbzedSupabase
                        .storage
                        .from("music")
                        .remove([
                            audioPath
                        ]);


                    await window
                        .mbzedSupabase
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
                    "MBZEDMUSIC SONG UPLOADED:",
                    songData
                );


                showMessage(
                    "🎉 Your music was uploaded successfully!",
                    "success"
                );


                uploadButton.innerHTML =
                    '<i class="fa-solid fa-check"></i> UPLOADED';


                // Reset form

                form.reset();


                if (audioName) {

                    audioName.textContent =
                        "No file selected";

                }


                if (coverName) {

                    coverName.textContent =
                        "No image selected";

                }


                if (
                    coverPreviewImage
                ) {

                    coverPreviewImage.src =
                        "";

                }


                if (
                    coverPreview
                ) {

                    coverPreview.style.display =
                        "none";

                }


                // Restore button

                setTimeout(
                    function () {

                        uploadButton.disabled =
                            false;

                        uploadButton.innerHTML =
                            '<i class="fa-solid fa-cloud-arrow-up"></i> <span>UPLOAD MUSIC</span>';

                    },
                    4000
                );


            } catch (error) {


                console.error(
                    "MBZEDMUSIC ERROR:",
                    error
                );


                showMessage(
                    error.message ||
                    "Upload failed. Please try again.",
                    "error"
                );


                uploadButton.disabled =
                    false;


                uploadButton.innerHTML =
                    '<i class="fa-solid fa-cloud-arrow-up"></i> <span>UPLOAD MUSIC</span>';

            }

        }
    );


    console.log(
        "MBZEDMUSIC upload system ready."
    );

}

// ==========================================
// MBZEDMUSIC.COM
// MUSIC UPLOAD SYSTEM
// ==========================================


// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://uutfftxqupzxqfmcryqg.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OkdehmxLBiy8BIn4iuWaQw_OgqwMu7h";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// ELEMENTS
// ==========================================

const uploadForm =
    document.getElementById("uploadForm");

const uploadFields =
    document.getElementById("uploadFields");

const accountBox =
    document.getElementById("accountBox");

const accountMessage =
    document.getElementById("accountMessage");

const uploadStatus =
    document.getElementById("uploadStatus");

const successBox =
    document.getElementById("successBox");

const submitButton =
    document.getElementById("submitButton");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const signUpButton =
    document.getElementById("signUpButton");

const loginButton =
    document.getElementById("loginButton");

const musicFile =
    document.getElementById("musicFile");

const coverFile =
    document.getElementById("coverFile");

const musicFileName =
    document.getElementById("musicFileName");

const coverFileName =
    document.getElementById("coverFileName");

const coverPreview =
    document.getElementById("coverPreview");


// ==========================================
// CHECK LOGIN
// ==========================================

async function checkUser() {

    const {
        data: {
            user
        }
    } = await supabaseClient.auth.getUser();


    if (user) {

        enableUpload(user);

    } else {

        disableUpload();

    }

}


// ==========================================
// ENABLE UPLOAD
// ==========================================

function enableUpload(user) {

    uploadFields.disabled = false;

    accountBox.classList.add("logged-in");

    accountMessage.textContent =
        "Logged in as " + user.email;

    accountMessage.className =
        "account-message success";

}


// ==========================================
// DISABLE UPLOAD
// ==========================================

function disableUpload() {

    uploadFields.disabled = true;

    accountMessage.textContent =
        "Please create an account or login before uploading.";

}


// ==========================================
// CREATE ACCOUNT
// ==========================================

signUpButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            showAccountMessage(
                "Please enter your email and password.",
                "error"
            );

            return;

        }


        if (password.length < 6) {

            showAccountMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;

        }


        signUpButton.disabled = true;

        signUpButton.textContent =
            "CREATING...";


        const {
            data,
            error
        } = await supabaseClient.auth.signUp({

            email: email,

            password: password

        });


        signUpButton.disabled = false;

        signUpButton.textContent =
            "CREATE ACCOUNT";


        if (error) {

            showAccountMessage(
                error.message,
                "error"
            );

            return;

        }


        if (
            data.user &&
            data.session
        ) {

            enableUpload(data.user);

            showAccountMessage(
                "Account created successfully.",
                "success"
            );

        } else {

            showAccountMessage(
                "Account created. Check your email to confirm your account, then login.",
                "success"
            );

        }

    }
);


// ==========================================
// LOGIN
// ==========================================

loginButton.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        if (!email || !password) {

            showAccountMessage(
                "Please enter your email and password.",
                "error"
            );

            return;

        }


        loginButton.disabled = true;

        loginButton.textContent =
            "LOGGING IN...";


        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        loginButton.disabled = false;

        loginButton.textContent =
            "LOGIN";


        if (error) {

            showAccountMessage(
                error.message,
                "error"
            );

            return;

        }


        enableUpload(data.user);


        showAccountMessage(
            "Login successful. You can now upload your music.",
            "success"
        );

    }
);


// ==========================================
// ACCOUNT MESSAGE
// ==========================================

function showAccountMessage(
    message,
    type
) {

    accountMessage.textContent =
        message;

    accountMessage.className =
        "account-message " + type;

}


// ==========================================
// MUSIC FILE
// ==========================================

musicFile.addEventListener(
    "change",
    function () {

        if (!musicFile.files.length) {

            musicFileName.textContent =
                "Choose MP3 File";

            return;

        }


        const file =
            musicFile.files[0];


        if (
            file.type !==
            "audio/mpeg"
        ) {

            musicFile.value = "";

            musicFileName.textContent =
                "Choose MP3 File";

            showUploadMessage(
                "Please select an MP3 audio file.",
                "error"
            );

            return;

        }


        musicFileName.textContent =
            file.name;

    }
);


// ==========================================
// COVER FILE
// ==========================================

coverFile.addEventListener(
    "change",
    function () {

        if (!coverFile.files.length) {

            coverFileName.textContent =
                "Choose Cover Image";

            return;

        }


        const file =
            coverFile.files[0];


        if (!file.type.startsWith("image/")) {

            coverFile.value = "";

            coverFileName.textContent =
                "Choose Cover Image";

            showUploadMessage(
                "Please select a JPG, PNG or WebP image.",
                "error"
            );

            return;

        }


        coverFileName.textContent =
            file.name;


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                coverPreview.innerHTML = `
                    <img
                        src="${event.target.result}"
                        alt="Cover preview"
                    >
                `;

            };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// UPLOAD FORM
// ==========================================

uploadForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const {
            data: {
                user
            }
        } = await supabaseClient.auth.getUser();


        if (!user) {

            showUploadMessage(
                "Please login before uploading.",
                "error"
            );

            return;

        }


        const title =
            document.getElementById(
                "songTitle"
            ).value.trim();


        const artistName =
            document.getElementById(
                "artistName"
            ).value.trim();


        const genre =
            document.getElementById(
                "genre"
            ).value;


        const releaseYear =
            document.getElementById(
                "releaseYear"
            ).value;


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const audio =
            musicFile.files[0];


        const cover =
            coverFile.files[0];


        if (!title) {

            showUploadMessage(
                "Please enter the song title.",
                "error"
            );

            return;

        }


        if (!artistName) {

            showUploadMessage(
                "Please enter the artist name.",
                "error"
            );

            return;

        }


        if (!genre) {

            showUploadMessage(
                "Please select a genre.",
                "error"
            );

            return;

        }


        if (!audio) {

            showUploadMessage(
                "Please select your MP3 file.",
                "error"
            );

            return;

        }


        if (!cover) {

            showUploadMessage(
                "Please select your cover artwork.",
                "error"
            );

            return;

        }


        submitButton.disabled = true;

        submitButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            UPLOADING...
        `;


        showUploadMessage(
            "Uploading your music. Please wait...",
            "loading"
        );


        try {

            // ==================================
            // CREATE UNIQUE FILE NAMES
            // ==================================

            const audioExtension =
                getExtension(audio.name);


            const coverExtension =
                getExtension(cover.name);


            const audioPath =
                user.id +
                "/" +
                crypto.randomUUID() +
                "." +
                audioExtension;


            const coverPath =
                user.id +
                "/" +
                crypto.randomUUID() +
                "." +
                coverExtension;


            // ==================================
            // UPLOAD MP3
            // ==================================

            const {
                error: audioError
            } = await supabaseClient
                .storage
                .from("songs")
                .upload(
                    audioPath,
                    audio,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: audio.type
                    }
                );


            if (audioError) {

                throw audioError;

            }


            // ==================================
            // UPLOAD COVER
            // ==================================

            const {
                error: coverError
            } = await supabaseClient
                .storage
                .from("covers")
                .upload(
                    coverPath,
                    cover,
                    {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: cover.type
                    }
                );


            if (coverError) {

                throw coverError;

            }


            // ==================================
            // GET AUDIO URL
            // ==================================

            const {
                data: audioData
            } = supabaseClient
                .storage
                .from("songs")
                .getPublicUrl(audioPath);


            const audioUrl =
                audioData.publicUrl;


            // ==================================
            // GET COVER URL
            // ==================================

            const {
                data: coverData
            } = supabaseClient
                .storage
                .from("covers")
                .getPublicUrl(coverPath);


            const coverUrl =
                coverData.publicUrl;


            // ==================================
            // SAVE SONG INFORMATION
            // ==================================

            const {
                error: databaseError
            } = await supabaseClient
                .from("songs")
                .insert({

                    user_id: user.id,

                    title: title,

                    artist_name: artistName,

                    genre: genre,

                    release_year:
                        releaseYear
                            ? Number(releaseYear)
                            : null,

                    description:
                        description || null,

                    audio_url: audioUrl,

                    cover_url: coverUrl

                });


            if (databaseError) {

                throw databaseError;

            }


            // ==================================
            // SUCCESS
            // ==================================

            uploadForm.style.display =
                "none";

            accountBox.style.display =
                "none";

            successBox.classList.add(
                "show"
            );


        } catch (error) {

            console.error(
                "Upload error:",
                error
            );


            showUploadMessage(
                "Upload failed: " +
                error.message,
                "error"
            );


            submitButton.disabled =
                false;


            submitButton.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                UPLOAD MUSIC
            `;

        }

    }
);


// ==========================================
// FILE EXTENSION
// ==========================================

function getExtension(filename) {

    const parts =
        filename.split(".");


    return parts.length > 1
        ? parts.pop().toLowerCase()
        : "file";

}


// ==========================================
// UPLOAD MESSAGE
// ==========================================

function showUploadMessage(
    message,
    type
) {

    uploadStatus.textContent =
        message;

    uploadStatus.className =
        "upload-status " + type;

}


// ==========================================
// AUTH STATE
// ==========================================

supabaseClient.auth.onAuthStateChange(
    function (event, session) {

        if (session?.user) {

            enableUpload(
                session.user
            );

        } else {

            disableUpload();

        }

    }
);


// ==========================================
// START
// ==========================================

checkUser();

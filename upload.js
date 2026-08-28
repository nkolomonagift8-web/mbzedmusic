document.addEventListener("DOMContentLoaded", function () {

    const uploadForm = document.getElementById("musicUploadForm");

    const audioFile = document.getElementById("audioFile");
    const coverImage = document.getElementById("coverImage");

    const audioFileName = document.getElementById("audioFileName");
    const coverFileName = document.getElementById("coverFileName");

    const audioFileStatus = document.getElementById("audioFileStatus");

    const coverPreview = document.getElementById("coverPreview");
    const coverPreviewImage = document.getElementById("coverPreviewImage");

    const uploadMessage = document.getElementById("uploadMessage");
    const uploadSubmit = document.getElementById("uploadSubmit");


    /* =========================================
       MP3 FILE SELECTION
    ========================================= */

    if (audioFile) {

        audioFile.addEventListener("change", function () {

            if (!audioFile.files || audioFile.files.length === 0) {

                audioFileName.textContent = "No file selected";

                if (audioFileStatus) {
                    audioFileStatus.textContent = "";
                }

                return;
            }

            const file = audioFile.files[0];

            audioFileName.textContent = file.name;


            /* Check file type */

            const validAudio =
                file.type === "audio/mpeg" ||
                file.name.toLowerCase().endsWith(".mp3");


            if (!validAudio) {

                audioFileStatus.textContent =
                    "Please choose an MP3 audio file.";

                audioFileStatus.classList.add("error");

                audioFile.value = "";

                audioFileName.textContent =
                    "No file selected";

                return;
            }


            /* Check file size */

            const maxAudioSize = 50 * 1024 * 1024;


            if (file.size > maxAudioSize) {

                audioFileStatus.textContent =
                    "MP3 file is too large. Maximum size is 50 MB.";

                audioFileStatus.classList.add("error");

                audioFile.value = "";

                audioFileName.textContent =
                    "No file selected";

                return;
            }


            audioFileStatus.textContent =
                "MP3 file selected successfully.";

            audioFileStatus.classList.remove("error");

        });

    }



    /* =========================================
       COVER IMAGE SELECTION
    ========================================= */

    if (coverImage) {

        coverImage.addEventListener("change", function () {

            if (!coverImage.files || coverImage.files.length === 0) {

                coverFileName.textContent =
                    "No image selected";

                if (coverPreview) {
                    coverPreview.classList.remove("show");
                }

                return;
            }

            const file = coverImage.files[0];

            coverFileName.textContent =
                file.name;


            /* Check image type */

            const validImageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (!validImageTypes.includes(file.type)) {

                showMessage(
                    "Please choose a JPG, PNG or WEBP image.",
                    "error"
                );

                coverImage.value = "";

                coverFileName.textContent =
                    "No image selected";

                return;
            }


            /* Check image size */

            const maxImageSize = 10 * 1024 * 1024;


            if (file.size > maxImageSize) {

                showMessage(
                    "Cover image is too large. Maximum size is 10 MB.",
                    "error"
                );

                coverImage.value = "";

                coverFileName.textContent =
                    "No image selected";

                return;
            }


            /* Show preview */

            const reader = new FileReader();


            reader.onload = function (event) {

                if (coverPreviewImage) {

                    coverPreviewImage.src =
                        event.target.result;

                }


                if (coverPreview) {

                    coverPreview.classList.add("show");

                }

            };


            reader.readAsDataURL(file);

        });

    }



    /* =========================================
       MESSAGE FUNCTION
    ========================================= */

    function showMessage(message, type) {

        if (!uploadMessage) {
            return;
        }

        uploadMessage.textContent =
            message;

        uploadMessage.className =
            "upload-message " + type;

    }



    /* =========================================
       FORM SUBMISSION
    ========================================= */

    if (uploadForm) {

        uploadForm.addEventListener("submit", function (event) {

            event.preventDefault();


            /* Clear previous message */

            showMessage("", "");


            /* Get fields */

            const songTitle =
                document.getElementById("songTitle");

            const artistName =
                document.getElementById("artistName");

            const genre =
                document.getElementById("genre");

            const copyrightAgreement =
                document.getElementById(
                    "copyrightAgreement"
                );


            /* Check title */

            if (!songTitle ||
                songTitle.value.trim() === "") {

                showMessage(
                    "Please enter the song title.",
                    "error"
                );

                songTitle.focus();

                return;
            }


            /* Check artist */

            if (!artistName ||
                artistName.value.trim() === "") {

                showMessage(
                    "Please enter the artist name.",
                    "error"
                );

                artistName.focus();

                return;
            }


            /* Check genre */

            if (!genre ||
                genre.value === "") {

                showMessage(
                    "Please select a genre.",
                    "error"
                );

                genre.focus();

                return;
            }


            /* Check MP3 */

            if (!audioFile ||
                !audioFile.files ||
                audioFile.files.length === 0) {

                showMessage(
                    "Please choose your MP3 file.",
                    "error"
                );

                return;
            }


            /* Check cover */

            if (!coverImage ||
                !coverImage.files ||
                coverImage.files.length === 0) {

                showMessage(
                    "Please choose your cover artwork.",
                    "error"
                );

                return;
            }


            /* Check agreement */

            if (!copyrightAgreement ||
                !copyrightAgreement.checked) {

                showMessage(
                    "Please confirm that you have permission to upload this music and artwork.",
                    "error"
                );

                return;
            }


            /*
             * At this stage we are only preparing
             * and validating the upload form.
             *
             * Supabase upload will be connected
             * in the next step.
             */


            if (uploadSubmit) {

                uploadSubmit.disabled = true;

                uploadSubmit.innerHTML =
                    '<i class="fa-solid fa-check"></i> READY TO UPLOAD';

            }


            showMessage(
                "Your music information and files are ready. Supabase upload will be connected next.",
                "success"
            );


            /*
             * Keep the button disabled briefly so
             * the user can see the confirmation.
             */

            setTimeout(function () {

                if (uploadSubmit) {

                    uploadSubmit.disabled = false;

                    uploadSubmit.innerHTML =
                        '<i class="fa-solid fa-cloud-arrow-up"></i> <span>UPLOAD MUSIC</span>';

                }

            }, 3000);

        });

    }



    /* =========================================
       NEWSLETTER
    ========================================= */

    const newsletterForm =
        document.getElementById("newsletterForm");


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const email =
                    newsletterForm.querySelector(
                        'input[type="email"]'
                    );


                if (!email ||
                    email.value.trim() === "") {

                    return;

                }


                alert(
                    "Thank you for subscribing to Mbzedmusic.com!"
                );


                newsletterForm.reset();

            }
        );

    }



    /* =========================================
       DRAG & DROP FOR MP3
    ========================================= */

    const audioUploadBox =
        document.querySelector(
            'label[for="audioFile"]'
        );


    if (audioUploadBox && audioFile) {

        audioUploadBox.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                audioUploadBox.classList.add(
                    "dragging"
                );

            }
        );


        audioUploadBox.addEventListener(
            "dragleave",
            function () {

                audioUploadBox.classList.remove(
                    "dragging"
                );

            }
        );


        audioUploadBox.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                audioUploadBox.classList.remove(
                    "dragging"
                );


                const files =
                    event.dataTransfer.files;


                if (!files || files.length === 0) {
                    return;
                }


                /*
                 * Put the dropped file into
                 * the file input.
                 */

                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(
                        files[0]
                    );

                    audioFile.files =
                        dataTransfer.files;

                    audioFile.dispatchEvent(
                        new Event("change")
                    );

                } catch (error) {

                    console.log(
                        "Drag and drop is not supported by this browser."
                    );

                }

            }
        );

    }



    /* =========================================
       DRAG & DROP FOR COVER
    ========================================= */

    const coverUploadBox =
        document.querySelector(
            'label[for="coverImage"]'
        );


    if (coverUploadBox && coverImage) {

        coverUploadBox.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                coverUploadBox.classList.add(
                    "dragging"
                );

            }
        );


        coverUploadBox.addEventListener(
            "dragleave",
            function () {

                coverUploadBox.classList.remove(
                    "dragging"
                );

            }
        );


        coverUploadBox.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                coverUploadBox.classList.remove(
                    "dragging"
                );


                const files =
                    event.dataTransfer.files;


                if (!files || files.length === 0) {
                    return;
                }


                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(
                        files[0]
                    );

                    coverImage.files =
                        dataTransfer.files;

                    coverImage.dispatchEvent(
                        new Event("change")
                    );

                } catch (error) {

                    console.log(
                        "Drag and drop is not supported by this browser."
                    );

                }

            }
        );

    }



    /* =========================================
       CONSOLE MESSAGE
    ========================================= */

    console.log(
        "Mbzedmusic upload system loaded successfully."
    );

});

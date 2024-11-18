document.addEventListener("DOMContentLoaded", () => {
    loadBookmarks();

    // Attach oninput event listeners to inputs for real-time validation
    document
        .getElementById("siteName")
        .addEventListener("input", validateSiteName);
    document.getElementById("siteUrl").addEventListener("input", validateSiteUrl);
});

// Load bookmarks from local storage and display them on page load
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    displayBookmarks(bookmarks);
}

// Function to add a bookmark
function addBookmark() {
    const siteName = document.getElementById("siteName").value.trim();
    const siteUrl = document.getElementById("siteUrl").value.trim();

    // Perform validations
    const isSiteNameValid = validateSiteName();
    const isSiteUrlValid = validateSiteUrl();

    // Show popup message if validation fails
    if (!isSiteNameValid || !isSiteUrlValid) {
        let message = "Please correct the following errors:\n";
        if (!isSiteNameValid)
            message += "- Site name must be at least 3 characters long.\n";
        if (!isSiteUrlValid)
            message += "- Site URL must start with 'http://' or 'https://'.";
        showPopup(message);
        return; // Stop execution if validations fail
    }

    // Add the bookmark if both validations pass
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks.push({ name: siteName, url: siteUrl });
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Refresh the bookmarks table and reset input fields
    displayBookmarks(bookmarks);
    document.getElementById("siteName").value = "";
    document.getElementById("siteUrl").value = "";
    clearValidationClasses();
}

// Function to clear validation classes after successful submission
function clearValidationClasses() {
    document
        .getElementById("siteName")
        .classList.remove("is-valid", "is-invalid");
    document.getElementById("siteUrl").classList.remove("is-valid", "is-invalid");
}

// Function to display bookmarks in the table
function displayBookmarks(bookmarks) {
    const tableBody = document
        .getElementById("bookmarkTable")
        .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    bookmarks.forEach((bookmark, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${bookmark.name}</td>
                        <td>
                                <a href="${
                                    bookmark.url
                                }" target="_blank" class="btn btn-warning">
                                        <i class="fas fa-external-link-alt"></i> Visit
                                </a>
                        </td>
                        <td>
                                <button class="btn btn-danger" onclick="deleteBookmark(${index})">
                                        <i class="fas fa-trash-alt"></i> Delete
                                </button>
                        </td>
                `;
    });
}
// Function to delete a bookmark with confirmation
function deleteBookmark(index) {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || []; // Retrieve bookmarks

  // Show confirmation alert using SweetAlert
    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d12121",
    cancelButtonColor: "#fec260",
    confirmButtonText: "Yes, delete it!",
    }).then((result) => {
    if (result.isConfirmed) {
      // If the user confirms, delete the bookmark
      bookmarks.splice(index, 1); // Remove the selected bookmark
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); // Save updated bookmarks
      displayBookmarks(bookmarks); // Refresh the bookmark list

      // Show success message
        Swal.fire({
        title: "Deleted!",
        text: "Your bookmark has been deleted.",
        icon: "success",
        });
    }
    });
}

// Real-time validation for site name
function validateSiteName() {
    const siteName = document.getElementById("siteName").value.trim();
    const siteNameInput = document.getElementById("siteName");
    const siteNameError = document.getElementById("siteNameError");

    if (siteName.length < 3) {
        siteNameError.textContent = "Site name must be at least 3 characters long.";
        siteNameInput.classList.add("is-invalid");
        siteNameInput.classList.remove("is-valid");
        return false;
    } else {
        siteNameError.textContent = ""; // Clear the error message
        siteNameInput.classList.add("is-valid");
        siteNameInput.classList.remove("is-invalid");
        return true;
    }
}

// Real-time validation for site URL
function validateSiteUrl() {
    const siteUrl = document.getElementById("siteUrl").value.trim();
    const siteUrlInput = document.getElementById("siteUrl");
    const siteUrlError = document.getElementById("siteUrlError");
    const urlPattern =
        /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

    if (!urlPattern.test(siteUrl)) {
        siteUrlError.textContent =
            "Please enter a valid URL starting with 'http://' or 'https://'.";
        siteUrlInput.classList.add("is-invalid");
        siteUrlInput.classList.remove("is-valid");
        return false;
    } else {
        siteUrlError.textContent = ""; // Clear the error message
        siteUrlInput.classList.add("is-valid");
        siteUrlInput.classList.remove("is-invalid");
        return true;
    }
}

// Show popup message
function showPopup(message) {
    const popupMessage = document.getElementById("popupMessage");
    const popupMessageText = document.getElementById("popupMessageText");
    popupMessageText.textContent = message;
    popupMessage.style.display = "block";
    setTimeout(closePopup, 3000); // Automatically hide the popup after 3 seconds
}

// Hide the popup message
function closePopup() {
    document.getElementById("popupMessage").style.display = "none";
}

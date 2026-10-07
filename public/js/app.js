const editSection = document.getElementById("editSection");
const editUserForm = document.getElementById("editUserForm");
const editId = document.getElementById("editId");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editAge = document.getElementById("editAge");
const cancelEdit = document.getElementById("cancelEdit");

const userForm = document.getElementById("userForm");
const usersList = document.getElementById("usersList");

// Load users when the page opens
loadUsers();


// Add user
userForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = document.getElementById("age").value;

    const userData = {
        name: name,
        email: email,
        age: age ? Number(age) : undefined
    };

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add user");
        }

        alert("User added successfully!");

        userForm.reset();

        loadUsers();

    } catch (error) {
        console.error("Error adding user:", error);

        alert("Error adding user: " + error.message);
    }
});


// Load users
async function loadUsers() {
    try {
        usersList.innerHTML = "<p>Loading users...</p>";

        const response = await fetch("/api/users");

        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.error || "Failed to load users");
        }

        usersList.innerHTML = "";

        if (users.length === 0) {
            usersList.innerHTML = "<p>No users found.</p>";
            return;
        }

        users.forEach(function (user) {

            const userCard = document.createElement("div");

            userCard.className = "user-card";

            userCard.innerHTML = `
                <h3>${user.name}</h3>

                <p>
                    <strong>Email:</strong> ${user.email}
                </p>

                <p>
                    <strong>Age:</strong> ${user.age || "Not provided"}
                </p>

                <button
                    class="edit-btn"
                    onclick="editUser(
                        '${user._id}',
                        '${escapeValue(user.name)}',
                        '${escapeValue(user.email)}',
                        '${user.age || ""}'
                    )">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteUser('${user._id}')">
                    Delete
                </button>
            `;

            usersList.appendChild(userCard);
        });

    } catch (error) {
        console.error("Error loading users:", error);

        usersList.innerHTML = `
            <p>Unable to load users.</p>
            <p>${error.message}</p>
        `;
    }
}


// Escape values used inside onclick
function escapeValue(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// Show edit form
function editUser(id, currentName, currentEmail, currentAge) {

    editSection.style.display = "block";

    editId.value = id;
    editName.value = currentName;
    editEmail.value = currentEmail;
    editAge.value = currentAge || "";

    editSection.scrollIntoView({
        behavior: "smooth"
    });
}


// Save edited user
editUserForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = editId.value;
    const name = editName.value.trim();
    const email = editEmail.value.trim();
    const age = editAge.value;

    const userData = {
        name: name,
        email: email,
        age: age ? Number(age) : undefined
    };

    try {

        const response = await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update user");
        }

        alert("User updated successfully!");

        // Hide edit form
        editSection.style.display = "none";

        // Clear edit form
        editUserForm.reset();

        // Reload users
        loadUsers();

    } catch (error) {

        console.error("Error updating user:", error);

        alert("Error updating user: " + error.message);
    }
});


// Cancel editing
cancelEdit.addEventListener("click", function () {

    editUserForm.reset();

    editSection.style.display = "none";
});


// Delete user
async function deleteUser(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`/api/users/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to delete user");
        }

        alert("User deleted successfully!");

        loadUsers();

    } catch (error) {

        console.error("Error deleting user:", error);

        alert("Error deleting user: " + error.message);
    }
}
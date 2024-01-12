function submit() {
    const name = document.getElementById('name').value;

    if (!name) {
        showSnackbar("Please type your name");
        return;
    }

    if (/\d/.test(name)) {
        showSnackbar("Sorry but your name must not contain numbers");
        return;
    }

    fetchAPI(name);
}

function fetchAPI(name) {
    const url = `https://api.genderize.io/?name=${name}`;

    fetch(url)
        .then(response => response.json())
        .then(data => handleFetchResponse(data))
        .catch(console.error);

    const savedGender = searchInLocalStorage();
    if (savedGender) {
        updateSavedGender(savedGender);
    }
}

function handleFetchResponse(data) {
    const snackbar = document.getElementById("snackbar");

    if (data.gender === null) {
        showSnackbar("Sorry but this name does not exist");
    } else {
        displayGenderInfo(data.gender, data.probability);
    }
}

function searchInLocalStorage() {
    const name = document.getElementById('name').value;

    for (let i = 0, len = localStorage.length; i < len; i++) {
        const key = localStorage.key(i);
        const value = localStorage[key];

        if (key === name) {
            return value;
        }
    }

    return null;
}

function displayGenderInfo(gender, probability) {
    const genderElement = document.getElementById("p-gender");
    const probabilityElement = document.getElementById("p-percent");

    genderElement.textContent = gender;
    probabilityElement.textContent = probability;
    document.getElementById('prediction').style.display = 'flex';

    const savedGender = searchInLocalStorage();
    if (savedGender) {
        updateSavedGender(savedGender);
    }
}

function updateSavedGender(savedGender) {
    const savedGenderElement = document.getElementById("s-gender");

    localStorage.removeItem(name);
    localStorage.setItem(name, savedGender);
    savedGenderElement.textContent = savedGender;
    document.getElementById('saved').style.display = 'flex';
}

function save() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');

    if (!selectedGender) {
        showSnackbar("Please select a gender");
        return;
    }

    const name = document.getElementById('name').value;
    const gender = selectedGender.value;

    if (!name) {
        showSnackbar("Please type your name");
        return;
    }

    if (/\d/.test(name)) {
        showSnackbar("Sorry but your name must not contain numbers");
        return;
    }

    if (searchInLocalStorage()) {
        updateSavedGender(gender);
    } else {
        localStorage.setItem(name, gender);
        document.getElementById('saved').style.display = 'flex';
        document.getElementById("s-gender").textContent = gender;
    }
}

function clean() {
    const name = document.getElementById('name').value;
    localStorage.removeItem(name);
    document.getElementById('saved').style.display = 'none';
}

function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = "show";

    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, 5000);
}

const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const inputSearch = document.getElementById("search");
const contentArea = document.querySelector(".main-content");
const cards = document.getElementById("cards");

function resetHomeView() {
    if (!contentArea) return;
    cards.innerHTML = "";
    contentArea.classList.remove("hidden");
    contentArea.classList.add("visible");
    cards.classList.add("hidden")
}

function showCards(searchResult) {
    if (!cards) return;
    cards.innerHTML = "";
    
    cards.classList.add("visible");
    cards.classList.remove("hidden");


    if (!contentArea) return;
    contentArea.classList.remove("visible");
    contentArea.classList.add("hidden");

    searchResult.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("recommandation-card");

        card.innerHTML = `
            <img src="images/${item.imageUrl}" alt="${item.name}" class="card-image">
            <div class="card-body">
                <h3 class="card-title">${item.name}</h3>
                <p class="card-description">${item.description}</p>
            </div>
        `;

        cards.appendChild(card);
    });
}

function findSearchResults(data, searchRequest) {
    const normalizedSearch = searchRequest.trim().toLowerCase();

    if (!normalizedSearch) {
        return [];
    }

    if (normalizedSearch === "country" || normalizedSearch === "countries") {
        return data.countries.flatMap(country => country.cities || []);
    }

    if (normalizedSearch === "temple" || normalizedSearch === "temples") {
        return data.temples || [];
    }

    if (normalizedSearch === "beach" || normalizedSearch === "beaches") {
        return data.beaches || [];
    }

    const countryFound = data.countries.find(country => country.name.toLowerCase() === normalizedSearch)
        || data.countries.find(country => country.name.toLowerCase().includes(normalizedSearch));

    return countryFound ? countryFound.cities || [] : [];
}

searchButton.addEventListener("click", () => {
    const searchRequest = inputSearch.value.trim();

    if (!searchRequest) {
        alert("Please enter a destination or keyword.");
        return;
    }

    fetch("travel_recommendation_api.json").then(response => {
        if (!response.ok) {
            throw new Error("Error when fetching");
        }
        return response.json();
    }).then(data => {
        const searchResult = findSearchResults(data, searchRequest);

        if (searchResult.length > 0) {
            showCards(searchResult);
        } else {
            cards.innerHTML = "";
            contentArea.classList.remove("hidden");
            contentArea.classList.add("visible");
            alert("Aucune recommandation trouvée pour cette recherche.");
        }
    }).catch(error => {
        console.error("Error occured: ", error);
        alert("Une erreur s'est produite lors de la recherche.");
    });
});

clearButton.addEventListener("click", () => {
    inputSearch.value = "";
    resetHomeView();
});
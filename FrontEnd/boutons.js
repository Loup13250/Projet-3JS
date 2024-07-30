// Fonction asynchrone pour récupérer les catégories et les fiches de l'API
async function recuperationApi() {
  try {
    // Récupère les catégories depuis l'API
    let response = await fetch("http://localhost:5678/api/categories");
    let categories = await response.json();

    // Récupère le conteneur de boutons
    var container = document.getElementById("button-container");

    // Crée un bouton pour toutes les catégories
    var allButton = document.createElement("button");
    allButton.innerHTML = "Tous";
    allButton.className = "button";
    allButton.onclick = function () {
      changeColor(this);
      filterGallery("all");
    };
    container.appendChild(allButton);

    // Change la couleur du bouton "Tous"
    changeColor(allButton);

    // Crée un bouton pour chaque catégorie
    for (var i = 0; i < categories.length; i++) {
      var button = document.createElement("button");
      button.innerHTML = categories[i].name;
      button.className = "button";
      button.dataset.id = categories[i].id;
      button.onclick = function () {
        changeColor(this);
        filterGallery(this.dataset.id);
      };
      container.appendChild(button);
    }

    // Récupère les fiches depuis l'API
    response = await fetch("http://localhost:5678/api/works");
    let allObjects = await response.json();

    // Affiche les fiches dans la galerie
    displayObjects(allObjects);
  } catch (error) {
    // Affiche l'erreur ( si erreur )
    console.error("Erreur:", error);
  }
}

// Appelle la fonction recuperationApi
recuperationApi();

// Fonction pour changer la couleur du bouton actif
function changeColor(button) {
  var buttons = document.getElementsByClassName("button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.backgroundColor = "#FFFFFF";
    buttons[i].style.color = "#1D6154";
  }

  button.style.backgroundColor = "#1D6154";
  button.style.color = "white";
}

// Fonction pour afficher les objets dans la galerie
function displayObjects(allObjects) {
  var gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  for (var i = 0; i < allObjects.length; i++) {
    var figure = document.createElement("figure");
    figure.className = "gallery-item category-" + allObjects[i].category.id;

    var img = document.createElement("img");
    img.src = allObjects[i].imageUrl;
    img.alt = allObjects[i].title;
    figure.appendChild(img);

    var figcaption = document.createElement("figcaption");
    figcaption.textContent = allObjects[i].title;
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  }
}

// Fonction pour filtrer la galerie en fonction de la catégorie sélectionnée
function filterGallery(categoryId) {
  var items = document.getElementsByClassName("gallery-item");

  for (var i = 0; i < items.length; i++) {
    if (
      categoryId === "all" ||
      items[i].classList.contains("category-" + categoryId)
    ) {
      items[i].style.display = "block";
    } else {
      items[i].style.display = "none";
    }
  }
}

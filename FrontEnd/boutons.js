// récupère et retourne le token stocké dans le localStorage
function obtenirToken() {
  return localStorage.getItem("token");
}

// Fonction pour créer un bouton
function createButton(name, id, container) {
  var button = document.createElement("button");
  button.innerHTML = name;
  button.className = "button";
  button.dataset.id = id; // dataset permet de stocker des données personnalisées sur des éléments HTML
  button.onclick = function () {
    changeColor(this);
    filterGallery(this.dataset.id);
  };
  container.appendChild(button);

  // Si le bouton est le bouton "Tous", changez sa couleur immédiatement
  if (name === "Tous") {
    changeColor(button);
  }
}

// Fonction asynchrone pour récupérer les catégories et les fiches de l'API
async function recuperationApi() {
  try {
    // Récupère les catégories depuis l'API
    let response = await fetch("http://localhost:5678/api/categories");
    let categories = await response.json();

    // Récupère le conteneur de boutons
    var container = document.getElementById("button-container");

    // Vérifie si l'utilisateur est connecté
    var token = await obtenirToken();
    if (!token) {
      // Crée un bouton pour toutes les catégories
      createButton("Tous", "all", container);

      // créer un bouton pour chaque catégorie dans le tableau categories et ajoute ces boutons dans un conteneur spécifié
      for (var i = 0; i < categories.length; i++) {
        createButton(categories[i].name, categories[i].id, container); //
      }

      // Déclenche un événement personnalisé indiquant que les boutons ont été créés
      var event = new CustomEvent("buttonsCreated");
      window.dispatchEvent(event);
    }

    // Récupère les titres depuis l'API
    response = await fetch("http://localhost:5678/api/works");
    let allObjects = await response.json();

    // Affiche les titres dans la galerie
    displayObjects(allObjects);

    // Filtre la galerie pour afficher tous les éléments
    filterGallery("all");
  } catch (error) {
    // Affiche l'erreur ( si erreur )
    console.error("Erreur:", error);
  }
}

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
    figure.dataset.id = allObjects[i].id; // Ajout de l'attribut data-id pour pouvoir les supprimer dans ma boite de dialog

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

// Appelle la fonction recuperationApi
recuperationApi();

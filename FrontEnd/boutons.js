document.addEventListener("DOMContentLoaded", (event) => {
  // exécute une fois que tout le contenu du document HTML a été chargé.
  var allObjects = []; // Variable globale pour stocker tous les objets

  window.onload = async function () {
    // exécute une fois que toute la page est chargé ( img script etc)
    var container = document.getElementById("button-container");

    // Ajoute le bouton "Tous"
    var allButton = document.createElement("button");
    allButton.innerHTML = "Tous";
    allButton.className = "button";
    allButton.onclick = function () {
      changeColor(this);
      filterGallery("all");
    };
    container.appendChild(allButton);

    // Change la couleur du bouton "Tous" à vert
    changeColor(allButton);

    try {
      let response = await fetch("http://localhost:5678/api/categories"); // recuperations des categories sur l'API
      let categories = await response.json();

      for (var i = 0; i < categories.length; i++) {
        var button = document.createElement("button");
        button.innerHTML = categories[i].name; // Utilise le nom comme texte du bouton
        button.className = "button";
        button.dataset.id = categories[i].id;
        button.onclick = function () {
          changeColor(this);
          filterGallery(this.dataset.id);
        };
        container.appendChild(button);
      }

      // Récupère tous les objets de l'API
      let responseObjects = await fetch("http://localhost:5678/api/works");
      allObjects = await responseObjects.json();

      // Affiche tous les objets au chargement de la page
      displayObjects();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  function changeColor(button) {
    // fonction pour la couleurs au clic des boutons
    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.backgroundColor = "#FFFFFF";
      buttons[i].style.color = "#1D6154";
    }

    button.style.backgroundColor = "#1D6154";
    button.style.color = "white";
  }

  function displayObjects() {
    var gallery = document.getElementById("gallery");
    console.log("display");
    // Efface les objets actuellement affichés
    gallery.innerHTML = "";

    // Affiche tous les objets
    for (var i = 0; i < allObjects.length; i++) {
      var figure = document.createElement("figure");
      figure.className = "gallery-item category-" + allObjects[i].category.id;

      var img = document.createElement("img");
      img.src = allObjects[i].imageUrl;
      img.alt = allObjects[i].title;
      figure.appendChild(img);
      // zfdsfsdf
      var figcaption = document.createElement("figcaption");
      figcaption.textContent = allObjects[i].title;
      figure.appendChild(figcaption);

      gallery.appendChild(figure);
    }
  }

  function filterGallery(categoryId) {
    console.log(categoryId);
    var items = document.getElementsByClassName("gallery-item");
    console.log(categoryId);

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
});

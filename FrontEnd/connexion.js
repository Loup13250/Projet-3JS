// Fonction pour obtenir le token de connexion depuis le localStorage
async function obtenirToken() {
  return localStorage.getItem("token");
}

// Fonction pour créer des éléments HTML avec des options et des styles
function creerElement(type, options = {}, styles = {}) {
  const element = document.createElement(type);
  Object.assign(element, options);
  Object.assign(element.style, styles);
  return element;
}

// Récupére les projets depuis l'API
async function recuperationProjets() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Ajouter projet à l'API
async function ajouterProjetAPI(projet) {
  const formData = new FormData();
  formData.append("image", projet.imageFile); // Ajoute le fichier image au formulaire
  formData.append("title", projet.title); // titre
  formData.append("category", projet.categoryId); //catégorie

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await obtenirToken()}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout du projet");
  }

  return await response.json(); // Retourne le projet ajouté avec son ID et les autres détails
}

// Fonction pour supprimer un projet de l'API
async function supprimerProjetAPI(projetId) {
  const response = await fetch(`http://localhost:5678/api/works/${projetId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${await obtenirToken()}`, //Bearer signifie que le jeton d’accès est utilisé pour authentifier les requêtes HTTP vers une API
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du projet");
  }
}

// Fonction principale pour gérer la connexion et le mode d'édition
async function gererConnexionEtModeEdition() {
  const token = await obtenirToken();
  const lienConnexion = document.getElementById("loginLink");
  const titreProjets = document.querySelector(".title-container h2");

  if (token) {
    // affichage logout + renvoi au click vers acceuil et déco
    lienConnexion.innerHTML = "logout";
    lienConnexion.href = "index.html";
    lienConnexion.addEventListener("click", () =>
      localStorage.removeItem("token")
    );

    document.body.style.marginTop = "90px"; // Ajuste le margin du body pour le mode édition

    // Création de la bannière de mode édition
    const banniereModeEdition = creerElement("div", {
      id: "banniereModeEdition",
    });
    banniereModeEdition.append(
      creerElement("i", { className: "fa-regular fa-pen-to-square icone" }),
      document.createTextNode(" Mode édition")
    );
    document.body.prepend(banniereModeEdition);

    // conteneur pour le lien "Modifier"
    const conteneurModifier = creerElement("span", { className: "modifier" });
    conteneurModifier.append(
      creerElement("i", { className: "fa-regular fa-pen-to-square icone" }),
      creerElement("a", { textContent: " Modifier", href: "#" })
    );
    titreProjets.appendChild(conteneurModifier);

    // Dialog Galerie Photo
    const dialog = creerElement(
      "dialog",
      {},
      {
        maxWidth: "630px",
        maxHeight: "680px",
        padding: "0 70px",
        borderRadius: "10px",
        border: "1px #808080",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }
    );
    document.body.appendChild(dialog);

    // Récupération et affichage des projets dans la boîte de dialogue
    const projets = await recuperationProjets();
    const gridContainer = creerElement(
      "div",
      {},
      {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        columnGap: "10px",
        rowGap: "30px",
      }
    );

    projets.forEach((projet) => {
      const conteneur = creerElement("div", { className: "conteneur" });
      const img = creerElement(
        "img",
        {
          src: projet.imageUrl,
          alt: projet.title,
          className: "image-projet",
        },
        { width: "80px", height: "110px" }
      );

      const btnSupprimer = creerElement("button", {
        className: "btn-supprimer",
      });
      btnSupprimer.appendChild(
        creerElement("i", {
          className: "fa-regular fa-trash-can icone-supprimer",
        })
      );

      // evénement de suppression du projet
      btnSupprimer.addEventListener("click", async () => {
        try {
          await supprimerProjetAPI(projet.id);
          conteneur.remove();
          document
            .querySelector(`.gallery-item[data-id="${projet.id}"]`)
            ?.remove();
        } catch (error) {
          console.error("Erreur lors de la suppression du projet :", error);
          alert("Erreur lors de la suppression du projet");
        }
      });

      conteneur.append(img, btnSupprimer);
      gridContainer.appendChild(conteneur);
    });

    dialog.append(
      creerElement(
        "h3",
        { textContent: "Galerie photo" },
        {
          fontSize: "26px",
          paddingTop: "50px",
          paddingBottom: "50px",
          textAlign: "center",
        }
      ),
      gridContainer
    );

    // Création du bouton "Ajouter une photo"
    const btnAjouterPhoto = creerElement(
      "button",
      { textContent: "Ajouter une photo", className: "button login-button" },
      {
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      }
    );

    // Ajout de l'événement pour afficher la boîte de dialogue d'ajout de photo
    btnAjouterPhoto.addEventListener("click", () => {
      const dialogAjoutPhoto = creerBoiteDialogueAjoutPhoto();
      dialogAjoutPhoto.showModal();
    });

    const separateur = creerElement(
      "hr",
      {},
      { marginTop: "30px", marginBottom: "30px" }
    );

    dialog.append(separateur, btnAjouterPhoto);

    conteneurModifier
      .querySelector("a")
      .addEventListener("click", () => dialog.showModal());
    window.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    // Gestion de la déconnexion
    lienConnexion.addEventListener("click", () => {
      document.body.removeChild(banniereModeEdition);
      document.body.style.marginTop = "0";
      titreProjets.removeChild(conteneurModifier);
      document.body.removeChild(dialog);
    });
  }
  if (!token) {
    document.body.style.marginTop = "0";
  }
}

// boîte de dialog ajout d'une photo
function creerBoiteDialogueAjoutPhoto() {
  const dialogAjoutPhoto = creerElement(
    "dialog",
    {},

    {
      width: "630px",
      height: "680px",
      padding: "0 70px",
      borderRadius: "10px",
      border: "1px #808080",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "hidden",
    }
  );

  const titre = creerElement(
    "h3",
    { textContent: "Ajout photo" },
    {
      fontSize: "26px",
      textAlign: "center",
      padding: "50px",
    }
  );

  const encadrementPhoto = creerElement(
    "div",
    {},
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "169px",
      borderRadius: "10px",
      border: "1px solid transparent",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      marginBottom: "20px",
      backgroundColor: "#E8F1F6",
      position: "relative",
    }
  );

  const iconImage = creerElement("i", {
    className: "fa-regular fa-image AjoutPhoto-icon",
  });

  const inputFile = creerElement("input", {
    type: "file",
    accept: "image/*",
    style: "display: none;",
  });

  const boutonAjouterPhoto = creerElement(
    // bouton ajouter une photo
    "button",
    { textContent: "+ Ajouter photo" },
    {
      color: "#306685",
      backgroundColor: "#CBD6DC",
      fontFamily: "Syne, sans-serif",
      border: "1px transparent",
      padding: "5px 20px",
      textAlign: "center",
      fontSize: "16px",
      lineHeight: "19.2px",
      borderRadius: "25px",
      margin: "10px 0",
    }
  );

  boutonAjouterPhoto.addEventListener("click", () => inputFile.click());
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    const fileType = file.type;
    if (
      file &&
      file.size <= 4 * 1024 * 1024 && // vérifie la taille de l'image
      (fileType === "image/png" || fileType === "image/jpeg") // vérifie le format de l'image
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Défini une fonction de rappel qui sera exécutée lorsque le fichier sera complètement lu
        const img = creerElement(
          "img",
          { src: e.target.result },
          {
            maxWidth: "420px",
            maxHeight: "169px",
            margin: "0",
            padding: "0",
          }
        );
        encadrementPhoto.innerHTML = "";
        encadrementPhoto.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else {
      alert(
        "L'image doit être au format png ou jpg et,ou ne pas dépasser 4 Mo."
      );
    }
  });

  const textInfo = creerElement(
    "p",
    { textContent: "jpg, png : 4mo max" },
    {
      fontSize: "12px",
      color: "#808080",
      marginTop: "5px",
      position: "absolute",
      bottom: "5px",
      left: "50%",
      transform: "translateX(-50%)",
    }
  );

  // Ajout du logo, bouton et text dans le parent encadrementPhoto
  encadrementPhoto.appendChild(iconImage);
  encadrementPhoto.appendChild(boutonAjouterPhoto);
  encadrementPhoto.appendChild(inputFile);
  encadrementPhoto.appendChild(textInfo);

  const labelTitre = creerElement(
    "label",
    { textContent: "Titre" },
    { width: "100%", marginBottom: "10px", fontWeight: "bold" }
  );
  const inputTitre = creerElement(
    "input",
    { type: "text" },
    {
      width: "95%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid transparent",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
    }
  );
  const labelCategorie = creerElement(
    "label",
    { textContent: "Catégorie" },
    {
      display: "block",
      width: "100%",
      marginBottom: "10px",
      fontWeight: "bold",
    }
  );
  const selectCategorie = creerElement(
    "select",
    {},
    {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid transparent",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
    }
  );

  // Ajout des options de catégories récuperé sur l'api
  const categories = [
    { id: 1, name: "Objets" },
    { id: 2, name: "Appartements" },
    { id: 3, name: "Hôtels & restaurants" },
  ];
  categories.forEach((categorie) => {
    const option = creerElement("option", {
      value: categorie.id,
      textContent: categorie.name,
    });
    selectCategorie.appendChild(option);
  });

  const separateur = creerElement(
    "hr",
    {},
    {
      width: "100%",
      marginTop: "30px",
      marginBottom: "30px",
    }
  );

  const boutonValider = creerElement(
    "button",
    { textContent: "Valider", className: "button login-button" },
    { display: "block", marginLeft: "auto", marginRight: "auto" }
  );

  boutonValider.addEventListener("click", async () => {
    try {
      const nouveauProjet = {
        title: inputTitre.value,
        imageFile: inputFile.files[0],
        categoryId: selectCategorie.value,
      };
      const projetAjoute = await ajouterProjetAPI(nouveauProjet);
      console.log("Projet ajouté avec succès :", projetAjoute);
      dialogAjoutPhoto.close();
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
      alert(
        "Erreur lors de l'ajout du projet, verifiez que vous avez bien ajouté une photo , un titre et choisi la bonne catégorie"
      );
    }
  });

  dialogAjoutPhoto.append(
    titre,
    encadrementPhoto,
    labelTitre,
    inputTitre,
    labelCategorie,
    selectCategorie,
    separateur,
    boutonValider
  );

  // Ajout de l'événement pour fermer dialog (ajout photo) clic extérieur
  window.addEventListener("click", (event) => {
    if (event.target === dialogAjoutPhoto) {
      dialogAjoutPhoto.close();
      document.body.removeChild(dialogAjoutPhoto); // Supprime la dialog du DOM pour ne pas créer de conflit
    }
  });

  document.body.appendChild(dialogAjoutPhoto);
  return dialogAjoutPhoto;
}

// Exécuter la fonction principale pour gérer la connexion et le mode d'édition
gererConnexionEtModeEdition();

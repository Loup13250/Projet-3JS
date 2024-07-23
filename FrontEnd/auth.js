// formulaire de connexion
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    // empêche recharger la page).
    event.preventDefault();

    // On récupère les valeurs des champs email et mot de passe
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // On envoie une requête POST à l'API de connexion
    // Le corps de la requête contient un objet JSON avec l'email et le mot de passe de l'utilisateur
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        // Si la réponse n'est pas OK (si l'email ou le mot de passe est incorrect), on lance une erreur
        if (!response.ok) {
          throw new Error("Erreur de connexion");
        }
        // Sinon, on convertit la réponse en JSON.
        return response.json();
      })
      .then((data) => {
        //réponse dans la console.
        console.log("Succès:", data);
        // On sauvegarde le token et l'userId dans le localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        // On redirige l'utilisateur vers la page index.html lorsqu'il est bien connecté
        window.location.href = "index.html";
      })
      .catch((error) => {
        //  console si une erreur se produit
        console.error("Erreur:", error);
        // On affiche un message d'erreur à l'utilisateur
        alert("Le nom d'utilisateur ou le mot de passe est incorecte");
      });
  });

document.addEventListener("DOMContentLoaded", () => {
    const identificationDiv = document.getElementById("identification");
    const commandesDiv = document.getElementById("commandes");
    const messagesDiv = document.getElementById("messages");
  
    const identifierButton = document.getElementById("identifier");
    const ajouterCommandeButton = document.getElementById("ajouterCommande");
    const deconnexionButton = document.getElementById("deconnexion");
  
    let identifie = false;
    let employeId;
  
    // Fonction pour afficher un message d'erreur
    function afficherMessageErreur(message) {
      messagesDiv.textContent = message;
      messagesDiv.style.color = "red";
    }
  
    identifierButton.addEventListener("click", () => {
        const identifiant = document.getElementById("identifiant").value;
      
        // Vérifier si l'identifiant est valide (4 chiffres)
        if (!/^\d{4}$/.test(identifiant)) {
          afficherMessageErreur("Veuillez entrer un identifiant valide (4 chiffres).");
          return;
        }
      
        // Appeler l'API pour vérifier si l'employé existe
        fetch(`http://127.0.0.1:5000/employes/${identifiant}`)
          .then((response) => {
            if (!response.ok) {
              afficherMessageErreur("Identifiant invalide. Veuillez réessayer.");
              return;
            }
            return response.json();
          })
          .then((data) => {
            employeId = data.id;
            afficherMessageErreur("");
      
            // Effectuer la redirection vers le formulaire d'ajout de commande
            window.location.href = "chemin/vers/formulaire_ajout_commande.html";
            // Appeler l'API pour récupérer les fournisseurs
            fetchFournisseurs();
          })
          .catch((error) => {
            console.error("Erreur lors de la vérification de l'identifiant :", error);
            afficherMessageErreur("Une erreur est survenue. Veuillez réessayer.");
          });
      });
  
    function fetchFournisseurs() {
      fetch("http://127.0.0.1:5000/fournisseurs")
        .then((response) => response.json())
        .then((data) => {
          const selectFournisseur = document.getElementById("fournisseur");
          selectFournisseur.innerHTML = "";
  
          data.forEach((fournisseur) => {
            const option = document.createElement("option");
            option.value = fournisseur.id;
            option.textContent = fournisseur.nom;
            selectFournisseur.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des fournisseurs :", error);
          afficherMessageErreur("Une erreur est survenue lors de la récupération des fournisseurs.");
        });
    }
  
    ajouterCommandeButton.addEventListener("click", () => {
      if (!identifie) {
        afficherMessageErreur("Veuillez vous identifier d'abord.");
        return;
      }
  
      const fournisseur = document.getElementById("fournisseur").value;
      const produit = document.getElementById("produit").value;
      const quantite = document.getElementById("quantite").value;
  
      // Vérifier si les champs sont valides
      if (fournisseur.trim() === "" || produit.trim() === "" || quantite <= 0) {
        afficherMessageErreur("Veuillez remplir tous les champs avec des valeurs valides.");
        return;
      }
  
      // Envoyer la commande au serveur
      fetch("http://127.0.0.1:5000/commandes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fournisseur_id: fournisseur,
          employe_id: employeId,
          date_commande: new Date().toISOString().slice(0, 10),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          afficherMessageErreur(data.message);
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout de la commande :", error);
          afficherMessageErreur("Une erreur est survenue lors de l'ajout de la commande.");
        });
    });
  
    deconnexionButton.addEventListener("click", () => {
      identificationDiv.style.display = "block";
      commandesDiv.style.display = "none";
      identifie = false;
      employeId = null;
    });
  });
  
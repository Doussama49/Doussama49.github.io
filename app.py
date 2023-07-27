from flask import Flask, request, jsonify
from models.commande import Commande
from models.fournisseur import Fournisseur
from models.employe import Employe

app = Flask(__name__)

# Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

# ... (Vos autres routes et code restent les mêmes)

@app.route('/employes/<int:identifiant>', methods=['GET'])
def verifier_identifiant(identifiant):
    employe = Employe.get_by_identifiant(identifiant)
    if employe:
        return jsonify({'id': employe.identifiant, 'nom': employe.nom})
    else:
        return jsonify(message='Identifiant invalide'), 404
    

@app.route('/fournisseurs/<int:fournisseur_id>', methods=['GET'])
def get_fournisseur_by_id(fournisseur_id):
    fournisseur = Fournisseur.get_by_identifiant(fournisseur_id)
    if fournisseur:
        return jsonify({'nom': fournisseur.nom})
    else:
        return jsonify({'nom': None})
    

# Route pour récupérer tous les fournisseurs
@app.route('/fournisseurs', methods=['GET'])
def get_fournisseurs():
    fournisseurs = Fournisseur.get_all()
    return jsonify(fournisseurs)

@app.route('/commandes', methods=['GET'])
def get_all_commandes():
    try:
        # Appelez la méthode get_all de la classe Commande pour récupérer toutes les commandes
        commandes = Commande.get_all()

        # Convertissez le résultat en un format JSON et renvoyez-le en réponse
        return jsonify(commandes)

    except Exception as e:
        # Log the error to the server logs
        print("Error fetching all commandes:", e)

        # Return the error message to the front-end
        return jsonify(message='Une erreur s\'est produite lors de la récupération des commandes. Veuillez réessayer ultérieurement.'), 500

@app.route('/ajouter_commande', methods=['POST'])
def ajouter_commande():
    try:
        data = request.json
        fournisseur_id = data.get('fournisseur_id')
        employe_id = data.get('employe_id')
        date_commande = data.get('date_commande')
        activite = data.get('activite')
        bon_livraison = data.get('bonLivraison')
        materiel = data.get('materiel')
        qte_materiel = data.get('qteMateriel')
        statut = data.get('statut')
        valeur = data.get('valeur')

        # Set default values for empty fields
        activite = activite if activite else None
        bon_livraison = bon_livraison if bon_livraison else None
        materiel = materiel if materiel else None
        qte_materiel = int(qte_materiel) if qte_materiel else None
        
        statut = statut if statut else None
        valeur = float(valeur) if valeur else None

        # Vérifier si le fournisseur et l'employé existent dans la base de données
        fournisseur = Fournisseur.get_by_identifiant(fournisseur_id)
        employe = Employe.get_by_identifiant(employe_id)

        if not fournisseur:
            return jsonify(message='Fournisseur invalide'), 400

        if not employe:
            return jsonify(message='Employé invalide'), 400

        # Créer et enregistrer la commande dans la base de données
        commande = Commande(fournisseur_id, employe_id, date_commande, activite, bon_livraison, materiel, qte_materiel, statut, valeur)
        commande.save()

        return jsonify(message='Commande ajoutée avec succès')

    except Exception as e:
        # Log the error to the server logs
        print("Error during command insertion:", e)

        # Return the error message to the front-end
        return jsonify(message='Une erreur s\'est produite lors de l\'ajout de la commande. Veuillez réessayer ultérieurement.'), 500

if __name__ == '__main__':
    app.run(debug=True)  # Activer le mode de débogage pour le développement

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

# Route pour récupérer tous les fournisseurs
@app.route('/fournisseurs', methods=['GET'])
def get_fournisseurs():
    fournisseurs = Fournisseur.get_all()
    return jsonify(fournisseurs)

@app.route('/ajouter_commande', methods=['POST'])
def ajouter_commande():
    try:
        data = request.json
        fournisseur_id = data['fournisseur_id']
        employe_id = data['employe_id']
        date_commande = data['date_commande']

        # Vérifier si le fournisseur et l'employé existent dans la base de données
        fournisseur = Fournisseur.get_by_identifiant(fournisseur_id)
        employe = Employe.get_by_identifiant(employe_id)

        if not fournisseur:
            return jsonify(message='Fournisseur invalide'), 400

        if not employe:
            return jsonify(message='Employé invalide'), 400

        # Créer et enregistrer la commande dans la base de données
        commande = Commande(fournisseur_id, employe_id, date_commande)
        commande.save()

        return jsonify(message='Commande ajoutée avec succès')

    except Exception as e:
        # Log the error to the server logs
        print("Error during command insertion:", e)

        # Return the error message to the front-end
        return jsonify(message='Une erreur s\'est produite lors de l\'ajout de la commande. Veuillez réessayer ultérieurement.'), 500

if __name__ == '__main__':
    app.run(debug=True)  # Activer le mode de débogage pour le développement

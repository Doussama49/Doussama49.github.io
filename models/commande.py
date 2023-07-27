from database import Database

class Commande:
    def __init__(self, fournisseur_id, employe_id, date_commande, activite, bon_livraison, materiel, qte_materiel, statut, valeur):
        self.fournisseur_id = fournisseur_id
        self.employe_id = employe_id
        self.date_commande = date_commande
        self.activite = activite
        self.bon_livraison = bon_livraison
        self.materiel = materiel
        self.qte_materiel = qte_materiel
        self.statut = statut
        self.valeur = valeur

    # rest of the class code...

    @classmethod
    def get_all(cls):
        db = Database()
        commandes = db.fetch_query('SELECT * FROM commande')
        db.__del__()
        return commandes

    def save(self):
        db = Database()
        db.execute_query('INSERT INTO commande (fournisseur_id, employe_id, date_commande, activite, bon_livraison, materiel, qte_materiel, statut, valeur) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                         (self.fournisseur_id, self.employe_id, self.date_commande, self.activite, self.bon_livraison, self.materiel, self.qte_materiel, self.statut, self.valeur))
        db.__del__()

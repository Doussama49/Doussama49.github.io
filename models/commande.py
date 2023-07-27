from database import Database

class Commande:
    def __init__(self, fournisseur_id, employe_id, date_commande):
        self.fournisseur_id = fournisseur_id
        self.employe_id = employe_id
        self.date_commande = date_commande

    @classmethod
    def get_all(cls):
        db = Database()
        commandes = db.fetch_query('SELECT * FROM commande')
        db.__del__()
        return commandes

    def save(self):
        db = Database()
        db.execute_query('INSERT INTO commande (fournisseur_id, employe_id, date_commande) VALUES (%s, %s, %s)',
                         (self.fournisseur_id, self.employe_id, self.date_commande))
        db.__del__()

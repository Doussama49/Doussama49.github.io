from database import Database

class Fournisseur:
    def __init__(self, id, nom, adresse, telephone, email):
        self.id = id
        self.nom = nom
        self.adresse = adresse
        self.telephone = telephone
        self.email = email

    @classmethod
    def get_all(cls):
        db = Database()
        fournisseurs = db.fetch_query('SELECT * FROM fournisseur')
        db.__del__()
        return fournisseurs

    @classmethod
    def get_by_identifiant(cls, fournisseur_id):
        db = Database()
        query = 'SELECT * FROM fournisseur WHERE id = %s'
        result = db.fetch_one(query, (fournisseur_id,))
        db.__del__()
        if result:
            return cls(*result)
        else:
            return None

    def save(self):
        db = Database()
        db.execute_query('INSERT INTO fournisseur (nom, adresse, telephone, email) VALUES (%s, %s, %s, %s)',
                         (self.nom, self.adresse, self.telephone, self.email))
        db.__del__()
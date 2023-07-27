from database import Database

class Employe:
    def __init__(self, nom, prenom, identifiant):
        self.nom = nom
        self.prenom = prenom
        self.identifiant = identifiant

    @classmethod
    def get_all(cls):
        db = Database()
        employes = db.fetch_query('SELECT * FROM employe')
        db.__del__()
        return employes
    @classmethod
    def get_by_identifiant(cls, identifiant):
        db = Database()
        employe_data = db.fetch_query('SELECT nom, prenom, identifiant FROM employe WHERE identifiant = %s', (identifiant,))
        db.__del__()

        if employe_data:
            return cls(*employe_data[0])  # Assuming employe_data[0] has ('nom', 'prenom', 'identifiant') tuple
        else:
            return None

    def save(self):
        db = Database()
        db.execute_query('INSERT INTO employe (nom, prenom, identifiant) VALUES (%s, %s, %s)',
                         (self.nom, self.prenom, self.identifiant))
        db.__del__()

import mysql.connector

class Database:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host='localhost', 
            user='root',
            password='',
            database='valeo',
        )
        self.cursor = self.connection.cursor()

    def execute_query(self, query, params=None):
        if params is None:
            self.cursor.execute(query)
        else:
            self.cursor.execute(query, params)
        self.connection.commit()

    def fetch_query(self, query, params=None):
        if params is None:
            self.cursor.execute(query)
        else:
            self.cursor.execute(query, params)
        return self.cursor.fetchall()
    
    def fetch_one(self, query, params=None):
        self.cursor.execute(query, params)
        result = self.cursor.fetchone()
        return result

    def __del__(self):
        self.cursor.close()
        self.connection.close()

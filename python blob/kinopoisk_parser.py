import mysql.connector
from mysql.connector import Error
import sqlite3
import random

# Функция для подключения к базе данных SQLite
def connect_to_sqlite():
    try:
        conn = sqlite3.connect('movies.db')
        print("Подключение к SQLite установлено")
        return conn
    except Error as e:
        print(f"Ошибка при подключении к SQLite: {e}")
        return None

# Функция для извлечения информации о фильмах из базы данных SQLite
def fetch_movies_from_sqlite(conn):
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT title, director, country, year, description, rating, poster FROM animes")
        movies = cursor.fetchall()
        return movies
    except Error as e:
        print(f"Ошибка при извлечении фильмов из SQLite: {e}")
        return None

# Функция для подключения к базе данных MySQL
def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="moviereviewdb"
        )
        print("Подключение к MySQL установлено")
        return connection
    except Error as e:
        print(f"Ошибка при подключении к MySQL: {e}")
        return None

# Функция для добавления фильма в базу данных MySQL
def add_movie_to_mysql(connection, movie):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO movies (title, director, country, year, description, rating, countOfRatings, poster) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        countOfRatings = random.randint(10, 20)
        title, director, country, year, description, rating, poster = movie
        val = [title, director, country, year, description, rating, countOfRatings, poster]
        cursor.execute(sql, val)
        connection.commit()
        print(f"Фильм '{movie[1]}' добавлен в базу данных MySQL")
    except Error as e:
        print(f"Ошибка при добавлении фильма в базу данных MySQL: {e}")

# Главная функция
def main():
    # Подключение к базе данных SQLite
    sqlite_conn = connect_to_sqlite()
    if sqlite_conn is None:
        return
    
    # Получение информации о фильмах из базы данных SQLite
    movies = fetch_movies_from_sqlite(sqlite_conn)
    if movies is None:
        sqlite_conn.close()
        return

    # Подключение к базе данных MySQL
    mysql_conn = connect_to_mysql()
    if mysql_conn is None:
        sqlite_conn.close()
        return
    
    # Добавление фильмов в базу данных MySQL
    for movie in movies:
        add_movie_to_mysql(mysql_conn, movie)

    # Закрытие соединений с базами данных
    sqlite_conn.close()
    mysql_conn.close()
    print("Соединения с базами данных закрыты")

if __name__ == "__main__":
    main()

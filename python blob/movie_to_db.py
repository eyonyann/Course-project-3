import mysql.connector
from mysql.connector import Error

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

# Функция для добавления фильма в базу данных
def add_movie(connection, title, director, country, year, description, rating, countOfRatings, poster):
    try:
        cursor = connection.cursor()
        sql = "INSERT INTO movies (title, director, country, year, description, rating, countOfRatings, poster) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        val = (title, director, country, year, description, rating, countOfRatings, poster)
        cursor.execute(sql, val)
        connection.commit()
        print(f"Фильм '{title}' добавлен в базу данных")
    except Error as e:
        print(f"Ошибка при добавлении фильма в базу данных: {e}")

# Главная функция
def main():
    # Подключение к базе данных MySQL
    connection = connect_to_mysql()
    if connection is None:
        return
    
    path = "D:\my files\Course-project-3\public\\res\\"
    howl_no_ugoku_shiro_discription = "Злая ведьма заточила 18-летнюю Софи в тело старухи. Девушка-бабушка бежит из города куда глаза глядят и встречает удивительный дом на ножках, где знакомится с могущественным волшебником Хаулом и демоном Кальцифером. Кальцифер должен служить Хаулу по договору, условия которого он не может разглашать. Девушка и демон решают помочь друг другу избавиться от злых чар."
    john_discription = "Оставляя за собой горы трупов, Джон Уик продолжает скрываться от всевозможных наёмных убийц, и теперь охоту на него возглавляет молодой и честолюбивый член Правления по имени Маркиз. Два управляющих отелями «Континенталь» в Нью-Йорке и Осаке, решившие по старой дружбе помочь своенравному киллеру, уже жестоко за это поплатились, но внезапно Джон узнаёт способ выбраться из этой, казалось бы, безвыходной ситуации."
    cowboy_bebop_discription = "Бывший полицейский Джет Блэк и человек с тёмным прошлым Спайк Шпигель совершенно не планировали увеличивать экипаж космического корабля «Бибоп», являющегося для них домом и средством передвижения. Но сети, раскинутые для поимки дорогостоящих отбросов общества, принесли им Фэй Валентайн — очаровательную картёжницу с колоссальным долгом, Эд — потерявшуюся компьютерную умницу и Эйн — предположительно, самую умную собаку на свете. Именно в таком составе экипаж «Бибопа» и продолжает своё дело — охоту за головами."
    vinland_saga_discription = "Времена господства викингов. Людей, известных своими жестокими обычаями. Торфинн — сын одного из величайших викингов. Вот только вырос мальчик без отца, так как тот погиб на поле боя. Желая отомстить, Торфинн поклялся убить виновного, однако юноше ещё только предстоит овладеть искусством боя."
    # Список фильмов для добавления
    movies = [
        {"title": "Ходячий замок", "director": "Хаяо Миядзаки", "country": "Япония", "year": 2004, "description": howl_no_ugoku_shiro_discription, "rating": 8.3, "countOfRatings": 10, "poster": "hodyachij-zamok-poster.jpg"},
        {"title": "Джон Уик 4", "director": "Чад Стахелски", "country": "США, Германия", "year": 2023, "description": john_discription, "rating": 7.6, "countOfRatings": 12, "poster": "john-wick-4-poster.jpg"},
        {"title": "Ковбой Бибоп", "director": "Синъитиро Ватанабэ", "country": "Япония", "year": 1998, "description": cowboy_bebop_discription, "rating": 8.7, "countOfRatings": 5, "poster": "kovboj-bibop-poster.jpg"},
        {"title": "Сага о винланде", "director": "Сюхэй Ябута", "country": "Япония", "year": 2019, "description": vinland_saga_discription, "rating": 8.5, "countOfRatings": 8, "poster": "vinland-saga-poster.jpg"}
    ]

    # Добавление фильмов в базу данных
    for movie in movies:
        add_movie(connection, **movie)

    # Закрытие соединения с базой данных
    connection.close()
    print("Соединение с базой данных закрыто")

if __name__ == "__main__":
    main()

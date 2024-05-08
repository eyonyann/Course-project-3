import cv2
import os

def convert_to_blob(image_path):
    # Загрузка изображения
    image = cv2.imread(image_path)
    
    # Проверка наличия изображения
    if image is None:
        print(f"Ошибка при загрузке изображения: {image_path}")
        return None
    
    # Преобразование изображения в blob
    blob = cv2.dnn.blobFromImage(image, scalefactor=1.0, size=(300, 300), mean=(104.0, 177.0, 123.0))
    
    return blob

def main(input_folder, output_folder):
    # Создание папки для хранения blob (если ее еще нет)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Получение списка файлов в папке
    image_files = [f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))]
    
    # Проход по всем файлам изображений в папке
    for image_file in image_files:
        image_path = os.path.join(input_folder, image_file)
        
        # Преобразование изображения в blob
        blob = convert_to_blob(image_path)
        
        # Сохранение blob в новом файле
        if blob is not None:
            output_file = os.path.join(output_folder, f"{os.path.splitext(image_file)[0]}.blob")
            with open(output_file, "wb") as f:
                f.write(blob.tobytes())

if __name__ == "__main__":
    input_folder = "D:/my files/python blob/images"
    output_folder = "output_blobs"
    main(input_folder, output_folder)

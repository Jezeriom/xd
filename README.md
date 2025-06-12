# Cafetería Inteligente

Una aplicación de escritorio para gestionar pedidos de una cafetería, desarrollada en Python usando Tkinter.

## Características

- Interfaz gráfica moderna y responsive
- Gestión de pedidos de bebidas calientes y frías
- Sistema de clases orientado a objetos
- Visualización del pedido actual y total a pagar

## Requisitos

- Python 3.8 o superior
- Tkinter (incluido en la instalación estándar de Python)
- PyInstaller (para crear el ejecutable)

## Instalación

1. Clonar o descargar este repositorio
2. Instalar las dependencias:
```bash
pip install -r requirements.txt
```

## Ejecutar la aplicación

Para ejecutar la aplicación en modo desarrollo:
```bash
python main.py
```

## Crear ejecutable

Para crear un archivo ejecutable (.exe):
```bash
pyinstaller --onefile --windowed main.py
```

El ejecutable se creará en la carpeta `dist`.

## Estructura del proyecto

- `main.py`: Archivo principal con la interfaz gráfica
- `models.py`: Definición de las clases del sistema
- `requirements.txt`: Dependencias del proyecto 
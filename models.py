from abc import ABC, abstractmethod

class Producto(ABC):
    def __init__(self, nombre, precio):
        self.nombre = nombre
        self.precio = precio
    
    @abstractmethod
    def preparar(self):
        pass

class BebidaCaliente(Producto):
    def __init__(self, nombre, precio, temperatura=80):
        super().__init__(nombre, precio)
        self.temperatura = temperatura
    
    def preparar(self):
        return f"Preparando {self.nombre} caliente a {self.temperatura}°C"

class BebidaFria(Producto):
    def __init__(self, nombre, precio, temperatura=4):
        super().__init__(nombre, precio)
        self.temperatura = temperatura
    
    def preparar(self):
        return f"Preparando {self.nombre} fría a {self.temperatura}°C"

class Cliente:
    def __init__(self, nombre):
        self.nombre = nombre
        self.pedidos = []

class Pedido:
    def __init__(self, cliente):
        self.cliente = cliente
        self.productos = []
        self.total = 0
    
    def agregar_producto(self, producto):
        self.productos.append(producto)
        self.total += producto.precio
    
    def obtener_total(self):
        return self.total
    
    def obtener_productos(self):
        return self.productos 
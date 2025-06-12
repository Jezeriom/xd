# Uso de Programación Orientada a Objetos (POO) en "Cafetería Inteligente"

Este proyecto fue desarrollado aplicando los principales conceptos de **Programación Orientada a Objetos (POO)** en Python. A continuación, se describe cómo se implementó cada concepto requerido.

---

## 1. Clases, Atributos y Métodos

El sistema cuenta con al menos **3 clases principales**:

- `Producto`: clase base que contiene atributos como `nombre`, `precio`, y métodos como `preparar()`.
- `Cliente`: representa al usuario que realiza un pedido.
- `Pedido`: administra la lista de productos seleccionados y calcula el total.

Cada clase tiene atributos privados y métodos públicos para mantener la encapsulación.

---

## 2. Herencia y Polimorfismo

La clase `Producto` se utiliza como **clase base abstracta**, y tiene dos subclases:

- `BebidaCaliente`: implementa su propia versión del método `preparar()`.
- `BebidaFría`: también redefine `preparar()`.

Esto demuestra el uso de **herencia** (las subclases heredan de `Producto`) y **polimorfismo**, ya que se puede invocar `preparar()` sobre una instancia de tipo `Producto` sin saber si es una bebida fría o caliente.

```python
class Producto(ABC):
    @abstractmethod
    def preparar(self):
        pass

class BebidaCaliente(Producto):
    def preparar(self):
        print("Hirviendo agua y preparando bebida caliente...")

class BebidaFría(Producto):
    def preparar(self):
        print("Sirviendo bebida fría con hielo...")

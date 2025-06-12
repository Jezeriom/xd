import tkinter as tk
from tkinter import ttk, messagebox
from models import BebidaCaliente, BebidaFria, Cliente, Pedido

class CafeteriaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Cafetería Inteligente")
        self.root.geometry("800x600")
        self.root.configure(bg="#f0f0f0")
        
        # Configurar estilo
        self.style = ttk.Style()
        self.style.configure("TButton", padding=10, font=('Helvetica', 12))
        self.style.configure("TLabel", font=('Helvetica', 12))
        
        # Inicializar cliente y pedido
        self.cliente = Cliente("Cliente")
        self.pedido_actual = None
        
        # Productos disponibles
        self.productos = {
            "calientes": [
                BebidaCaliente("Café Americano", 25),
                BebidaCaliente("Café Latte", 35),
                BebidaCaliente("Cappuccino", 35),
                BebidaCaliente("Té Verde", 20)
            ],
            "frios": [
                BebidaFria("Frappé", 45),
                BebidaFria("Limonada", 30),
                BebidaFria("Smoothie", 40)
            ]
        }
        
        self.mostrar_pantalla_inicial()
    
    def mostrar_pantalla_inicial(self):
        self.limpiar_pantalla()
        
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(expand=True, fill="both")
        
        # Título
        titulo = ttk.Label(
            main_frame,
            text="¡Bienvenido a la Cafetería Inteligente!",
            font=('Helvetica', 24, 'bold')
        )
        titulo.pack(pady=50)
        
        # Botón para realizar pedido
        btn_pedido = ttk.Button(
            main_frame,
            text="Realizar Pedido",
            command=self.mostrar_menu
        )
        btn_pedido.pack(pady=20)
    
    def mostrar_menu(self):
        self.limpiar_pantalla()
        self.pedido_actual = Pedido(self.cliente)
        
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.pack(expand=True, fill="both")
        
        # Título
        titulo = ttk.Label(
            main_frame,
            text="Menú",
            font=('Helvetica', 24, 'bold')
        )
        titulo.pack(pady=20)
        
        # Frame para productos
        productos_frame = ttk.Frame(main_frame)
        productos_frame.pack(fill="both", expand=True)
        
        # Bebidas calientes
        calientes_frame = ttk.LabelFrame(productos_frame, text="Bebidas Calientes", padding="10")
        calientes_frame.pack(side="left", fill="both", expand=True, padx=10)
        
        for bebida in self.productos["calientes"]:
            btn = ttk.Button(
                calientes_frame,
                text=f"{bebida.nombre} - ${bebida.precio}",
                command=lambda b=bebida: self.agregar_al_pedido(b)
            )
            btn.pack(pady=5, fill="x")
        
        # Bebidas frías
        frias_frame = ttk.LabelFrame(productos_frame, text="Bebidas Frías", padding="10")
        frias_frame.pack(side="right", fill="both", expand=True, padx=10)
        
        for bebida in self.productos["frios"]:
            btn = ttk.Button(
                frias_frame,
                text=f"{bebida.nombre} - ${bebida.precio}",
                command=lambda b=bebida: self.agregar_al_pedido(b)
            )
            btn.pack(pady=5, fill="x")
        
        # Frame para el pedido actual
        pedido_frame = ttk.LabelFrame(main_frame, text="Pedido Actual", padding="10")
        pedido_frame.pack(fill="x", pady=20)
        
        self.pedido_label = ttk.Label(
            pedido_frame,
            text="No hay productos en el pedido",
            font=('Helvetica', 12)
        )
        self.pedido_label.pack(pady=10)
        
        # Botones de acción
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill="x", pady=20)
        
        ttk.Button(
            btn_frame,
            text="Confirmar Pedido",
            command=self.confirmar_pedido
        ).pack(side="right", padx=5)
        
        ttk.Button(
            btn_frame,
            text="Volver",
            command=self.mostrar_pantalla_inicial
        ).pack(side="right", padx=5)
    
    def agregar_al_pedido(self, producto):
        self.pedido_actual.agregar_producto(producto)
        self.actualizar_pedido_label()
    
    def actualizar_pedido_label(self):
        productos = self.pedido_actual.obtener_productos()
        if not productos:
            texto = "No hay productos en el pedido"
        else:
            texto = "Productos en el pedido:\n"
            for p in productos:
                texto += f"- {p.nombre}: ${p.precio}\n"
            texto += f"\nTotal: ${self.pedido_actual.obtener_total()}"
        
        self.pedido_label.config(text=texto)
    
    def confirmar_pedido(self):
        if not self.pedido_actual.productos:
            messagebox.showwarning("Error", "Agregue productos al pedido")
            return
        
        mensaje = "Preparando su pedido:\n\n"
        for producto in self.pedido_actual.productos:
            mensaje += f"{producto.preparar()}\n"
        
        messagebox.showinfo("Pedido Confirmado", mensaje)
        self.mostrar_pantalla_inicial()
    
    def limpiar_pantalla(self):
        for widget in self.root.winfo_children():
            widget.destroy()

if __name__ == "__main__":
    root = tk.Tk()
    app = CafeteriaApp(root)
    root.mainloop() 
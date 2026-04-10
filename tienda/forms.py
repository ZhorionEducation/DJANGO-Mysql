from django import forms
from .models import Cliente
from .models import Producto
from .models import Pedido
from .models import DetallePedido

class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = 'nombre', 'correo', 'direccion', 'telefono'
        
        widgets = {
            # el input de telefono solo numeros
            'telefono': forms.TextInput(attrs={'pattern': '[0-9]+', 'title': 'Solo se permiten números'}),
        }
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['nombre'].widget.attrs.update({'placeholder': 'Nombre completo'})
        self.fields['correo'].widget.attrs.update({'placeholder': 'Correo electrónico'})
        self.fields['direccion'].widget.attrs.update({'placeholder': 'Dirección'})
        self.fields['telefono'].widget.attrs.update({'placeholder': 'Teléfono'})
        
        
class ProductoForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = 'nombre', 'precio', 'stock'
        
        widgets = {
            # placeholders
            'nombre': forms.TextInput(attrs={'placeholder': 'Nombre del producto'}),
            'precio': forms.NumberInput(attrs={'placeholder': 'Precio del producto'}),
            'stock': forms.NumberInput(attrs={'placeholder': 'Cantidad en stock'}),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        stock = cleaned_data.get('stock')
        precio = cleaned_data.get('precio')
        nombre = cleaned_data.get('nombre')
        if precio is not None and precio < 0:
            raise forms.ValidationError("El precio no puede ser negativo.")
        if stock is not None and stock < 0:
            raise forms.ValidationError("El stock no puede ser negativo.")
        if nombre and Producto.objects.filter(nombre=nombre).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("Ya existe un producto con ese nombre.")
        return cleaned_data
        
class PedidoForm(forms.ModelForm):
    class Meta:
        model = Pedido
        fields = 'cliente', 'estado'
    
    # self, arks, kwargs son parametros de la funcion __init__ de django para inicializar el formulario
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Si estamos editando (existe una instancia con pk), deshabilitar el cliente, o sea  self.instance es si existe una instancia del pedido, y self.instance.pk es si esa instancia tiene un pk, o sea si ya fue guardada en la base de datos
        if self.instance and self.instance.pk:
            self.fields['cliente'].widget.attrs['disabled'] = 'disabled'
            self.fields['cliente'].required = False
    
    def clean(self):
        cleaned_data = super().clean()
        # Si estamos editando y el cliente fue deshabilitado, restaurar su valor
        if self.instance and self.instance.pk:
            cleaned_data['cliente'] = self.instance.cliente
        return cleaned_data
        
        
class DetallePedidoForm(forms.ModelForm):
    class Meta:
        model = DetallePedido
        fields ='producto', 'cantidad', 'precio_pedido'
        
    # si el producto no tiene stock, no se puede agregar al detalle de pedido
    # la palabra clean es una palabra de django para validar los datos
    def clean(self):
        # el self.cleaned_data.get('producto') obtiene el producto seleccionado en el formulario
        cleaned_data = super().clean() # esto es una validacion de django para limpiar los datos del formulario
        producto = self.cleaned_data.get('producto')
        cantidad = self.cleaned_data.get('cantidad')
        
        # Si hay producto, la cantidad es obligatoria
        if producto and not cantidad:
            raise forms.ValidationError("La cantidad es obligatoria cuando seleccionas un producto.")
        
        # Validar cantidad si existe
        if cantidad is not None and cantidad <= 0:
            raise forms.ValidationError("La cantidad debe ser mayor a cero.")
        
        # Validar stock si hay producto y cantidad
        if producto and cantidad and producto.stock < cantidad:
            raise forms.ValidationError("El producto no tiene stock disponible.")
        
        return cleaned_data

    
    # cuando se añade un nuevo detalle de pedido, dependiendo de la cantidad, se le resta al stock del producto y tambien calcula el precio
    # la palabra save es una palabra de django para guardar los datos en la base de datos
    def save(self, commit=True):
        detalle_pedido = super().save(commit=False)
        producto = detalle_pedido.producto
        cantidad = detalle_pedido.cantidad
        detalle_pedido.precio_pedido = producto.precio * cantidad
        if producto and cantidad:
            producto.stock -= cantidad
            producto.save()
        if commit:
            detalle_pedido.save()
        return detalle_pedido
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Agregar data-price a cada opción del select del producto
        productos = Producto.objects.all()
        choices = [(p.id, f"{p.nombre} - ${p.precio}") for p in productos]
        self.fields['producto'].choices = [(None, '--- Selecciona un producto ---')] + choices
        
        # Deshabilitar el campo de precio_pedido y hacerlo no requerido
        self.fields['precio_pedido'].disabled = True
        self.fields['precio_pedido'].required = False
    

    
        
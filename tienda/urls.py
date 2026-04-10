from django.urls import path
from . import views

app_name = 'tienda'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('clientes/', views.listar_clientes, name='listar_clientes'),
    path('productos/', views.listar_productos, name='listar_productos'),
    path('pedidos/', views.listar_pedidos, name='listar_pedidos'),
    path('detalles_pedidos/', views.listar_detalles_pedidos, name='listar_detalles_pedidos'),
    path('clientes/nuevo/', views.crear_cliente, name='nuevo_cliente'),
    path('productos/nuevo/', views.crear_producto, name='nuevo_producto'),
    path('pedidos/nuevo/', views.crear_pedido, name='nuevo_pedido'),
    # path('detalles_pedidos/nuevo/', views.crear_detalle_pedido, name='nuevo_detalle_pedido'),
    path('clientes/<int:pk>/', views.ver_cliente, name='ver_cliente'),
    path('productos/<int:pk>/', views.ver_producto, name='ver_producto'),
    path('pedidos/<int:pk>/', views.ver_pedido, name='ver_pedido'),
    # path('detalles_pedidos/<int:pk>/', views.ver_detalle_pedido, name='ver_detalle_pedido'),
    path('clientes/<int:pk>/editar/', views.actualizar_cliente, name='editar_cliente'),
    path('productos/<int:pk>/editar/', views.actualizar_producto, name='editar_producto'),
    path('pedidos/<int:pk>/editar/', views.actualizar_pedido, name='editar_pedido'),
    path('detalles_pedidos/<int:pk>/editar/', views.actualizar_detalle_pedido, name='editar_detalle_pedido'),
    path('clientes/<int:pk>/eliminar/', views.eliminar_cliente, name='eliminar_cliente'),
    path('productos/<int:pk>/eliminar/', views.eliminar_producto, name='eliminar_producto'),
    path('pedidos/<int:pk>/eliminar/', views.eliminar_pedido, name='eliminar_pedido'),
    path('detalles_pedidos/<int:pk>/eliminar/', views.eliminar_detalle_pedido, name='eliminar_detalle_pedido'),
    path('reportes/pedidos/excel/', views.reporte_pedidos_excel, name='reporte_pedidos_excel'),
    path('reportes/pedidos/pdf/', views.factura_pedidos_detallepedidos_pdf, name='factura_pedidos'),
]
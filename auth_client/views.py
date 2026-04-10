from django.shortcuts import render, redirect
from .services import login, logout


def login_view(request):
    # si el metodo es POST, intentamos autenticar al usuario
    if request.method == 'POST':
        # este username y password se obtienen de los campos del form
        username = request.POST['username']
        password = request.POST['password']
        print(f" DEBUG: Intentando login con {username}")
        
        # este login es la funciona de services.py que hace la peticion a la api de autenticacion para obtener el token
        result = login(username, password)
        print(f" DEBUG: Resultado: {result}")
        
        if result['success']:
            # guardamos el token porque si se necesita para el middleware
            request.session['token'] = result['token']
            # guardamos tambien el username por si hay que usarlo para mostrarlo en un perfil o interfaz
            request.session['username'] = username
            print(f" DEBUG: Sesión guardada, redirigiendo...")
            return redirect('tienda:dashboard')
        else:
            # Mostrar mensaje de error específico según el tipo
            error_message = result['message']
            print(f" DEBUG: Login fallido - {error_message}")
            return render(request, 'auth_client/login.html', {'error': error_message})
    return render(request, 'auth_client/login.html')

def logout_view(request):
    # Obtenemos el token de la sesión
    token = request.session.get('token')
    
    # Si existe token, notificamos a la API que se va a desconectar
    if token:
        logout(token)
        
    # Eliminamos el token de la sesión local
    if 'token' in request.session:
        del request.session['token']
        request.session.flush()  # Limpiar toda la sesión para eliminar cualquier dato residual
        print("DEBUG: Sesión eliminada localmente")
    else:
        print("DEBUG: No se encontró token en la sesión para eliminar")
    
    return redirect('auth_client:login')
import requests
from django.shortcuts import redirect

api_url = 'http://localhost:8001'

# Middleware para verificar el token en cada request

class AuthMiddleware:
    # el metodo __init__ se llama una sola vez cuando se carga el middleware, y el metodo __call__ se llama en cada request
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # definimos las rutas publicas que no requieren autenticacion, como el login y el registro
        public_paths = ['/login/', '/register/', '/']
        
        # si la ruta no es publica, verificamos el token
        if request.path not in public_paths:
            # el 'token' viene de la session de django
            token = request.session.get('token')
            
            # si no hay token, redirigimos al login
            if not token:
                return redirect('/')
            
            # verificamos el token haciendo una peticion a la api de autenticacion
            try:
                response = requests.get(f'{api_url}/verify', headers={'Authorization': f'Bearer {token}'}, timeout=3)
                
                # si el token no es valido, redirigimos al login y limpiamos la session
                if response.status_code != 200:
                    request.session.flush()
                    return redirect('/')
                    
            except Exception as e:
                print(f"MIDDLEWARE: Error={e}")
                return redirect('/login/')
            
        return self.get_response(request)
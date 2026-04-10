import requests

# aca ponemos la url de la api debido a que cada servicio necesita saber a que url hacer las peticiones
API_URL = 'http://localhost:8001'

def login(username, password):
    try:
        # hacemos una peticion POST a la api de autenticacion para obtener el token
        response = requests.post(f'{API_URL}/login', params={'username': username, 'password': password}, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # si la respuesta es 200, significa que el login fue exitoso y podemos obtener el token del json de la respuesta
        if response.status_code == 200:
            return {'success': True, 'token': response.json()['access_token']}
        else:
            # si la respuesta no es 200, significa que hubo un error en el login
            print(f"Error: {response.status_code}")
            return {'success': False, 'error': 'credenciales', 'message': 'Usuario o contraseña incorrectos'}
    except requests.exceptions.ConnectionError:
        print(f"Error de conexión: API no está disponible")
        return {'success': False, 'error': 'servidor', 'message': 'El login en este momento no está disponible, por favor intente más tarde'}
    except requests.exceptions.Timeout:
        print(f"Error de timeout: API no responde")
        return {'success': False, 'error': 'timeout', 'message': 'La API tardó demasiado en responder'}
    except Exception as e:
        print(f"Error inesperado: {e}")
        return {'success': False, 'error': 'desconocido', 'message': 'Error inesperado en la autenticación'}
    
def logout(token):
    try:
        # hacemos una peticion POST a la api de autenticacion para cerrar la sesion, enviando el token en los headers
        response = requests.post(f'{API_URL}/logout', headers={'Authorization': f'Bearer {token}'}, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        # si la respuesta es 200, significa que el logout fue exitoso
        if response.status_code == 200:
            return True
        else:
            print(f"Error: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error de conexión: {e}")
        return False
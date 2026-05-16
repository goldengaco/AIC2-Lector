# 📖 FASE 9: ENTENDER INDICACIONES TÉCNICAS (B1→B2)

**Objetivo:** Dominar la lectura de instrucciones técnicas, README, API docs, error messages, CLI  
**Duración:** 8-12 semanas (después de semana 24 de FASE 8)  
**Dificultad:** B1 → B2 (Intermedio a intermedio-alto)  
**Contexto:** IT/DevOps/Machine Learning específico

---

## 🎯 QUÉ SON "INDICACIONES TÉCNICAS"

Las "indicaciones" (instructions) son:
```
1. SETUP INSTRUCTIONS
   - "Step 1: Clone the repository"
   - "Run: npm install"
   - "Configure: Add API key to .env"

2. README FILES
   - "This project requires Python 3.8+"
   - "Installation: pip install -r requirements.txt"
   - "Usage: python main.py --help"

3. ERROR MESSAGES
   - "ModuleNotFoundError: No module named 'numpy'"
   - "Docker: Error response from daemon: port is already allocated"
   - "Connection refused: Check if the server is running"

4. API DOCUMENTATION
   - "GET /api/users returns a JSON array of users"
   - "POST /api/users with body {name, email} creates a user"
   - "Authentication: Bearer token required"

5. CLI (Command Line Interface) HELP
   - "Usage: git commit -m 'message'"
   - "docker run -d -p 8080:8080 image_name"
   - "kubectl get pods --all-namespaces"

6. CONFIGURATION FILES
   - "REDIS_URL=redis://localhost:6379"
   - "LOG_LEVEL=DEBUG"
   - "DATABASE_MAX_CONNECTIONS=100"
```

---

## 📚 SEMANA 1-2: README FILES Y SETUP INSTRUCTIONS

### EJERCICIO 1: DISECCIONAR UN README REAL

**Ejemplo 1: Simple Python Project**

```
README.md:

# Project Name: Data Pipeline

## Overview
This project implements a real-time data pipeline that processes 
streaming data from Kafka topics and stores results in PostgreSQL.

## Requirements
- Python 3.8 or higher
- Docker and Docker Compose
- PostgreSQL 12+
- Kafka 2.8+

## Installation

### Option 1: Docker (Recommended)
1. Clone the repository: git clone https://github.com/user/project.git
2. Navigate to the directory: cd project
3. Start services: docker-compose up -d
4. Run migrations: docker-compose exec app python manage.py migrate

### Option 2: Local Installation
1. Create virtual environment: python -m venv venv
2. Activate: source venv/bin/activate (or venv\Scripts\activate on Windows)
3. Install dependencies: pip install -r requirements.txt
4. Configure database in .env file
5. Run migrations: python manage.py migrate
6. Start server: python manage.py runserver

## Configuration

Create .env file in root directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
KAFKA_BROKER=localhost:9092
LOG_LEVEL=INFO
SECRET_KEY=your-secret-key-here
```

## Usage

### Running the pipeline
```bash
python pipeline.py --input kafka://topic --output postgres://db
```

### Available options
- `--input`: Source (kafka, s3, file)
- `--output`: Destination (postgres, s3, csv)
- `--batch-size`: Number of records (default: 1000)
- `--timeout`: Max wait time in seconds (default: 30)

### Example
```bash
python pipeline.py --input kafka://events --output postgres://analytics --batch-size 5000
```

## Testing

Run tests:
```bash
pytest tests/ -v
```

Run specific test:
```bash
pytest tests/test_pipeline.py::TestPipeline::test_connection
```

## Troubleshooting

**Error: "Connection refused"**
Solution: Ensure Kafka and PostgreSQL are running. Check services:
```bash
docker-compose ps
```

**Error: "ModuleNotFoundError: No module named 'kafka'"**
Solution: Install missing dependency:
```bash
pip install kafka-python
```

**Error: "FATAL: role 'user' does not exist"**
Solution: Create database user or update DATABASE_URL in .env

## Documentation
Full API documentation: docs/api.md
Architecture guide: docs/architecture.md
Contributing guide: CONTRIBUTING.md

## License
MIT License - See LICENSE file

---

VOCABULARIO CLAVE:
✓ "Clone the repository" = Clona el repositorio
✓ "Navigate to the directory" = Navega al directorio
✓ "Start services" = Inicia los servicios
✓ "Run migrations" = Ejecuta migraciones
✓ "Create virtual environment" = Crea entorno virtual
✓ "Activate" = Activa
✓ "Install dependencies" = Instala dependencias
✓ "Configure" = Configura
✓ "Available options" = Opciones disponibles
✓ "Troubleshooting" = Solución de problemas
✓ "Ensure" = Asegura/Garantiza
```

### EJERCICIO 1.1: Preguntas de comprensión

```
1. What are the two ways to install this project?
   Respuesta: Docker (Recommended) and Local Installation

2. What is the minimum Python version required?
   Respuesta: Python 3.8 or higher

3. To run the pipeline with custom batch size, which flag do you use?
   Respuesta: --batch-size [number]

4. If you get "Connection refused" error, what should you check?
   Respuesta: Ensure Kafka and PostgreSQL are running. 
              Check services: docker-compose ps

5. How do you run a specific test?
   Respuesta: pytest tests/test_pipeline.py::TestPipeline::test_connection

PUNTUACIÓN: 5/5 = ✅ Entiendes README
```

---

## 📚 SEMANA 3-4: ERROR MESSAGES Y TROUBLESHOOTING

### EJERCICIO 2: DECODIFICAR ERROR MESSAGES

**Error 1: ModuleNotFoundError**
```
ERROR:
Traceback (most recent call last):
  File "main.py", line 1, in <module>
    import numpy as np
ModuleNotFoundError: No module named 'numpy'

ANÁLISIS:
- Tipo de error: ModuleNotFoundError (falta un módulo)
- Módulo faltante: 'numpy' (numpy no está instalado)
- Archivo problemático: main.py (línea 1)
- Solución: pip install numpy

TRADUCCIÓN MENTAL:
"No puedo encontrar el módulo 'numpy'. Necesito instalarlo."
```

**Error 2: Port Already Allocated**
```
ERROR:
docker: Error response from daemon: driver failed programming 
external connectivity on endpoint redis (random-id): 
Bind for 0.0.0.0:6379 failed: port is already allocated.

ANÁLISIS:
- Tipo: Port conflict (puerto ya está en uso)
- Puerto: 6379 (es el puerto de Redis)
- Razón: Otro proceso ya está usando ese puerto
- Solución: 
  a) Detener el otro proceso usando ese puerto
  b) Usar diferente puerto: docker run -p 6380:6379 redis
  c) Listar procesos: lsof -i :6379

TRADUCCIÓN MENTAL:
"El puerto 6379 ya está siendo usado. Necesito liberar ese puerto 
o usar un puerto diferente."
```

**Error 3: Connection Refused**
```
ERROR:
psycopg2.OperationalError: could not connect to server: 
Connection refused
	Is the server running on host "localhost" (127.0.0.1) and 
	accepting TCP connections on port 5432?

ANÁLISIS:
- Tipo: Connection refused (conexión rechazada)
- Base de datos: PostgreSQL (usa puerto 5432)
- Problema: Servidor no está corriendo en localhost:5432
- Solución:
  a) Iniciar PostgreSQL: pg_ctl -D /usr/local/var/postgres start
  b) O usar Docker: docker run -p 5432:5432 postgres
  c) O verificar: psql -h localhost (si está corriendo)

TRADUCCIÓN MENTAL:
"No puedo conectar a PostgreSQL. El servidor no está ejecutándose 
en localhost:5432. Necesito iniciarlo."
```

**Error 4: Authentication Failed**
```
ERROR:
Error: EACCES: permission denied, open '/root/.ssh/config'

ANÁLISIS:
- Tipo: EACCES (Access denied - permiso denegado)
- Archivo: /root/.ssh/config (no tienes permisos de lectura)
- Solución: chmod 600 /root/.ssh/config

TRADUCCIÓN MENTAL:
"No tengo permisos para acceder a este archivo. Necesito cambiar 
los permisos usando chmod."
```

### EJERCICIO 2.1: Identifica el error

```
LOGS:

1. "ValueError: invalid literal for int() with base 10: 'abc'"
   Tipo de error: ________________
   Problema: ________________
   Solución: ________________
   
   Respuesta:
   - Tipo: ValueError (conversión inválida)
   - Problema: Intentas convertir 'abc' a integer, pero 'abc' no es número
   - Solución: Validar input antes de convertir: if input.isdigit(): int(input)

2. "TimeoutError: The operation timed out"
   Tipo: ________________
   Problema: ________________
   Solución: ________________
   
   Respuesta:
   - Tipo: TimeoutError (timeout)
   - Problema: La operación tardó demasiado y se canceló
   - Solución: Aumentar timeout o optimizar la operación lenta

3. "KeyError: 'user_id' in dictionary"
   Tipo: ________________
   Problema: ________________
   Solución: ________________
   
   Respuesta:
   - Tipo: KeyError (clave no existe en diccionario)
   - Problema: El diccionario no tiene la clave 'user_id'
   - Solución: Verificar antes: if 'user_id' in dict: ... 
              O usar get(): dict.get('user_id', default_value)
```

---

## 📚 SEMANA 5-6: API DOCUMENTATION

### EJERCICIO 3: LEER API DOCS

**Ejemplo: REST API para Users**

```
API DOCUMENTATION:

Base URL: https://api.example.com/v1

## GET /users
Retrieve list of all users.

**Query Parameters:**
- limit (optional, integer, default: 20): Max number of users to return
- offset (optional, integer, default: 0): Starting position
- role (optional, string): Filter by role (admin, user, guest)

**Example Request:**
GET /users?limit=10&offset=0&role=admin

**Example Response (200 OK):**
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2026-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2026-02-01T14:22:00Z"
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}

**Error Responses:**
- 400 Bad Request: Invalid limit or offset
  {"error": "limit must be between 1 and 100"}
- 401 Unauthorized: Missing or invalid authentication
  {"error": "Missing Authorization header"}

---

## POST /users
Create a new user.

**Request Headers:**
- Content-Type: application/json
- Authorization: Bearer {token}

**Request Body:**
{
  "name": "string (required, 1-100 chars)",
  "email": "string (required, valid email)",
  "role": "string (optional, default: user, values: admin|user|guest)"
}

**Example Request:**
POST /users
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "name": "Carlos García",
  "email": "carlos@example.com",
  "role": "user"
}

**Example Response (201 Created):**
{
  "id": 3,
  "name": "Carlos García",
  "email": "carlos@example.com",
  "role": "user",
  "created_at": "2026-05-09T15:45:00Z"
}

**Error Responses:**
- 400 Bad Request: Invalid input
  {"error": "email must be valid email address"}
- 409 Conflict: Email already exists
  {"error": "email already registered"}
- 401 Unauthorized: Missing authentication
  {"error": "Missing Authorization header"}

---

## GET /users/{id}
Retrieve a specific user by ID.

**Path Parameters:**
- id (required, integer): User ID

**Example Request:**
GET /users/3

**Example Response (200 OK):**
{
  "id": 3,
  "name": "Carlos García",
  "email": "carlos@example.com",
  "role": "user",
  "created_at": "2026-05-09T15:45:00Z",
  "updated_at": "2026-05-09T15:45:00Z"
}

**Error Response:**
- 404 Not Found: User doesn't exist
  {"error": "User with ID 999 not found"}

---

VOCABULARIO CLAVE:
✓ "Query Parameters" = Parámetros de consulta
✓ "Request Headers" = Encabezados de solicitud
✓ "Request Body" = Cuerpo de solicitud
✓ "Response" = Respuesta
✓ "Status Code" = Código de estado
✓ "200 OK" = 200 Éxito
✓ "400 Bad Request" = 400 Solicitud inválida
✓ "401 Unauthorized" = 401 No autorizado
✓ "404 Not Found" = 404 No encontrado
✓ "Required" = Requerido
✓ "Optional" = Opcional
✓ "Default" = Por defecto
```

### EJERCICIO 3.1: Preguntas sobre API

```
1. To get only admin users, what query parameter do you use?
   Respuesta: ?role=admin

2. What is the default limit for GET /users?
   Respuesta: 20 users

3. When creating a user, which field is optional?
   Respuesta: role (default: user)

4. If POST /users returns 409 Conflict, what does it mean?
   Respuesta: Email already exists / already registered

5. To get user with ID 42, what request do you make?
   Respuesta: GET /users/42
```

---

## 📚 SEMANA 7-8: CLI HELP AND COMMANDS

### EJERCICIO 4: ENTENDER COMANDOS CLI

**Ejemplo 1: Git Commands**

```
$ git --help

usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] 
           [--info-path] [-p | --paginate | -P | --no-pager] 
           [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>]
           <command> [<args>]

These are common Git commands used in various situations:

start a working area (see also: git help tutorial)
   clone      Clone a repository into a new directory
   init       Create an empty Git repository or reinitialize an existing one

work on the current change (see also: git help everyday)
   add        Add file contents to the index
   mv         Move or rename a file, a directory, or a symlink
   reset      Reset current HEAD to the specified state
   rm         Remove files from the working tree and the index

examine the history and state (see also: git help revisions)
   bisect     Use binary search to find the commit that introduced a bug
   grep       Print lines matching a pattern
   log        Show commit logs
   show       Show various types of objects
   status     Show the working tree status

grow, mark and tweak your common history
   branch     List, create, or delete branches
   commit     Record changes to the repository
   diff       Show changes between commits, commit and working tree, etc
   merge      Join two or more development histories together
   rebase     Reapply commits on top of another branch
   tag        Create, list, delete or verify a tag object signed with GPG

collaborate (see also: git help workflows)
   fetch      Download objects and refs from another repository
   pull       Fetch from and integrate with another repository or a local branch
   push       Update remote refs along with associated objects

ANÁLISIS:
- Comando principal: git
- Subcomandos: clone, init, add, commit, push, etc
- Estructura: git <subcommand> [options]
- Ejemplo: git clone https://github.com/user/repo.git
```

**Ejemplo 2: Docker Run Command**

```
$ docker run --help

Usage: docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Run a command in a new container

Examples:
  docker run -d -p 8080:8080 my-app:latest
  docker run -it ubuntu bash
  docker run -e DB_URL=postgresql://... my-app:v2

Options:
  -d, --detach                  Run container in background and print container ID
  -e, --env list                Set environment variables
  -i, --interactive             Keep STDIN open even if not attached
  -p, --publish list            Publish a container's port(s) to the host
  -t, --tty                     Allocate a pseudo-TTY
  --name string                 Assign a name to the container
  -v, --volume list             Bind mount a volume
  --rm                          Automatically remove the container when it exits

ANÁLISIS:
Estructura: docker run [OPTIONS] IMAGE [COMMAND]

Ejemplo: docker run -d -p 8080:8080 -e LOG_LEVEL=DEBUG my-app:latest
- -d: Detach (background)
- -p 8080:8080: Port mapping (host:container)
- -e LOG_LEVEL=DEBUG: Environment variable
- my-app:latest: Image name and tag
```

### EJERCICIO 4.1: Construir comandos CLI

```
1. Clonar un repositorio GitHub
   Comando: git clone https://github.com/user/project.git

2. Crear un contenedor Docker que escuche en puerto 3000
   Comando: docker run -d -p 3000:3000 my-app:latest

3. Ver el status de tu repositorio Git
   Comando: git status

4. Actualizar variable de entorno en Docker
   Comando: docker run -e DATABASE_URL=... image_name

5. Listar todos los contenedores Docker corriendo
   Comando: docker ps

6. Ver ayuda para comando kubectl
   Comando: kubectl --help

PUNTUACIÓN: 6/6 = ✅ Entiendes CLI
```

---

## 📊 ESTRUCTURA DE EVALUACIÓN FASE 9

### Weekly Tests (Semana 1-8):

```
TEST 1: README COMPREHENSION (30 puntos)
- Identificar secciones (10 puntos)
- Responder preguntas de setup (10 puntos)
- Explicar pasos de instalación (10 puntos)

TEST 2: ERROR MESSAGES (25 puntos)
- Identificar tipo de error (10 puntos)
- Explicar causa (10 puntos)
- Proponer solución (5 puntos)

TEST 3: API DOCUMENTATION (35 puntos)
- Identificar endpoints (10 puntos)
- Explicar parámetros (10 puntos)
- Construir requests (15 puntos)

TEST 4: CLI COMMANDS (30 puntos)
- Entender sintaxis (10 puntos)
- Construir comandos (10 puntos)
- Explicar options (10 puntos)

TOTAL POR SEMANA: 120 puntos
META: 100+ (83%+)
```

---

## 🎯 VOCABULARIO CLAVE FASE 9

```
SETUP & INSTALLATION:
✓ Clone = Clonar
✓ Install = Instalar
✓ Configure = Configurar
✓ Migrate = Migrar
✓ Initialize = Inicializar
✓ Setup = Configurar

ERROR HANDLING:
✓ Error = Error
✓ Warning = Advertencia
✓ Exception = Excepción
✓ Traceback = Seguimiento del error
✓ Stack trace = Rastreo de pila
✓ Debug = Depurar
✓ Fix = Arreglar
✓ Resolve = Resolver

API:
✓ Request = Solicitud
✓ Response = Respuesta
✓ Status code = Código de estado
✓ Endpoint = Punto de acceso
✓ Parameter = Parámetro
✓ Header = Encabezado
✓ Body = Cuerpo
✓ Query = Consulta
✓ Path = Ruta

CLI:
✓ Command = Comando
✓ Option = Opción
✓ Flag = Bandera
✓ Argument = Argumento
✓ Usage = Uso
✓ Execute = Ejecutar
✓ Output = Salida
✓ Exit code = Código de salida
```

---

Versión: 1.0
Fecha: 2026-05-09
Estado: LISTO PARA USAR
Duración: 8-12 semanas (después de FASE 8)
Nivel: B1 → B2
Objetivo: Entender cualquier indicación técnica, README, error, API

# Shopping List - Demo de Typescript con Express.js y Postgres

## Dependencias

* Node.js 

~~~
% node -v
v25.0.0
~~~

* Docker CE

~~~
% docker -v
Docker version 28.5.1, build e180ab8
~~~

## Instrucciones

* Clonar el repositorio en el sistema de archivos

~~~
% git clone "https://github.com/josedanielgz/shopping-list.git"
~~~

* Instalar las dependencias del proyecto

~~~
% npm install
~~~

* Lanzar el contenedor 

~~~
% docker compose up -d
[+] Running 2/2
 ✔ Network shopping-list-frontend_default  Created                                                                             0.3s 
 ✔ Container postgres_db                   Started                                           
~~~

* Acceder a la interfaz de línea de comandos del contenedor y crear un usuario para la gestión
de la base de datos con los privilegios adecuados

~~~
% docker exec -it postgres_db psql -U postgres

psql (18.0 (Debian 18.0-1.pgdg13+3))
Type "help" for help.

postgres=# CREATE USER shop_manager WITH PASSWORD "escribircontraseñaaqui";
postgres=# GRANT ALL PRIVILEGES ON TABLE items_compra TO shop_manager;
postgres=#\c app_db # Opcional, a veces puede confundirse con la base de datos por defecto "postgres"
postgres=# GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shop_manager;
postgres=#\q
~~~

* Ejecutar el archivo semilla manualmente para llenar la base de datos con registros de prueba

~~~
% docker compose exec db psql -U postgres -d app_db -f /docker-entrypoint-initdb.d/seed.sql
psql:/docker-entrypoint-initdb.d/seed.sql:2: NOTICE:  table "items_compra" does not exist, skipping
DROP TABLE
CREATE TABLE
INSERT 0 10
~~~

* Crear un archivo .env en _la raíz del proyecto_ (justo junto a `compose.yaml` y los otros archivos de configuración) para administrar las credenciales de la base
de datos

~~~
# Contenido del archivo de texto .env
PG_USER=shop_manager
PG_HOST=localhost
PG_DATABASE=app_db
PG_PASSWORD="lacontraseñaquehayaelegido"
PG_PORT=5432
PG_SCHEMA=public
~~~

* Ejecutar el servidor de Node.js

~~~
% npm run dev

> shopping-list-frontend@0.1.0 dev
~~~

* Opcional: algunos atajos de gestión para inspeccionar el estado de la base de datos estando conectado mediante plsql:

~~~
\l                    -- Ver todas las BD
\c app_db             -- Cambiar a tu BD
\dn                   -- Ver esquemas en app_db
\dt                   -- Ver tablas en schema actual
\dt public.*          -- Ver tablas específicamente en public
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
~~~

## Estructura general del proyecto

En construcción

* `app/api/items`: Capa de backend. Contiene las rutas API (route.ts) para la lógica CRUD (GET, POST, PUT, DELETE) y el manejo de la base de datos.

* `app/lib`: Almacena el cliente de conexión a PostgreSQL (database.ts).
app/hooks,Lógica Frontend: Contiene el custom hook useShoppingList.ts que centraliza la lógica de estado y llamadas HTTP.
* `app/components`: Componentes reutilizables (Modales, Header, Listas)."

* `app/layout.tsx:`: Define el Header, Footer y aplica los estilos globales."

* `public`: "Archivos estáticos (favicon, imágenes)."

## TODO

* Introducir la totalidad la apliación dentro de un contenedor
* Utilizar permisos más granulares para el usuario de la BD
* Implementar un mecanismo de backups
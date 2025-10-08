# Frontend E-commerce Salaventas

Este es un proyecto de frontend desarrollado con **Angular 18**, diseñado para una plataforma de **E-commerce**. Utiliza las últimas tecnologías y herramientas de Angular para ofrecer una experiencia de usuario rápida y moderna.

## Tecnologías Utilizadas

- **Angular**: Framework de desarrollo web utilizado para crear la interfaz de usuario.
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **npm**: Gestor de paquetes utilizado para instalar dependencias.

### Versiones de Dependencias

- **Angular CLI**: 18.2.14
- **Node**: 22.14.0
- **Package Manager**: npm 10.9.2
- **OS**: win32 x64

#### Paquetes de Angular

| Paquete                        | Versión  |
|---------------------------------|----------|
| @angular-devkit/architect       | 0.1802.14 |
| @angular-devkit/build-angular   | 18.2.14  |
| @angular-devkit/core            | 18.2.14  |
| @angular-devkit/schematics      | 18.2.14  |
| @angular/cli                    | 18.2.14  |
| @schematics/angular             | 18.2.14  |
| rxjs                            | 7.8.2    |
| typescript                      | 5.5.4    |
| zone.js                         | 0.14.10  |
add
bootstrap y bootstrap icons
npm install uuid


## Requisitos Previos

Asegúrate de tener **Node.js** y **npm** instalados en tu sistema antes de comenzar.

- [Descargar Node.js](https://nodejs.org/) (esto instalará también npm)
- También puedes utilizar el gestor de versiones Node (NVM) para su instalación (recomendado).

Asegúrate de tener instalada la **versión 18 de Angular CLI** para que sea compatible con este proyecto. Si no la tienes instalada, puedes instalarla globalmente con el siguiente comando:

```bash
npm install -g @angular/cli@18
```


### Verificación de las versiones

Para verificar que tienes las versiones correctas, puedes usar los siguientes comandos:

```bash
node -v
npm -v
ng version
```

¡Perfecto! Aquí tienes un resumen claro y técnico para agregar al `README.md`, explicando cómo habilitar `HttpClient` correctamente en una app Angular standalone moderna (Angular 17+ con `bootstrapApplication`):

---

## ✅ Habilitar `HttpClient` en Angular Standalone (Angular 17+)

A partir de Angular 17, el uso de `HttpClientModule` ha quedado **obsoleto** en aplicaciones standalone. Para habilitar correctamente las peticiones HTTP, se debe usar `provideHttpClient()` en la configuración de bootstrap.

### 📦 Paso 1: Instalar `HttpClient` usando `provideHttpClient()`

En el archivo `app.config.ts` (o el que uses para configurar tu aplicación):

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

### 🚀 Paso 2: Usar la configuración en `main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

### ✅ Resultado

* Ya no es necesario importar `HttpClientModule`.
* Puedes usar `HttpClient` directamente en tus servicios sin errores ni advertencias de deprecación.
* Compatible con componentes standalone.

---

¿Quieres que también documentemos cómo crear un servicio que use `HttpClient` correctamente o estás listo con esto?

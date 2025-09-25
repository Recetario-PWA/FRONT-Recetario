# 🥞 Recetario PWA

Una **Progressive Web App (PWA)** de recetario construida con **Ionic 8** y **Angular 20**. La aplicación permite gestionar recetas, usuarios y notificaciones en tiempo real, con funcionalidades offline y seguridad mediante 2FA.

## Screenshots

![App Screenshot](https://f004.backblazeb2.com/file/iceliiprojects/mobile2.png)

---

## 🚀 Tecnologías utilizadas

- **Frontend:** [Angular 20](https://angular.io/), [Ionic 8](https://ionicframework.com/) (standalone components)
- **Backend:** Laravel (REST API) [API-Recetario](https://github.com/Recetario-PWA/API-Recetario.git "API-Recetario")
- **Autenticación:** Laravel Sanctum  
- **Notificaciones push:** [Pusher Beams](https://pusher.com/beams)  
- **WebSockets:** [Pusher](https://pusher.com/) para actualizaciones en tiempo real  
- **Almacenamiento offline:** `IndexedDB`   
- **Persistencia de datos:** `localStorage` (para favoritos)  
- **PWA:** Soporte offline, instalación en dispositivos móviles y desktop

---

## 📌 Funcionalidades principales

### 🔐 Autenticación
- Registro y login de usuarios.
- 2FA (verificación de código enviado al correo).
- Gestión de sesión segura con Laravel Sanctum.

### 🍳 Gestión de recetas
- Publicar, editar y eliminar recetas.
- Ver detalle de cada receta.
- Comentar recetas de otros usuarios.
- Guardar recetas como favoritas.

### 📊 Dashboard de usuario
- Ver y editar información del perfil.
- Listado de recetas publicadas por el usuario (editar, eliminar o ver).
- Historial de comentarios realizados por el usuario (ver y eliminar).
- Cerrar sesión.

### 🔔 Notificaciones
- Sección de notificaciones en tiempo real mediante **Pusher**
- Notificaciones push mediante **Pusher Beams**
- Actualizaciones en tiempo real para comentarios

### 💾 Funcionalidades offline
- Acceso a recetas favoritas y secciones básicas sin conexión a internet
- Datos persistentes por usuario en `localStorage`

---

## ⚙ Instalación

### Requisitos
- Node.js >= 20  
- Ionic CLI  
- Angular CLI  
- Una API backend disponible (puedes usar [API-Recetario](https://github.com/Recetario-PWA/API-Recetario.git "API-Recetario"))

### Pasos
1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/recetario-pwa.git
cd recetario-pwa
```


2. Instalar dependencias:

```bash
npm install
```

3. Configurar environment.ts:
```ts
export const environment = {
  production: false,
  apiUrlBase: `API_URL`,
  pusher: {
    instanceId: `PUSHER_BEAMS_INSTANCE_ID`,
    key: `PUSHER_KEY`
  }
};
```

4. Correr la app en modo desarrollo:
```bash
ionic serve
```

> [!TIP]
> Para hacer build usar el comando
> ionic build --prod o ionic build

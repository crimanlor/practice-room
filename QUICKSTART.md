# 🚀 Inicio Rápido - Practice Room

## Instalación

1. **Navega al directorio del proyecto:**
   ```bash
   cd practice-room
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:3000
   ```

## Primeros Pasos

### 1. Sube tu primera canción

- Arrastra un archivo de audio (MP3, WAV, OGG, M4A) a la zona de "Arrastra un archivo de audio aquí"
- O haz clic para seleccionar un archivo desde tu computadora

### 2. Explora el reproductor

- **Play/Pause**: Reproduce o pausa la canción
- **Waveform**: Visualiza la forma de onda de tu track
- **Control de volumen**: Pasa el ratón sobre el icono de volumen para ajustarlo

### 3. Añade marcadores

Los marcadores te ayudan a identificar momentos clave en tu canción:

- **Intro**: El comienzo de la canción
- **Build Up**: Cuando la energía aumenta
- **Drop**: El momento culminante
- **Outro**: El final de la canción
- **Personalizado**: Para cualquier otro momento importante

Para añadir un marcador:
1. Reproduce la canción y pausa en el momento que quieres marcar
2. Haz clic en "Añadir Marcador"
3. Selecciona el tipo de marcador
4. Opcionalmente, añade una nota
5. Haz clic en "Añadir Marcador"

### 4. Navega tus marcadores

- Haz clic en el tiempo de un marcador para saltar a ese momento
- Edita o elimina marcadores con los iconos correspondientes

### 5. Gestiona tus tracks

- Selecciona diferentes tracks de la lista
- Elimina tracks que ya no necesites
- Todos tus tracks y marcadores se guardan automáticamente en tu navegador

## Estructura de archivos de audio

La app soporta los siguientes formatos de audio:
- **MP3** (.mp3)
- **WAV** (.wav)
- **OGG** (.ogg)
- **M4A** (.m4a)

## Atajos de Teclado (Futuro)

Estos son algunos atajos que se pueden implementar:
- `Espacio`: Play/Pause
- `M`: Añadir marcador
- `←/→`: Retroceder/Avanzar 5 segundos

## Solución de Problemas

### El audio no se reproduce

1. Verifica que el formato de archivo sea compatible
2. Asegúrate de que el volumen no esté en 0
3. Verifica los permisos del navegador para reproducir audio

### No se guardan los tracks

1. Verifica que localStorage esté habilitado en tu navegador
2. Comprueba que no estés en modo incógnito/privado
3. Revisa la consola del navegador para errores

### El waveform no se muestra

1. Espera a que el archivo termine de cargar
2. Recarga la página si el problema persiste
3. Verifica la consola del navegador para errores

## Próximos pasos

- Lee el [README.md](README.md) para más información sobre el proyecto
- Consulta [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) si quieres contribuir o extender la app
- Explora los componentes en la carpeta `components/`
- Revisa los hooks personalizados en `hooks/`

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start

# Linting
npm run lint
```

---

¡Disfruta practicando! 🎵🎧

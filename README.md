# Practice Room 🎵

Una aplicación educativa para aprender a pinchar música.

## Características

- 📤 Subida de archivos de audio
- ▶️ Reproductor de audio con controles
- 🌊 Visualización de forma de onda (waveform)
- 📍 Marcadores para momentos importantes (intro, build up, drop, outro)
- 📝 Notas personales por track
- 💾 Almacenamiento local (localStorage)

## Stack Tecnológico

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **Wavesurfer.js** - Visualización de audio

## Empezar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Filosofía del Proyecto

Este proyecto está diseñado para ser:
- ✅ Simple y educativo
- ✅ Enfocado en funcionalidad
- ✅ Modular y escalable
- ❌ No es un simulador de DJ completo
- ❌ No incluye features de redes sociales
- ❌ No requiere autenticación (por ahora)

## Estructura de Datos

```typescript
Track {
  id: string
  name: string
  file_url: string
  duration: number
  markers: Marker[]
}

Marker {
  id: string
  type: 'intro' | 'buildup' | 'drop' | 'outro' | 'custom'
  time: number
  note?: string
  color: string
}
```

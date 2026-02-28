/**
 * Contenido educativo sobre mezcla de música electrónica.
 * Dirigido a DJs principiantes.
 *
 * Los tipos LearningSection / LearningItem viven en @/types.
 */

import type { LearningSection } from '@/types';

export const LEARNING_CONTENT: LearningSection[] = [
  {
    id: 'bpm-tempo',
    title: 'BPM y Tempo',
    icon: '⏱️',
    content: [
      {
        subtitle: '¿Qué es el BPM?',
        description:
          'Beats Per Minute (BPM) es la medida del tempo o velocidad de una canción. Indica cuántos beats (pulsos) caben en un minuto. A mayor BPM, más rápida es la canción.',
        tips: [
          'House: 120-130 BPM',
          'Techno: 120-150 BPM',
          'Trance: 138-145 BPM',
          'Drum & Bass: 160-180 BPM',
          'Dubstep: 140 BPM (aprox)',
          'Hip-hop: 80-100 BPM',
        ],
      },
      {
        subtitle: 'Pitch/Tempo Control',
        description:
          'El slider de pitch cambia la velocidad de la canción. Moverlo arriba (+) aumenta velocidad y tono, abajo (-) los reduce. En digital, puedes ajustar solo tempo sin afectar tono.',
        tips: [
          'Pequeños ajustes (+/- 3%) suenan naturales',
          'Ajustes grandes (+/- 8%) se notan mucho',
          'Usa "key lock" o "pitch adjust" para mantener tono',
          'Practica syncing con ajustes mínimos primero',
        ],
      },
      {
        subtitle: 'Beatmatching',
        description:
          'Proceso de igualar el tempo de dos canciones. Si una está a 128 BPM y otra a 130 BPM, ajusta la más rápida o lenta hasta que coincidan.',
        tips: [
          'Escucha los beats con auriculares en un oído',
          'Ajusta tempo primero, luego refina con jog',
          'Usa los BPM displays como guía inicial',
          'Practica sin sync para aprender',
        ],
      },
      {
        subtitle: 'Master Tempo / Key Lock',
        description:
          'Feature que mantiene el tono original de la canción aunque cambies la velocidad. Esencial para mixing sin afectar la tonalidad.',
        tips: [
          'Actívalo si vas a hacer grandes cambios de tempo',
          'Desactívalo para efectos de speed-up/down',
          'En Mixxx: opción "Rate Temperature"',
        ],
      },
    ],
  },
  {
    id: 'estructura',
    title: 'Estructura Musical',
    icon: '🎵',
    content: [
      {
        subtitle: 'El Compás (Beat)',
        description:
          'Un compás es la unidad básica del ritmo. En música electrónica, el compás 4/4 significa 4 pulsos por compás. A 128 BPM, cada compás dura aproximadamente 1.87 segundos.',
        tips: [
          'Cuenta: 1-2-3-4, 1-2-3-4...',
          'El beat 1 es el más fuerte (downbeat)',
          'Los beats 2 y 4 suelen tener la caja (snare)',
          'El beat 1 y 3 tienen el kick (en 4 on the floor)',
        ],
      },
      {
        subtitle: 'La Frase (Phrase)',
        description:
          'Una frase musical dura típicamente 8, 16 o 32 compases. Es como una oración musical con inicio y final. Las transiciones funcionan mejor al final de una frase.',
        tips: [
          '8 compases = frase corta',
          '16 compases = frase estándar',
          '32 compases = frase completa (AABB)',
          'Cuenta en grupos de 8: 8-16-24-32',
        ],
      },
      {
        subtitle: 'Secciones de una canción',
        description:
          'La mayoría de songs electrónicos siguen una estructura similar. Conocerla te ayuda a anticipar transiciones.',
        tips: [
          'Intro: 8-16 compases, establece el groove',
          'Verse/Break: 16-32 compases, desarrollo melódico',
          'Buildup: 8-16 compases, aumenta energía',
          'Drop: 16-32 compases, máximo impacto',
          'Outro: 8-16 compases, resolución',
        ],
      },
      {
        subtitle: 'Loops (Bucles)',
        description:
          'Un loop repite una sección de la canción. Los más comunes son de 1, 2, 4, 8 o 16 compases. Úsalos para extender momentos o practicar.',
        tips: [
          'Loop 1-2 compases: para tensión y efectos',
          'Loop 4 compases: groove básico',
          'Loop 8 compases: para mezclas largas',
          'Activa en beat 1 para loop perfecto',
          'Loop + filtro = texturas interesantes',
        ],
      },
    ],
  },
  {
    id: 'armonia',
    title: 'Armonía para DJs',
    icon: '🎹',
    content: [
      {
        subtitle: '¿Por qué importa la armonía?',
        description:
          'Si mezclas dos canciones en tonalidades compatibles, suenan bien juntas. Si no, puede sonar disonante. No es obligatorio saber teoría, pero ayuda.',
        tips: [
          'Igual tonalidad = siempre suena bien',
          'Tonalidades relativas = suele sonar bien',
          'Tonalidades opuestas = puede sonar raro',
        ],
      },
      {
        subtitle: 'El Círculo de Quintas',
        description:
          'Herramienta visual que muestra relaciones entre tonalidades. Las tonalidades vecinas en el círculo suenan bien juntas.',
        tips: [
          'Vecinos inmediatos = compatible',
          '2 pasos en el círculo = relativa menor',
          'Opuesto (180°) = generalmente disonante',
          'Usa apps como "Mixed In Key" para análisis',
        ],
      },
      {
        subtitle: 'BPM + Armonía = Mejor Mezcla',
        description:
          'El mejor resultado viene de igualar BPM Y tonalidad. Pero no te obsesiones: el groove y la energía son más importantes.',
        tips: [
          'Empieza con BPM, luego armonía',
          'La energía es más notoria que la armonía',
          'Practica oyendo las transiciones',
        ],
      },
    ],
  },
  {
    id: 'tecnicas',
    title: 'Técnicas de Mezcla',
    icon: '🎛️',
    content: [
      {
        subtitle: 'Crossfader',
        description:
          'Desliza de izquierda a derecha para mezclar entre dos canciones. En el centro ambas suenan por igual.',
        tips: [
          'Izquierda = Deck A, Centro = ambos, Derecha = Deck B',
          'Usa EQ para evitar conflictos de frecuencia',
          'Crossfader curve afecta cómo suena el fade',
        ],
      },
      {
        subtitle: 'EQ (Ecualizador)',
        description:
          'Divide el espectro en graves (low), medios (mid) y agudos (high). Bajar los graves de una canción mientras subes los de otra evita el "muddy sound".',
        tips: [
          'Low (20-250 Hz): bass, kick',
          'Mid (250 Hz-4 kHz): voces, melodía, snare',
          'High (4 kHz-20 kHz): hi-hats, air, efectos',
          'Corta graves antes de mezclar, luego añade',
        ],
      },
      {
        subtitle: 'Filtros (Filter)',
        description:
          'Corta progresivamente frecuencias agudas (low-pass) o graves (high-pass). Ideal para transiciones suaves.',
        tips: [
          'LP filter + fader = transición clásica',
          'HP filter: efecto "radio" o "teléfono"',
          'Filter sweep: mueve el filtro para efecto',
        ],
      },
    ],
  },
  {
    id: 'efectos',
    title: 'Efectos de DJ',
    icon: '✨',
    content: [
      {
        subtitle: 'Reverb',
        description:
          'Añade "espacio" y profundidad. Hace que el sonido parezca estar en una sala o entorno.',
        tips: [
          'Reverb corto = room ambience',
          'Reverb largo = efectos dramáticos',
          'Con buildup = aumenta tensión',
        ],
      },
      {
        subtitle: 'Echo / Delay',
        description:
          'Repite el sonido con delay. Perfecto para acapellas y efectos rítmicos.',
        tips: [
          'Delay sincronizado al BPM = groove',
          'Echo out = canción se desvanece con ecos',
          'Feedback = número de repeticiones',
        ],
      },
      {
        subtitle: 'Flanger / Phaser',
        description:
          'Efectos de modulación que crean movimiento. Flanger es más dramático, phaser más sutil.',
        tips: [
          'Phaser = sonido "envolvente"',
          'Flanger = sonido "metálico"',
          'Úsalo en buildup para aumentar tensión',
        ],
      },
    ],
  },
  {
    id: 'scratch',
    title: 'Scratch Básico',
    icon: '📀',
    content: [
      {
        subtitle: '¿Qué es el scratch?',
        description:
          'Técnica de manipulación del vinyl o digital que crea sonidos rítmicos. En digital, se hace con los jog wheels.',
        tips: [
          'Origen: turntablism en hip-hop',
          'Requiere práctica intensiva',
          'Los jog wheels emulan vinyl',
        ],
      },
      {
        subtitle: 'Transform / Chop',
        description:
          'Activas el cue point repetidamente mientras mueves el crossfader. Crea un patrón rítmico.',
        tips: [
          'Cue + crossfader = transform básico',
          'Patrones: 1-2-3-4, 1-and-2-and',
          'Practica primero sin música',
        ],
      },
    ],
  },
  {
    id: 'transiciones',
    title: 'Tipos de Transición',
    icon: '🔄',
    content: [
      {
        subtitle: 'Blend (Fondo)',
        description:
          'Las dos canciones suenan simultáneamente mientras ajustas volúmenes. La más clásica y versátil.',
        tips: [
          'Song A al 100%, B al 0%',
          'Gradualmente baja A, sube B',
          'Usa filtro para suavizar',
          '8-16 compases de transición',
        ],
      },
      {
        subtitle: 'Cut (Corte)',
        description:
          'Cambio instantáneo de una canción a otra. Común en hip-hop y scratch.',
        tips: [
          'Crossfader de un lado a otro rápido',
          'Timing con el beat es esencial',
        ],
      },
      {
        subtitle: 'EQ Transition',
        description:
          'Usas el EQ para hacer "espacio" antes de introducir la nueva canción.',
        tips: [
          'Corta graves de la saliente primero',
          'Añade graves de la entrante después',
          'Crea "efecto de radar"',
        ],
      },
      {
        subtitle: 'Filter Transition',
        description:
          'Usas filtros para crear transición. Baja el filtro de una mientras subes el de otra.',
        tips: [
          'LP filter en saliente = "fade out"',
          'HP filter en entrante = "fade in"',
          'Combina con reverb para suavidad',
        ],
      },
    ],
  },
  {
    id: 'generos',
    title: 'Géneros y Sus Características',
    icon: '🎶',
    content: [
      {
        subtitle: 'House',
        description:
          '4/4 steady, bass en 1 y 3. Usualmente 120-130 BPM. Varios subgéneros: deep, tech, progressive.',
        tips: [
          'Estructura: intro→verse→buildup→drop→outro',
          'Transiciones suaves funcionan bien',
          'Loop de 4-8 compases es común',
        ],
      },
      {
        subtitle: 'Techno',
        description:
          'Repetitivo, minimal, usualmente 120-150 BPM. Énfasis en groove y atmosphere.',
        tips: [
          'Estructura más larga y repetitiva',
          'Usa efectos para crear tensión',
        ],
      },
      {
        subtitle: 'Drum & Bass',
        description: 'Rápido (160-180 BPM), broken beat. Basslines complejas.',
        tips: [
          'BPM alto = transiciones más cortas',
          'Busca "breakdowns" para mezclar',
        ],
      },
      {
        subtitle: 'Hip-Hop / Rap',
        description: 'Varía mucho (80-100 BPM típico). Énfasis en vocals y groove.',
        tips: [
          'Acapellas son muy útiles',
          'Cuts y scratches son parte del estilo',
        ],
      },
    ],
  },
  {
    id: 'equipo',
    title: 'Equipo de DJ',
    icon: '🎧',
    content: [
      {
        subtitle: 'Controladora',
        description:
          'Dispositivo que conecta al ordenador. Tiene jog wheels, faders, knobs. Funciona con software como Mixxx, Traktor, Virtual DJ.',
        tips: [
          'Entry-level: Numark DJ2GO, Hercules DJControl',
          'Mid-range: Pioneer DDJ-400, Numark Mixtrack',
          'High-end: Pioneer DDJ-1000, Denon DJ',
        ],
      },
      {
        subtitle: 'Auriculares',
        description:
          'Esenciales para pre-listen (PFL). Busca circumaurales con buen aislamiento.',
        tips: [
          'Busca "DJ headphones" específicos',
          'Conector 1/8" y 1/4"',
          'Cómodas para uso prolongado',
        ],
      },
    ],
  },
  {
    id: 'mixxx',
    title: 'Guía de Mixxx',
    icon: '💿',
    content: [
      {
        subtitle: 'Interfaz básica',
        description:
          'Mixxx tiene 2 decks (A y B), un mixer central, y librería de songs.',
        tips: [
          'Deck A = songs izquierda',
          'Deck B = songs derecha',
          'Master = salida principal',
          'Headphones = preview',
        ],
      },
      {
        subtitle: 'Sync',
        description:
          'Beat Sync alinea los beats de ambas canciones. Master Sync mantiene el tempo en todos los decks.',
        tips: [
          'Activa Master Sync en deck con mejor beatgrid',
          'Desactiva para ajustes manuales',
        ],
      },
      {
        subtitle: 'Hotcues',
        description:
          'Puntos de memoria que puedes marcar en cualquier momento. Útiles para jumps, loops, y recordar secciones.',
        tips: [
          'Click vacío = setea cue',
          'Click en cue = reproduce desde ahí',
          'Colores = organiza por tipo',
        ],
      },
    ],
  },
  {
    id: 'practica',
    title: 'Plan de Práctica',
    icon: '📝',
    content: [
      {
        subtitle: 'Semana 1: Escucha Activa',
        description:
          'Antes de mezclar, escucha cada canción completa. Usa Practice Room para marcar: intro, buildup, drop, outro.',
        tips: [
          '1-2 songs por sesión al principio',
          'Marca todos los tipos de secciones',
          'Identifica el "clímax" de cada song',
        ],
      },
      {
        subtitle: 'Semana 3: Transiciones Simples',
        description:
          'Mezcla usando solo crossfader y volumen. Elige 2 songs del mismo género y BPM similar (dentro de 5 BPM).',
        tips: [
          'Song A al 100%, B al 0%',
          '8-16 compases de transición',
          'Mezcla al final de frase',
        ],
      },
      {
        subtitle: 'Semana 5: Beatmatching Manual',
        description:
          'Intenta syncar sin el botón sync. Ajusta pitch/tempo con los jog wheels.',
        tips: [
          'Usa auriculares para comparar beats',
          'No te frustres si cuesta al principio',
          'Verifica con sync después',
        ],
      },
      {
        subtitle: 'Semana 8+: Graba y Evalúa',
        description:
          'Graba tus sesiones. Escucha después e identifica qué salió bien y qué mejorar.',
        tips: [
          'Mixxx tiene función de grabar',
          'Toma notas de transiciones problemáticas',
          'Cada vez mejorarás más',
        ],
      },
    ],
  },
  {
    id: 'tips-finales',
    title: 'Consejos Finales',
    icon: '💡',
    content: [
      {
        subtitle: 'Prepara tu sesión',
        description:
          'Antes de tocar, organiza tus songs por BPM, género, o energía.',
        tips: [
          'Analiza BPM antes de mezclar',
          'Marca hotcues de antemano',
          'Ordena por estilo/energía',
        ],
      },
      {
        subtitle: 'Mantén la calma',
        description:
          'Si algo sale mal, mantén la compostura. El público no nota tanto como tú.',
        tips: [
          'Transiciones malas no son el fin',
          'Recupera el groove rápido',
          'La confianza es clave',
        ],
      },
      {
        subtitle: 'Practica, practica, practica',
        description:
          'No hay shortcuts. Cuanto más practiques, mejor sonarás.',
        tips: [
          '10 minutos diarios > una vez por semana',
          'Graba y escucha tus sesiones',
          'Diviértete en el proceso',
        ],
      },
    ],
  },
];

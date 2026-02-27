/**
 * Contenido educativo sobre mezcla de música electrónica
 * Dirigido a DJs principiantes
 */

export interface LearningSection {
  id: string;
  title: string;
  icon: string;
  content: LearningItem[];
}

export interface LearningItem {
  subtitle: string;
  description: string;
  tips?: string[];
}

export const LEARNING_CONTENT: LearningSection[] = [
  {
    id: 'bpm-tempo',
    title: 'BPM y Tempo',
    icon: '⏱️',
    content: [
      {
        subtitle: '¿Qué es el BPM?',
        description: 'Beats Per Minute (BPM) es la medida del tempo o velocidad de una canción. Indica cuántos beats (pulsos) caben en un minuto. A mayor BPM, más rápida es la canción.',
        tips: [
          'House: 120-130 BPM',
          'Techno: 120-150 BPM',
          'Trance: 138-145 BPM',
          'Drum & Bass: 160-180 BPM',
          'Dubstep: 140 BPM (aprox)',
          'Hip-hop: 80-100 BPM'
        ]
      },
      {
        subtitle: 'Pitch/Tempo Control',
        description: 'El slider de pitch cambia la velocidad de la canción. Moverlo arriba (+) aumenta velocidad y tono, abajo (-) los decreases. En控制的 digital, puedes ajustar solo tempo sin afectar tono.',
        tips: [
          'Pequeños ajustes (+/- 3%) suenan naturales',
          'Ajustes grandes (+/- 8%) se notan mucho',
          'Usa "key lock" o "pitch adjust" para mantener tono',
          'Practica syncing con ajustes mínimos primero'
        ]
      },
      {
        subtitle: 'Beatmatching',
        description: 'Proceso de igualar el tempo de dos canciones. Si una está a 128 BPM y otra a 130 BPM, ajusta la más rápida o lenta hasta que coincidan.',
        tips: [
          'Escucha los beats con auriculares en un oído',
          'Ajusta tempo primero, luego refine con jog',
          'Usa los BPM displays como guía inicial',
          'Practica sin sync para aprender'
        ]
      },
      {
        subtitle: 'Master Tempo / Key Lock',
        description: 'Feature que mantiene el tono original de la canción aunque cambies la velocidad. Essential para mixing sin afectar la tonalidad.',
        tips: [
          'Actívalo si vas a hacer grandes cambios de tempo',
          'Desactívalo para эффекты de speed-up/down',
          'En Mixxx: Opción "Rate Temperature"'
        ]
      }
    ]
  },
  {
    id: 'estructura',
    title: 'Estructura Musical',
    icon: '🎵',
    content: [
      {
        subtitle: 'El Compás (Beat)',
        description: 'Un compás es la unidad básica del ritmo. En música electrónica, el compás 4/4 significa 4 pulsos por compás. A 128 BPM, cada compás dura aproximadamente 1.87 segundos.',
        tips: [
          'Cuenta: 1-2-3-4, 1-2-3-4...',
          'El beat 1 es el más fuerte (downbeat)',
          'Los beats 2 y 4 suelen tener la caja (snare)',
          'El beat 1 y 3 tienen el kick (en 4 on the floor)'
        ]
      },
      {
        subtitle: 'La Frase (Phrase)',
        description: 'Una frase musical dura típicamente 8, 16 o 32 compases. Es como una oración musical con inicio y final. Las transiciones funcionan mejor al final de una frase.',
        tips: [
          '8 compases = frase corta (2 bars de 4)',
          '16 compases = frase estándar',
          '32 compases = frase completa (AABB)',
          'Cuenta en grupos de 8: 8-16-24-32'
        ]
      },
      {
        subtitle: 'Secciones de una canción',
        description: 'La mayoría de songs electrónicos siguen una estructura similar. Conocerla te ayuda a anticipartransiciones.',
        tips: [
          'Intro: 8-16 compases, establece el groove',
          'Verse/Break: 16-32 compases, desarrollo melódico',
          'Buildup: 8-16 compases, aumenta energía',
          'Drop: 16-32 compases, máximo impacto',
          'Outro: 8-16 compases, resolución'
        ]
      },
      {
        subtitle: 'Loops (Bucles)',
        description: 'Un loop repite una sección de la canción. Los más comunes son de 1, 2, 4, 8 o 16 compases. Úsalos para extender momentos o practicar.',
        tips: [
          'Loop 1-2 compases: para tensión y efectos',
          'Loop 4 compases: groove básico',
          'Loop 8 compases: para mezclas largas',
          'Activa en beat 1 para loop perfecto',
          'Loop + filtro = texturas interesantes'
        ]
      },
      {
        subtitle: 'Loops de entrada y salida',
        description: 'Los loopssave te permiten marcar un punto de inicio (in) y final (out) manualmente para crear loops precisos.',
        tips: [
          'In: donde quieres que empiece el loop',
          'Out: donde quieres que termine',
          'Adjust mientras suena para precisión',
          'Hotcue + loop = workflow rápido'
        ]
      }
    ]
  },
  {
    id: 'armonia',
    title: 'Armonía para DJs',
    icon: '🎹',
    content: [
      {
        subtitle: '¿Por qué importa la armonía?',
        description: 'Si mezclas dos canciones en tonalidades compatibles, suenan bien juntas. Si no, puede sonar dissonante. No es obligatorio saber teoría, pero ayuda.',
        tips: [
          'Igual tonalidad = siempre suena bien',
          'Tonalidades relativas = suele sonar bien',
          'Tonalidades opuestas = puede sonar raro',
          'Con sync, puedes "esconder" disarmonía'
        ]
      },
      {
        subtitle: 'El Círculo de Quintas',
        description: 'Herramienta visual que muestra relaciones entre tonalidades. Las tonalidades vecinas en el círculo suenan bien juntas.',
        tips: [
          'Vecinos inmediatos = compatible',
          '2 pasos en el círculo = relativa menor',
          'Opuesto (180°) = geralmente dissonante',
          'Usa apps como "Mixed In Key" para análisis'
        ]
      },
      {
        subtitle: 'Compatible Energy',
        description: 'Además de armonía, considera la energía. Mezclar songs de energías muy diferentes puede romper el flow.',
        tips: [
          'Buildup → Drop = energía creciente',
          'Drop → Outro = energía decreciente',
          'Match energies similares para flow suave',
          'Contrast intentionally para efectos dramáticos'
        ]
      },
      {
        subtitle: 'BPM + Armonía = Mejor Mezcla',
        description: 'El mejor resultado viene de igualar BPM Y tonalidad. Pero no te obsesiones: el groove y la energía son más importantes.',
        tips: [
          'Empieza con BPM, luego harmonía',
          'Con sync, la harmonía importa menos',
          'La energía es más notoria que la armonía',
          'Practica oyendo las transiciones'
        ]
      }
    ]
  },
  {
    id: 'tecnicas',
    title: 'Técnicas de Mezcla',
    icon: '🎛️',
    content: [
      {
        subtitle: 'Crossfader',
        description: 'Desliza de izquierda a derecha para mezclar entre dos canciones. En el centro ambas suenan por igual. Los DJs avanzados lo usan para cortes rápidos (tapado).',
        tips: [
          'Izquierda = Deck A, Centro = ambos, Derecha = Deck B',
          'Usa EQ para evitar conflictos de frecuencia',
          'Tapado rápido: A→B→A con movimientos cortos',
          'Crossfader curve afecta cómo suena el fade'
        ]
      },
      {
        subtitle: 'EQ (Ecualizador)',
        description: 'Divide el espectro en graves (low), medios (mid) y agudos (high). Bajar los graves de una canción mientras subes los de otra evita el "muddy sound".',
        tips: [
          'Low (20-250Hz): bass, kick - conflcha mucho',
          'Mid (250Hz-4kHz): voces, melodic, snare',
          'High (4kHz-20kHz): hi-hats, air, efectos',
          'Corta graves antes de mezclar, luego add',
          'EQ + Filtro = transitions limpios'
        ]
      },
      {
        subtitle: 'Filtros (Filter)',
        description: 'Corta progresivamente frecuencias agudas (low-pass) o graves (high-pass). Ideal para transiciones suaves porque las canciones se "funden" naturalmente.',
        tips: [
          'LP filter + fader = transición classic',
          'HP filter: efecto "radio" o "teléfono"',
          'Filter sweep: mueve el filtro para efecto',
          'Combina filtro + loop para crear rhythms'
        ]
      },
      {
        subtitle: 'Gain/Trim',
        description: 'Ajusta el volumen de entrada de cada canal. Antes de mezclar, asegúrate de que ambas canciones tengan volumen similar.',
        tips: [
          'Usa los medidores LED como guía',
          'El punto 0dB es el máximo sin distorsión',
          'Ajusta gain antes de empezar la transición',
          'Level matching > EQ para empezar'
        ]
      },
      {
        subtitle: 'Volume Fader',
        description: 'El fader de volumen controla cuánto de cada deck sale a los speakers. Úsalo para balancear y hacer transiciones.',
        tips: [
          'Fader up = más volumen, down = menos',
          'Crossfader + faders = control completo',
          'Pre-fader listening (PFL) = escucha sin master',
          'Fader start = activa play con el fader'
        ]
      }
    ]
  },
  {
    id: 'efectos',
    title: 'Efectos de DJ',
    icon: '✨',
    content: [
      {
        subtitle: 'Reverb',
        description: 'Añade "espacio" y profundidad. Hace que el sonido parezca estar en una sala o entorno. Úsalo con voces o samples cortos.',
        tips: [
          'Corto (hall) = room ambience',
          'Largo (cathedral) = efectos dramáticos',
          'Con buildup = aumenta tensión',
          'Demasiado reverb = pierde punch'
        ]
      },
      {
        subtitle: 'Echo / Delay',
        description: 'Repite el sonido con delay. Similar al reverb pero más definido. Perfecto para acapellas y efectos rítmicos.',
        tips: [
          'Echo = repetición del sonido',
          'Delay sincronizado al BPM = groove',
          'Echo out = canción se desvanece con ecos',
          'Feedback = número de repeticiones'
        ]
      },
      {
        subtitle: 'Flanger / Phaser',
        description: 'Efectos de modulación que crean movimiento. Flanger es más dramático, phaser más sutil.',
        tips: [
          'Phaser = sonido "envolvent"',
          'Flanger = sonido "metálico"',
          'Úsalo en buildup para aumentar tensión',
          'Light touch = más efectivo'
        ]
      },
      {
        subtitle: 'Noise / Sweeps',
        description: 'Efectos de transición que ayudan a ocultar cambios. Un sweep de filtro o ruido esconde una transición.',
        tips: [
          'Filter sweep = abrir/cerrar filtro',
          'White noise = transiciones dramáticas',
          'Air raid = efecto clásico de techno',
          'Usa antes del drop para hyping'
        ]
      },
      {
        subtitle: 'Beatjump / Loop Roll',
        description: 'Beatjump salta adelante/atrás por beats. Loop roll crea un loop corto sobre el beat actual.',
        tips: [
          'Beatjump 1 = mueve 1 beat',
          'Loop roll = loop de 1/2/4 beats repetido',
          'Efectivo en el drop para energía extra',
          'Combina con efectos para crear neuen patterns'
        ]
      }
    ]
  },
  {
    id: 'scratch',
    title: 'Scratch Básico',
    icon: '📀',
    content: [
      {
        subtitle: '¿Qué es el scratch?',
        description: 'Técnica de manipulación del vinyl o digital que crea sonidos rítmicos. En digital, se hace con los jog wheels.',
        tips: [
          'Origen: turntablism en hip-hop',
          'Requiere práctica intensiva',
          'Los jog wheels emulan vinyl',
          'Empieza con técnicas básicas'
        ]
      },
      {
        subtitle: 'Transform / Chop',
        description: 'Activas el cue point repetidamente mientras mueves el crossfader. Crea un patrón rítmico.',
        tips: [
          'Cue + crossfader = transform básico',
          'Patrones: 1-2-3-4, 1-and-2-and',
          'Combina con движения del jog',
          'Practica primero sin música'
        ]
      },
      {
        subtitle: 'Drag / Brake',
        description: 'Ralentizas el vinyl/jog para crear efecto. Brake frena completamente, drag frena parcialmente.',
        tips: [
          'Jog forward = efecto "spin back"',
          'Jog backward = efecto "reverse"',
          'Úsalo al final de frases',
          'Combina con reverb para ambient'
        ]
      },
      {
        subtitle: 'Orbit / Figure 8',
        description: 'Mueves el jog en patrón circular. Crea un "wobble" automático que suena como un efecto.',
        tips: [
          'Mueve en círculo suave = wobble',
          'Mueve rápido = glitch effect',
          'Timing con el beat = groove',
          'Experimenta con velocidad'
        ]
      }
    ]
  },
  {
    id: 'transiciones',
    title: 'Tipos de Transición',
    icon: '🔄',
    content: [
      {
        subtitle: 'Blend (Fondo)',
        description: 'Las dos canciones suenan simultáneamente mientras ajustas volúmenes. La más clásica y versátil.',
        tips: [
          'Song A al 100%, B al 0%',
          'Gradualmente baja A, sube B',
          'Usa filtro para suavizar',
          '8-16 compases de transición'
        ]
      },
      {
        subtitle: 'Cut (Corte)',
        description: 'Cambio instantáneo de una canción a otra. Común en hip-hop y scratch.',
        tips: [
          'Crossfader de un lado a otro rápido',
          'Sin overlap',
          'Timing con el beat es esencial',
          'Practica para que suene natural'
        ]
      },
      {
        subtitle: 'EQ Transition',
        description: 'Usas el EQ para hacer "espacio" antes de introducir la nueva canción.',
        tips: [
          'Corta graves de la saliente primero',
          'Añade graves de la entrante después',
          'Medios pueden coexistir mejor',
          'Crea "efecto de radar"'
        ]
      },
      {
        subtitle: 'Filter Transition',
        description: 'Usas filtros para crear transición. Baja el filtro de una mientras subes el de otra.',
        tips: [
          'LP filter en saliente = "fade out"',
          'HP filter en entrante = "fade in"',
          'Ambos filtros = efecto "teléfono"',
          'Combina con reverb para smoothness'
        ]
      },
      {
        subtitle: 'Echo Out / Reverb Out',
        description: 'Añades reverb/echo a la canción saliente mientras desaparece, luego introduces la nueva.',
        tips: [
          'Activa efecto en song saliente',
          'Baja el volumen gradualmente',
          'El efecto "oculta" el cambio',
          'Efectivo en buildup → drop'
        ]
      },
      {
        subtitle: 'Loop & Exit',
        description: 'Haces loop de la canción saliente, luego haces cut a la nueva en el momento exacto.',
        tips: [
          'Activa loop en beat 1',
          'Crea tensión con el loop',
          'En el momento correcto: cut a nueva',
          'Efectivo para transiciones drop-drop'
        ]
      }
    ]
  },
  {
    id: 'generos',
    title: 'Géneros y Sus Características',
    icon: '🎶',
    content: [
      {
        subtitle: 'House',
        description: '4/4 steady, bass en 1 y 3. обычно 120-130 BPM. Varios subgéneros: deep, tech, progressive.',
        tips: [
          'Estructura: intro→verse→buildup→drop→outro',
          'Transiciones suaves funcionan bien',
          'Usa filtros para crear groove',
          'Loop de 4-8 compases es común'
        ]
      },
      {
        subtitle: 'Techno',
        description: 'Repetitivo, minimal, usually 120-150 BPM. Énfasis en groove y atmosphere.',
        tips: [
          'Estructura más larga y repetitiva',
          'Transiciones pueden ser más largas',
          'Usa efectos para crear tensión',
          'Compatible con otros estilos de techno'
        ]
      },
      {
        subtitle: 'Trance',
        description: 'Melódico, emocional, 138-145 BPM.buildups largos y drops epic.',
        tips: [
          'Buildups de 16-32 compases son típicos',
          'Mezcla durante el breakdown melódico',
          'Usa reverb para la atmósfera',
          'Compatible con progressive house'
        ]
      },
      {
        subtitle: 'Drum & Bass',
        description: 'Rápido (160-180 BPM), broken beat. Basslines complejas.',
        tips: [
          'BPM alto = transiciones más cortas',
          'Usa sync activamente',
          'Busca "breakdowns" para mezclar',
          'Compatible con neurofunk y liquid'
        ]
      },
      {
        subtitle: 'Hip-Hop / Rap',
        description: 'Varía mucho (80-100 BPM típico). Énfasis en vocals y groove.',
        tips: [
          'Acappellas son muy useful',
          'Cuts y scratches son parte del estilo',
          'Loop de 2-4 compases común',
          'Beatmatching manual es respetado'
        ]
      },
      {
        subtitle: 'Dubstep',
        description: '140 BPM, ritmo "half-time". Bass巨大的es y wobbles.',
        tips: [
          'Drop es el momento clave',
          'Mezcla antes o después del drop',
          'Wubbas (wobble bass) son identificables',
          'Compatible con drum & bass a veces'
        ]
      }
    ]
  },
  {
    id: 'equipo',
    title: 'Equipo de DJ',
    icon: '🎧',
    content: [
      {
        subtitle: 'Controladora',
        description: 'Dispositivo que conecta al ordenador. Tiene jog wheels, faders, knobs. Funciona con software como Mixxx, Traktor, Virtual DJ.',
        tips: [
          'Entry-level: Numark DJ2GO, Hercules DJControl',
          'Mid-range: Pioneer DDJ-400, Numark Mixtrack',
          'High-end: Pioneer DDJ-1000, Denon DJ',
          'Busca jog wheels grandes para scratch'
        ]
      },
      {
        subtitle: 'Mixer',
        description: 'Panel de control de audio. Tiene ecualizadores, crossfader, volumen por canal. Puede ser parte de controladora o standalone.',
        tips: [
          '2 canales = suficiente para comenzar',
          '3+ canales = más flexibilidad',
          'Crossfader reemplazable = durabilidd',
          ' EQ de 3 bandas es estándar'
        ]
      },
      {
        subtitle: 'Auriculares',
        description: 'Esenciales para pre-listen (PFL). Busca circumaurales (que cubren la oreja) y buena aislamiento.',
        tips: [
          'Busca "DJ headphones" específicos',
          'Unilateral (un oído) es útil',
          'Conector 1/8" y 1/4"',
          'Cómodas para uso prolongado'
        ]
      },
      {
        subtitle: 'Alt speakers / Monitor',
        description: 'Necesitas escuchar el master output. En casa, usa altavoces de estudio o buen sistema de sonido.',
        tips: [
          'Monitor de estudio = sonido flat',
          'No necesitas subwoofer al principio',
          'Posicióna en altura de orejas',
          'Calibra volumen antes de mezclar'
        ]
      }
    ]
  },
  {
    id: 'mixxx',
    title: 'Guía de Mixxx',
    icon: '💿',
    content: [
      {
        subtitle: 'Interfaz básica',
        description: 'Mixxx tiene 2 decks (A y B), un mixer central, y librería de songs. Cada deck tiene su propia sección.',
        tips: [
          'Deck A = songs izquierda',
          'Deck B = songs derecha',
          'Master = salida principal',
          'Headphones = preview'
        ]
      },
      {
        subtitle: 'Beatgrid',
        description: 'Mixxx detecta automáticamente tempo y marca beats. Puedes ajustar si no es exacto. Essential para sync funcione bien.',
        tips: [
          'Shift + flechas = ajusta beatgrid',
          'Doble click en beat = mueve downbeat',
          'Verifica antes de mixing con sync',
          'Green = beatgrid good, Red = needs ajuste'
        ]
      },
      {
        subtitle: 'Sync',
        description: 'Beat Sync alinea los beats de ambas canciones. Master Sync mantiene el tempo en todos los decks.',
        tips: [
          'Activa Master Sync en deck con mejor beatgrid',
          'Sync funciona mejor con структура similar',
          'Desactiva para ajustes manuales',
          'BPM display muestra valor synced'
        ]
      },
      {
        subtitle: 'Hotcues',
        description: 'Puntos de memoria que puedes marcar en cualquier momento. Útiles para jumps, loops, y recordar secciones.',
        tips: [
          'Click vacío = setea cue',
          'Click en cue = reproduce desde ahí',
          'Shift + click = guarda loop automático',
          'Colores = organiza por tipo'
        ]
      },
      {
        subtitle: 'Loop',
        description: 'Mixxx crea loops automáticos. También puedes usar in/out points para loops precisos.',
        tips: [
          '1-4 buttons = 1/2/4/8 compases',
          'Shift + loop = loop activo',
          'In/Out = puntos manuales',
          'Loop + jog = scratch básico'
        ]
      },
      {
        subtitle: 'Sampler',
        description: 'Ranuras que reproducen audio mientras mezclas. Carga samples, efectos, vocal chops.',
        tips: [
          'Drag & drop desde librería',
          '4 samplers por deck',
          'Hotkey configurable',
          'Volumen independiente del deck'
        ]
      },
      {
        subtitle: ' waveform display',
        description: 'Muestra visualmente la canción. Las partes coloreadas = beats, las grises = melodic.',
        tips: [
          'Playhead = posición actual',
          'Zoom = más detalle',
          'Beatgrid visible en waveform',
          'Ayuda a identificar secciones'
        ]
      }
    ]
  },
  {
    id: 'practica',
    title: 'Plan de Práctica',
    icon: '📝',
    content: [
      {
        subtitle: 'Semana 1: Escucha Activa',
        description: 'Antes de mezclar, escucha cada canción completa. Usa Practice Room para marcar: intro, buildup, drop, outro. Cuenta compases entre secciones.',
        tips: [
          '1-2 songs por sesión al principio',
          'Marca todos los tipos de secciones',
          'Anota duración de cada sección',
          'Identifica el "climax" de cada song'
        ]
      },
      {
        subtitle: 'Semana 2: Familiarízate con el Equipo',
        description: 'Aprende todos los controles de tu controller/software. Prueba cada knob, fader, botón. Sin música, solo explorando.',
        tips: [
          'Lee el manual de tu equipo',
          'Prueba cada efecto sin audio',
          'Practice Room: usa solo play/pause/seek',
          'Ajusta volumen y EQ sin mezcla'
        ]
      },
      {
        subtitle: 'Semana 3: Transiciones Simples',
        description: 'Mezcla usando solo crossfader y volumen. Elige 2 songs del mismo género y BPM similar (dentro de 5 BPM).',
        tips: [
          'Song A al 100%, B al 0%',
          'Usa faders de volumen, no crossfader',
          '8-16 compases de transición',
          'Mezcla al final de frase'
        ]
      },
      {
        subtitle: 'Semana 4: Añade Filtros',
        description: 'Igual que antes, pero añade el filtro low-pass a la canción saliente. Nota la diferencia en smoothness.',
        tips: [
          'Filtro + fader = combinación classic',
          'Abre filtro gradualmente',
          'Cierra filtro de entrante también',
          'Practica con diferentes canciones'
        ]
      },
      {
        subtitle: 'Semana 5: Beatmatching Manual',
        description: 'Ahora intenta syncar sin el botón sync. Ajusta pitch/tempo con los jog wheels. Empieza con songs del mismo BPM.',
        tips: [
          'Usa auriculares para comparar beats',
          'Ajusta tempo primero, luego jog',
          'No te frustrres si cuesta al principio',
          'Verifica con sync después'
        ]
      },
      {
        subtitle: 'Semana 6: Transiciones con EQ',
        description: 'Añade EQ a tus transiciones. Baja los graves de la saliente antes de mezclarla.',
        tips: [
          'Low cut en song saliente (-12dB)',
          'Añade bass de entrante gradualmente',
          'Medios pueden estar presentes',
          'High EQ = menos prominente'
        ]
      },
      {
        subtitle: 'Semana 7: variety de Géneros',
        description: 'Practica mixing entre diferentes géneros. Nota qué combinaciones funcionan mejor.',
        tips: [
          'House → Tech House = fácil',
          'Trance → Progressive = clásico',
          'Hip-hop acapella sobre House = boom',
          'Experimenta y anota qué funciona'
        ]
      },
      {
        subtitle: 'Semana 8+: Graba y Evalúa',
        description: 'Graba tus sesiones. Escucha depois e identifica qué salió bien y qué mejorar.',
        tips: [
          'Mixxx tiene función de grabar',
          'Escucha con críticos oides',
          'Toma notas de transiciones problemáticas',
          'Cada vez mejorarás más'
        ]
      }
    ]
  },
  {
    id: 'tips-finales',
    title: 'Consejos Finales',
    icon: '💡',
    content: [
      {
        subtitle: 'Prepara tu sesión',
        description: 'Antes de tocar, organiza tus songs por BPM, género, o energía. Prepara la lista (playlist) de antemano.',
        tips: [
          'Analiza BPM antes de mezclar',
          'Marca hotcues de antemano',
          'Ordena por estilo/energía',
          'Ten backups por si acaso'
        ]
      },
      {
        subtitle: 'Lee a la sala',
        description: 'En un contexto real, observa a la audiencia. Adapta tu set según la energía del room.',
        tips: [
          'Si el floor está quiet, acelera',
          'Si está full, mantén energía',
          'Lee el lenguaje corporal',
          'No tengas miedo de cambiar plan'
        ]
      },
      {
        subtitle: 'Mantén la calma',
        description: 'Si algo sale mal (bad beatmatch, song wrong), mantén la compostura. El público no nota tanto como tú.',
        tips: [
          'Transiciones bad no son el fin',
          'Recupera el groove pronto',
          'Pausa y restart si es necesario',
          'La confianza es clave'
        ]
      },
      {
        subtitle: 'Practica, practica, practica',
        description: 'No hay shortcuts. Cuanto más practiques, mejor sonarás. Usa cada oportunidad para mejorar.',
        tips: [
          '10 minutos diarios > una vez por semana',
          'Graba y escucha tus sesiones',
          'Estudia a DJs que admiras',
          'Diviértete en el proceso'
        ]
      }
    ]
  }
];

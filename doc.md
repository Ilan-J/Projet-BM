# LaunchPad

quand on lance le programme il ouvre un page web avec les plusier option 

on peut cliqué sur les boutons pour activer une function

## Simon

### Utilisation de Simon

Lorsque l'utilisateur appuie sur le bouton Simon, la fonction `game_start` est appelée dans le programme.

Le pad affichera un menu avec trois boutons : deux pour la sélection et un pour la confirmation. Ces boutons permettent de sélectionner le nombre de joueurs (en cours de développement).

Lorsque le joueur appuie sur le bouton vert, le jeu commence. Le pad affichera une séquence de touches à mémoriser que le joueur doit reproduire dans le bon ordre. Si le joueur réussit, la partie continue avec une note supplémentaire. En cas d'erreur, le jeu s'arrête et deux boutons apparaissent : un bouton rouge pour arrêter le programme et un bouton vert pour recommencer.

## Home Assistant

Le LaunchPad est intégré via WebHook.

### Connexion à Home Assistant

1. Créer un compte local administrateur sur Home Assistant.

2. Dans le profile utilisateur aller les paramètres de securité et créer un jeton de long durée.

3. Enregistrer le jeton dans la configuration du LaunchPad.

### Réception des événements dans Home Assistant

Ajouter un déclencheur manuel sur l'événement `launchpad_note_on` ou `launpad_note_off`.

Optionnellement il est possible de filtrer les notes.

|  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 | Comment        |
|----|----|----|----|----|----|----|----|----------------|
| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | Line 1         |
| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 |                |
| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 |                |
| 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 |                |
| 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 |                |
| 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 |                |
| 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 |                |
| 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | Line 8         |
|  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 | Control bottom |
| 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | Control top    |
| 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | Control left   |
| 19 | 29 | 39 | 49 | 59 | 69 | 79 | 89 | Control right  |

### Transmition d'événement dans Home Assistant

Ajouter un déclenchement manuel.

- Les événements `launchpad_tile_on` avec comme paramètre `tile`, `color` et optionnellement `time`, et `launpad_tile_off`, permettent de controller les touches individuellement.

- L'événement `launchpad_clear` permet de remettre à zero le LaunchPad.

- `launchpad_animation`

- `launchpad_stop_annimation`

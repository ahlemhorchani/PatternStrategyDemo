# DemoStrategy3D - Contrôle de Drone en 3D avec Blazor et Three.js

##  Description du projet

DemoStrategy3D est un projet Blazor WebAssembly qui permet de contrôler un drone en 3D directement depuis un navigateur web.  
Le projet utilise le **patron de conception Strategy** pour gérer différents comportements de déplacement du drone, et **Three.js** pour le rendu 3D.  

Le drone peut avancer ou tourner à gauche/droite selon la stratégie choisie par le client.  
Le rendu et les mouvements sont synchronisés via **JavaScript interop** (`IJSRuntime`) entre Blazor et Three.js.

---

## Fonctionnalités

1. **Affichage du drone en 3D**  
   - Drone chargé depuis un fichier `drone.glb`.  
   - Sol et grille pour visualiser le déplacement.

2. **Contrôle via clavier**  
   - `M` : Avancer  
   - `L` : Tourner à gauche  
   - `R` : Tourner à droite  
   - Les mouvements sont animés de façon fluide.

3. **Affichage des informations**  
   - Position X et Z du drone.  
   - Rotation actuelle du drone.  
   - État du drone : chargement, prêt ou erreur.

4. **Patron de conception Strategy**  
   - Séparation entre le **contexte** (`DroneContext`) et les **stratégies concrètes** (`MoveForwardStrategy`, `TurnLeftStrategy`, `TurnRightStrategy`).  
   - Permet d’ajouter facilement de nouvelles stratégies de déplacement.

---

## Architecture du projet

### 1. Pages

- `Drone.razor` : page principale qui affiche le drone et capture les événements clavier.  
  - Agit comme **Client** du patron Strategy.

### 2. Dossier Strategy

- `DroneContext.cs` : le **contexte** qui détient la stratégie active et délègue le mouvement via `MoveAsync`.  
- `IDirectionStrategy.cs` : interface commune pour toutes les stratégies de déplacement.  
- `MoveForwardStrategy.cs` : avance le drone (`ExecuteAsync`).  
- `TurnLeftStrategy.cs` : fait tourner le drone à gauche (`ExecuteAsync`).  
- `TurnRightStrategy.cs` : fait tourner le drone à droite (`ExecuteAsync`).  
- `StrategyType.cs` : énumération pour sélectionner la stratégie.

### 3. wwwroot/js

- `threeInterop.js` : interop JavaScript pour gérer le rendu Three.js et l’animation du drone.

### 4. wwwroot/models

- `drone.glb` : modèle 3D du drone.

---

## Comment ça fonctionne

1. Le client (Drone.razor) capture une touche clavier.  
2. Selon la touche (`M`, `L`, `R`), il sélectionne une stratégie via `DroneContext.SetDirectionStrategy`.  
3. `DroneContext.MoveAsync` délègue le mouvement à la stratégie active.  
4. La stratégie exécute le mouvement réel via `ExecuteAsync` et appelle une fonction JavaScript (`threeJSInterop.moveForward`, `turnLeft`, `turnRight`).  
5. Three.js anime le drone dans le canvas 3D et renvoie les coordonnées à Blazor via `JSInvokable`.

---

## 🔹 Diagramme UML du patron Strategy


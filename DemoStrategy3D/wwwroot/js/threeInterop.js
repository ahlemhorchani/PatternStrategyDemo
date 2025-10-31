   // threeInterop.js - Version compatible Blazor sans modules ES6
   let scene, camera, renderer, drone, objRef;  // Ajout de objRef
   let angle = 0;
   let targetRotation = 0;
   let forwardDistance = 0;
   let pointLight;

   function initScene(containerId, dotNetObjRef) {  // Ajout de dotNetObjRef
       objRef = dotNetObjRef;  // Stocker la référence
       const container = document.getElementById(containerId);
       if (!container) {
           console.error('Container not found:', containerId);
           return;
       }

       // Nettoyer le contenu existant
       container.innerHTML = '';

       // Créer le canvas
       const canvas = document.createElement('canvas');
       canvas.id = 'droneCanvas';
       container.appendChild(canvas);

       renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
       renderer.setSize(container.clientWidth, container.clientHeight);

       scene = new THREE.Scene();
       scene.background = new THREE.Color(0x101820);

       camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
       camera.position.set(0, 3, 6);
       camera.lookAt(0, 0, 0);

       // Lumière ambiante
       const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
       scene.add(ambientLight);

       // Lumière directionnelle
       const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
       directionalLight.position.set(5, 5, 5);
       scene.add(directionalLight);

       pointLight = new THREE.PointLight(0xffffff, 1);
       pointLight.position.set(5, 5, 5);
       scene.add(pointLight);

       // Créer un drone simple (cube avec des hélipes)
       createSimpleDrone();

       // Ajouter un sol
       addGround();

       animate();

       // Gérer le redimensionnement
       window.addEventListener('resize', () => {
           camera.aspect = container.clientWidth / container.clientHeight;
           camera.updateProjectionMatrix();
           renderer.setSize(container.clientWidth, container.clientHeight);
       });
   }

   function createSimpleDrone() {
       const loader = new THREE.GLTFLoader();
       loader.load('models/drone.glb', (gltf) => {
           drone = gltf.scene;
           scene.add(drone);
           console.log('Drone GLB chargé avec succès.');
           // Notifier Blazor que le drone est prêt
           if (objRef) {
               objRef.invokeMethodAsync("OnDroneLoaded");
           }
       }, undefined, (error) => {
           console.error('Erreur lors du chargement du GLB:', error);
           // Notifier Blazor en cas d'erreur
           if (objRef) {
               objRef.invokeMethodAsync("OnDroneLoadError", error.message);
           }
       });
   }

   function addGround() {
       const groundGeometry = new THREE.PlaneGeometry(20, 20);
       const groundMaterial = new THREE.MeshStandardMaterial({ 
           color: 0x3a3a3a,
           roughness: 0.8,
           metalness: 0.2
       });
       const ground = new THREE.Mesh(groundGeometry, groundMaterial);
       ground.rotation.x = -Math.PI / 2;
       ground.position.y = -0.5;
       scene.add(ground);

       // Grille pour mieux voir les déplacements
       const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
       scene.add(gridHelper);
   }

   async function animate() {  // Rendre async pour les appels
       requestAnimationFrame(animate);

       // Rotation fluide
       angle += (targetRotation - angle) * 0.1;
       if (drone) {
           drone.rotation.y = angle;

           // Avance fluide
           if (forwardDistance > 0) {
               const dx = Math.sin(angle) * 0.05;
               const dz = Math.cos(angle) * 0.05;
               drone.position.x += dx;
               drone.position.z += dz;
               drone.rotation.x = -0.2; // léger inclinaison avant
               forwardDistance -= 0.05;
           } else {
               drone.rotation.x = 0;
           }

           // Faire suivre la lumière et la caméra
           pointLight.position.x = drone.position.x + 2;
           pointLight.position.z = drone.position.z + 2;
           
           // Camera suit le drone
           camera.position.x = drone.position.x;
           camera.position.z = drone.position.z + 6;
           camera.lookAt(drone.position.x, drone.position.y, drone.position.z);

           // Synchroniser la position et la rotation avec Blazor
           if (objRef) {
               await objRef.invokeMethodAsync("UpdateDronePosition", drone.position.x, drone.position.z, angle);
           }
       }

       if (renderer && scene && camera) {
           renderer.render(scene, camera);
       }
   }

   function moveForward() {
       if (!drone) {
           console.warn('Drone non chargé. Attendez que le GLB soit prêt.');
           return;
       }
       forwardDistance += 1.0; // distance à parcourir
   }

   function turnLeft() {
       if (!drone) {
           console.warn('Drone non chargé. Attendez que le GLB soit prêt.');
           return;
       }
       targetRotation += Math.PI / 6; // 30 degrés
   }

   function turnRight() {
       if (!drone) {
           console.warn('Drone non chargé. Attendez que le GLB soit prêt.');
           return;
       }
       targetRotation -= Math.PI / 6; // 30 degrés
   }

   // Exposer les fonctions globalement pour Blazor
   window.threeJSInterop = {
       initScene: initScene,
       moveForward: moveForward,
       turnLeft: turnLeft,
       turnRight: turnRight
   };
   
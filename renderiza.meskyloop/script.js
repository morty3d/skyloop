import * as THREEasd
from "three";

import { OrbitControls }
from "three/addons/controls/OrbitControls.js";

import { GLTFLoader }
from "three/addons/loaders/GLTFLoader.js";

import { HDRLoader }
from "three/addons/loaders/HDRLoader.js";


/* =========================================================
   ESCENA
========================================================= */

const viewer =
  document.getElementById(
    "viewer"
  );

const loading =
  document.getElementById(
    "loading"
  );


const scene =
  new THREE.Scene();


scene.background =
  new THREE.Color(
    "#e9ebe8"
  );



/* =========================================================
   CAMERA
========================================================= */

const camera =
  new THREE.PerspectiveCamera(
    35,
    window.innerWidth /
    window.innerHeight,
    0.01,
    10000
  );


camera.position.set(
  4,
  3,
  6
);



/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    alpha: false

  });


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    2
  )

);


renderer.setSize(

  window.innerWidth,

  window.innerHeight

);


renderer.outputColorSpace =
  THREE.SRGBColorSpace;


renderer.toneMapping =
  THREE.ACESFilmicToneMapping;


renderer.toneMappingExposure =
  0.85;


viewer.appendChild(
  renderer.domElement
);



/* =========================================================
   CONTROLES
========================================================= */

const controls =
  new OrbitControls(

    camera,

    renderer.domElement

  );


controls.enableDamping =
  true;


controls.dampingFactor =
  0.06;


controls.enablePan =
  false;


controls.enableZoom =
  true;


controls.autoRotate =
  true;


controls.autoRotateSpeed =
  0.35;

/* =========================================================
   RUEDA DEL MOUSE
   Scroll normal = navegar la web
   CTRL + rueda = zoom 3D
========================================================= */

window.addEventListener(
  "wheel",
  function(event) {

    const rect =
      renderer.domElement.getBoundingClientRect();

    const sobreVisor =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!sobreVisor) return;


    // CTRL + rueda = dejamos actuar OrbitControls
    if (event.ctrlKey || event.metaKey) {
      return;
    }


    // Rueda normal:
    // no dejamos que OrbitControls capture el evento.
    // El navegador hace scroll normalmente.
    event.stopPropagation();

  },
  {
    capture: true,
    passive: true
  }
);

/* =========================================================
   HDR
========================================================= */

new HDRLoader().load(

  "./assets/hdr1.hdr",

  function(texture) {


    texture.mapping =

      THREE
      .EquirectangularReflectionMapping;


    scene.environment =
      texture;


    scene.environmentIntensity =
      0.55;


  }

);



/* =========================================================
   GLB
========================================================= */

const loader =
  new GLTFLoader();


loader.load(

  "./assets/skyloop.glb",


  function(gltf) {


    const model =
      gltf.scene;


    scene.add(
      model
    );



    const box =

      new THREE.Box3()
      .setFromObject(
        model
      );


    const center =

      box.getCenter(
        new THREE.Vector3()
      );


    const size =

      box.getSize(
        new THREE.Vector3()
      );



    model.position.sub(
      center
    );



    const maxDim =

      Math.max(

        size.x,

        size.y,

        size.z

      );



    const fov =

      camera.fov *

      Math.PI /

      180;



    let distance =

      maxDim /

      (
        2 *
        Math.tan(
          fov / 2
        )
      );


    distance *= 1.45;



    camera.position.set(

      distance * 0.75,

      distance * 0.38,

      distance

    );



    camera.near =
      maxDim / 100;


    camera.far =
      maxDim * 100;


    camera
      .updateProjectionMatrix();



    controls.target.set(
      0,
      -maxDim * 0.15,
      0
    );


    controls.minDistance =
      maxDim * 0.55;


    controls.maxDistance =
      maxDim * 4;


    controls.update();



    loading
      .classList
      .add(
        "hidden"
      );


  },


  undefined,


  function(error) {


    console.error(

      "Error cargando Skyloop:",

      error

    );


  }

);



/* =========================================================
   INTERACCION
========================================================= */

renderer
  .domElement
  .addEventListener(

    "pointerdown",

    () => {

      controls.autoRotate =
        false;

    }

  );



/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(

  "resize",

  () => {


    const width =
      viewer.clientWidth;


    const height =
      viewer.clientHeight;


    camera.aspect =
      width /
      height;


    camera
      .updateProjectionMatrix();


    renderer.setSize(

      width,

      height

    );


  }

);



/* =========================================================
   ANIMATE
========================================================= */

function animate() {


  requestAnimationFrame(
    animate
  );


  controls.update();


  renderer.render(

    scene,

    camera

  );


}


animate();

import * as THREE from 'three';
import _ from 'lodash';
import Chart from 'chart.js'
import MapGenerator from './MapGenerator'
import Car from './Car'
import Tree from './Tree';

window.onload = main;

function main() {
  // Renderer
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ canvas })
  
  // Camera
  const nearClipping = 20
  const farClipping = 50
  const aspect = window.innerWidth / window.innerHeight
  const d = 10
  const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, nearClipping, farClipping )
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09409B);

  camera.position.set( 20, 20, 20 ); // all components equal
  camera.lookAt( 0, 0, 0 );
  
  // Light
  {
    const color = 0xFFFFFF
    const intensity = 1
    const dirLight = new THREE.DirectionalLight(color, intensity)
    dirLight.position.set( -1, 0.75, 1 );
    dirLight.position.multiplyScalar( 50);
    scene.add(dirLight)
    dirLight.castShadow = true;

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = dirLight.shadowMapHeight = 1024*2;

    const d = 70;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;

    {
      var light = new THREE.AmbientLight( 0x404040 ); // soft white light
      scene.add( light );
    }

    {
      const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ); 
      scene.add(hemiLight)
    }
  }

  // Geometry
  renderer.render(scene, camera)
  renderer.shadowMapEnabled = true;
  
  // Add car object to scene
  const car = new Car();
  scene.add(car.object)

  // Scenery
  const map = new MapGenerator(100, 100)

  const treeGroup = new THREE.Group()
  map.mapArray.forEach((zArray, x) => {
    zArray.forEach((element, z) => {
      if (element.value === 'x') {
        const tree = new Tree(x, z).tree
        treeGroup.add(tree)
      }
    });
  });
  scene.add(treeGroup)
  treeGroup.position.x = -50
  treeGroup.position.z = -50

  // Floor
  {
    const geometry = new THREE.PlaneGeometry( 100, 100, 100 );
    const material = new THREE.MeshLambertMaterial( {color: 0x4b7d04, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
    plane.position.y = 0;
    plane.rotation.x = 1.5708;
    plane.receiveShadow = true;
  }

  let keysPressed = {}

  document.addEventListener('keyup', (e) => {
    delete keysPressed[e.code];
    car.hasStopped = true;
  })

  document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
  })
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
      renderer.setSize(width, height, false)
    }
    return needResize;
  }

  let then = Date.now();
  let frameCount = 0;
  const startTime = then
  const fps = 50
  const fpsInterval = 1000 / fps;

  const refreshRateContainer = document.querySelector('#refresh-rate');

  const render = () => {
    requestAnimationFrame(render)

    const now = Date.now();
    const elapsed = now - then;

    if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % fpsInterval);

      // Start drawing
      var sinceStart = now - startTime;
      var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
      refreshRateContainer.innerHTML =`Elapsed time= ${Math.round(sinceStart / 1000 * 100) / 100} secs @ ${currentFps} fps.`

      if(car.isRotating) {
        car.rotate()
      }

      car.changeState(keysPressed)
      if (car.isMoving) {
        const carPosition = car.movement()
        const newXPosition = Math.floor(car.object.position.x + carPosition.x) + 50
        const newZPosition = Math.floor(car.object.position.z + carPosition.z) + 50

        if (map.mapArray[newXPosition][newZPosition].value == 'x') {
          car.stop();
        } else {
          car.object.position.x += carPosition.x
          car.object.position.z -= carPosition.z
          camera.position.x += carPosition.x
          camera.position.z -= carPosition.z
        }
      }
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }
  
      renderer.render(scene, camera)
    }
  }
  requestAnimationFrame(render);


  // Graphs
  let velocityData = []
  let labels = []
  let hasLogged = false;
  let i = 0;

  const velocityChart = new Chart('chart', {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Velocity',
        borderColor: '#FF0000',
        data: velocityData,
        fill: false,
      }]
    },
  });

  window.setInterval(() => {
    if (car.isMoving) {
      i++;
      velocityData.push(car.velocity)
      labels.push(i)

      velocityChart.data.labels = labels
      velocityChart.data.datasets[0].data = velocityData
      velocityChart.update();
      
      car.hasStopped = false;
      hasLogged = false;
    } else if (car.hasStopped && !hasLogged) {
      hasLogged = true;

      velocityData = []
      labels = []
      i = 0;
    }
  }, 200)
}
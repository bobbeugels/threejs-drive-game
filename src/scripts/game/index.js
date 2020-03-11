import * as THREE from 'three';
import _ from 'lodash';
import Chart from 'chart.js'
import MapGenerator from './MapGenerator'
import Car from './Car'

window.onload = main;

function main() {
  // Renderer
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ canvas })
  
  // Camera
  const nearClipping = 1
  const farClipping = 1000
  const aspect = window.innerWidth / window.innerHeight;
  const d = 10;
  const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, nearClipping, farClipping );
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09409B);

  camera.position.set( 20, 20, 20 ); // all components equal
  camera.lookAt( 0, 0, 0 ); // or the origin
  
  // Light
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-5, 5, 5)
    scene.add(light)
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 1000;
    light.shadowMapVisible = true;
    light.castShadow = true;
    {
      const light = new THREE.AmbientLight( 0x09409B, 2 ); // soft white light
      scene.add(light)
    }
  }

  // Geometry
  renderer.render(scene, camera)
  renderer.shadowMapEnabled = true;
  
  // Add car object to scene
  const car = new Car();
  scene.add(car.object)

  // Scenery
  const map = new MapGenerator(100, 100);

  map.mapArray.forEach((zArray, x) => {
    zArray.forEach((element, z) => {
      if (element.value === 'x') {
        const boxWidth = 0.5
        const boxHeight = 1
        const boxDepth = 0.5
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
        const material = new THREE.MeshLambertMaterial({ color: 0x288b22 })
        const tree = new THREE.Mesh(geometry, material)
        scene.add(tree)
        tree.position.x = x - (map.mapArray.length / 2);
        tree.position.z = z - (zArray.length / 2);
        tree.position.y = 0.5;
        tree.castShadow = true
        tree.receiveShadow = true
      }
    });
  });

  // Floor
  {
    const geometry = new THREE.PlaneGeometry( 100, 100, 100 );
    const material = new THREE.MeshLambertMaterial( {color: 0x09409B, side: THREE.DoubleSide} );
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

  const render = (time) => {
    // time *= 0.0001

    car.changeState(keysPressed)
    if (car.isMoving) {
      const carPosition = car.movement()
      camera.position.x += carPosition.x
      camera.position.z -= carPosition.z
    }

    if(car.isRotating) {
      car.rotate()
    }
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }
  requestAnimationFrame(render);
  
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
        // backgroundColor: window.chartColors.red,
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
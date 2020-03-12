import * as THREE from 'three'
import _ from 'lodash'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import degreesToRadians from '../utils/degreesToRadians'

window.onload = main;

function main() {
  // Renderer
  const canvas = document.querySelector('#c')
  const renderer = new THREE.WebGLRenderer({ canvas })
  
  // Camera
  const camera = new THREE.PerspectiveCamera( 5, window.innerWidth / window.innerHeight, 1, 10000 )
  const controls = new OrbitControls( camera, renderer.domElement )
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09409B);

  camera.position.set( 20, 20, 20 ); // all components equal
  camera.lookAt( 0, 0, 0 );

  controls.update();
  
  // Light
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set( -1, 0.75, 1 );
    light.position.multiplyScalar( 50);
    scene.add(light)
    light.shadowCameraNear = 1;
    light.shadowCameraFar = 1000;
    light.shadowMapVisible = true;
    light.castShadow = true;
    {
      const hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 )
      scene.add(hemiLight)
    }
  }

  // Geometry
  renderer.render(scene, camera)
  renderer.shadowMapEnabled = true;

  // Reference car
  {
    const width = .5
    const height = .5
    const depth = 1
    const geometry = new THREE.BoxBufferGeometry(width, height, depth)
    const material = new THREE.MeshLambertMaterial({ color: 0x288b22 })
    const car = new THREE.Mesh(geometry, material)
    scene.add(car)
    car.position.x = -1.5
    car.position.z = 0
    car.position.y = 0.5
  }

  {
    // Car
    {
      // const radius = .2
      // const height = .15
      // const radialSegments = 12
      // const geometry = new THREE.CylinderBufferGeometry(radius, radius, height, radialSegments)
      // const material = new THREE.MeshLambertMaterial({color: 0x272727})
      // const cylinder = new THREE.Mesh(geometry, material)
      // cylinder.rotation.z = degreesToRadians(90)
      // scene.add(cylinder);

      // void ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      // Parameters
      // cp1x
      // The x-axis coordinate of the first control point.
      // cp1y
      // The y-axis coordinate of the first control point.
      // cp2x
      // The x-axis coordinate of the second control point.
      // cp2y
      // The y-axis coordinate of the second control point.
      // x
      // The x-axis coordinate of the end point.
      // y
      // The y-axis coordinate of the end point.

      var circleShape = new THREE.Shape();

      circleShape.moveTo( 0, 0 );
      circleShape.bezierCurveTo( 0, 0, 1, 1, 2, 2 );

      var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };

      var geometry = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );

      var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );

      scene.add(mesh)
    }
  }

  // Floor
  // {
  //   const geometry = new THREE.PlaneGeometry( 100, 100, 100 );
  //   const material = new THREE.MeshLambertMaterial( {color: 0x09409B, side: THREE.DoubleSide} );
  //   const plane = new THREE.Mesh( geometry, material );
  //   scene.add( plane );
  //   plane.position.y = 0;
  //   plane.rotation.x = 1.5708;
  //   plane.receiveShadow = true;
  // }
  
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

  const fps = 50
  const fpsInterval = 1000 / fps;
  let then = Date.now();
  const startTime = then
  let frameCount = 0;

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
      controls.update();

      var sinceStart = now - startTime;
      var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
      refreshRateContainer.innerHTML =`Elapsed time= ${Math.round(sinceStart / 1000 * 100) / 100} secs @ ${currentFps} fps.`

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }
  
      renderer.render(scene, camera)
    }
  }
  requestAnimationFrame(render);

}
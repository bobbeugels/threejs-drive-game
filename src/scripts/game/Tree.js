import * as THREE from 'three'
import random from 'random'
import degreesToRadians from '../utils/degreesToRadians'

export default class Tree {
  constructor(x, z) {
    this.x = x
    this.z = z
  }

  get tree() {
    // Trunk 
    {
      const radiusTop = .05
      const radiusBottom = .05
      const height = .2
      const radialSegments = 5
      const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
      const material = new THREE.MeshLambertMaterial({ color: 0xa13d2d })
      this.trunk = new THREE.Mesh(geometry, material)
      this.trunk.position.x = 0
      this.trunk.position.z = 0
      this.trunk.position.y = -.3
    }
    // Leaves
    {
      // BASE PART
      const radiusTop = .2
      const radiusBottom = .4
      const height = .4
      const radialSegments = 7
      const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
      const material = new THREE.MeshLambertMaterial({ color: 0x008864 })
      this.base = new THREE.Mesh(geometry, material)
      this.base.position.x = 0
      this.base.position.z = 0
      this.base.position.y = 0
      this.base.rotation.z = .05
      this.base.castShadow = true
    }
    {
      // MIDDLE PART
      const radiusTop = .12
      const radiusBottom = .32
      const height = .4
      const radialSegments = 7
      const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
      const material = new THREE.MeshLambertMaterial({ color: 0x006649 })
      this.middle = new THREE.Mesh(geometry, material)
      this.middle.position.x = 0
      this.middle.position.z = 0
      this.middle.position.y = .35
      this.middle.rotation.z = -.06
      this.middle.castShadow = true
    }
    {
      // TOP PART
      const radiusTop = 0;
      const radiusBottom = .2
      const height = .4
      const radialSegments = 7
      const geometry = new THREE.CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)
      const material = new THREE.MeshLambertMaterial({ color: 0x008864 })
      this.top = new THREE.Mesh(geometry, material)
      this.top.position.x = 0
      this.top.position.z = 0
      this.top.position.y = .7
      this.top.rotation.z = .03
      this.top.castShadow = true
    }
    const tree = new THREE.Group()
    tree.add(this.trunk).add(this.base).add(this.middle).add(this.top)
    const randomRotation = Math.random() * degreesToRadians(360)

    tree.rotation.y = randomRotation

    tree.position.x = this.x
    tree.position.z = this.z
    tree.position.y = 0.3

    const scale = random.float(.6, 1);
    tree.scale.x = scale
    tree.scale.y = scale
    tree.scale.z = scale

    return tree;
  }
}
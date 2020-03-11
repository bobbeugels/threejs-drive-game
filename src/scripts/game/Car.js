import * as THREE from 'three';

export default class Car {
  constructor() {
    this.main()
  }

  initialVelocity = .003
  initialAcceleration = 1
  velocity = this.initialVelocity
  acceleration = this.initialAcceleration
  accelerationDecrease = .99
  rollOutDeceleration = 1
  rollOutDecrease = .99
  maximumVelocity = .6
  rotationalSpeed = .07
  moveAngle = 0
  isMoving = false
  isAccelerating = false
  isBraking = false
  isRotating = false
  hasStopped = false
  boxWidth = 0.5
  boxHeight = 0.5
  boxDepth = 1
  material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
  geometry = new THREE.BoxGeometry(this.boxWidth, this.boxHeight, this.boxDepth)

  main = () => {
    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.position.x = 0
    this.object.position.y = .25
    this.object.castShadow = true
    this.object.receiveShadow = false
  }
}
import * as THREE from 'three';

export default class Car {
  constructor() {
    this.main()
  }

  maxVelocity = .3
  // maxAcceleration
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

  rotate = () => {
    this.object.rotation.y = this.moveAngle
  }

  movement = () => {
    // Acceleration needs improvement
    // There should be a max velocity
    // Velocity should be 0 initially
    // console.log(this.velocity / this.maxVelocity);
    // 1.0 = 0 acceleration
    // 0 = 100% acceleration

    const percentageMaxVelocity = this.velocity / this.maxVelocity;
    const acceleration = 1 - percentageMaxVelocity

    // console.log(this.acceleration);



    if (this.isBraking) {
      this.velocity -= .009
    } else  if (this.isAccelerating) {
      this.velocity += this.initialVelocity * this.acceleration
      this.acceleration = this.acceleration * this.accelerationDecrease

      if (this.velocity > this.maximumVelocity) {
        this.velocity = this.maximumVelocity
      }
    } else {
      this.velocity -= .003
    }

    if (this.velocity <= 0) {
      this.isMoving = false
      this.velocity = this.initialVelocity
      this.acceleration = this.initialAcceleration
    }

    const z = this.velocity * Math.cos(-this.moveAngle)
    const x = this.velocity * Math.sin(-this.moveAngle)

    this.object.position.x += x
    this.object.position.z -= z

    return { x, z }
  }

  changeState = (keysPressed) => {
    // Accelerating and braking
    if ('ArrowUp' in keysPressed) {
      this.isMoving = true
    }
    this.isAccelerating = 'ArrowUp' in keysPressed
    this.isBraking = 'ArrowDown' in keysPressed

    // Steering
    this.isRotating = 'ArrowLeft' in keysPressed || 'ArrowRight' in keysPressed
    if ('ArrowLeft' in keysPressed && 'ArrowRight' in keysPressed) {
      this.isRotating = false
    } else if ('ArrowLeft' in keysPressed) {
      this.moveAngle += this.rotationalSpeed
    } else if ('ArrowRight' in keysPressed) {
      this.moveAngle -= this.rotationalSpeed
    }

    return this;
  }

  main = () => {
    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.position.x = 0
    this.object.position.y = .25
    this.object.castShadow = true
    this.object.receiveShadow = false
  }
}
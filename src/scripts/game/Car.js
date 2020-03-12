import * as THREE from 'three';

export default class Car {
  constructor() {
    this.main()
  }

  maxVelocity = .3
  torque = .003
  brakingPower = .007
  friction = .002
  velocity = 0
  acceleration = 0
  rotationalSpeed = .07
  moveAngle = 0
  isMoving = false
  isAccelerating = false
  isBraking = false
  isRotating = false
  boxWidth = 0.5
  boxHeight = 0.5
  boxDepth = 1
  material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
  geometry = new THREE.BoxGeometry(this.boxWidth, this.boxHeight, this.boxDepth)

  rotate = () => {
    this.object.rotation.y = this.moveAngle
  }

  stop = () => {
    this.isMoving = false
    this.velocity = 0
  }

  movement = () => {
    this.acceleration = 1 - this.velocity / this.maxVelocity

    this.velocity = this.isBraking
      ? this.velocity - this.friction - this.brakingPower
      : this.isAccelerating
        ? (this.velocity + this.torque * this.acceleration)
        : this.velocity -= this.friction

    if (this.velocity <= 0) {
      this.isMoving = false
    }

    const z = this.velocity * Math.cos(-this.moveAngle)
    const x = this.velocity * Math.sin(-this.moveAngle)
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
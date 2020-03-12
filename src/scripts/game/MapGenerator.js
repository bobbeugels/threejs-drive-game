import SimplexNoise from 'simplex-noise'

export default class MapGenerator {
  constructor(width, depth) {
    this.width = width
    this.depth = depth

    this.simplex = new SimplexNoise()
    this.generateArray()
  }

  mapArray = []

  generateArray = () => {
    for (let x = 0; x < this.width; x++) {
      this.mapArray.push([])
      
      for (let y = 0; y < this.depth; y++) {
        this.mapArray[x].push({
          // value: Math.random() > 0.98 ? 'x' : null,
          value: this.simplex.noise2D(x, y) < -0.5 ? 'x' : null
        })
      }
    }
  }
}

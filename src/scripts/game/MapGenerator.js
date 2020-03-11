export default class MapGenerator {
  constructor(width, depth) {
    this.width = width
    this.depth = depth

    this.generateArray()
  }

  mapArray = []

  generateArray = () => {
    for (let i = 0; i < this.width; i++) {
      this.mapArray.push([])
      
      for (let j = 0; j < this.depth; j++) {
        this.mapArray[i].push({
          value: Math.random() > 0.98 ? 'x' : null
        })
      }
    }
  }
}

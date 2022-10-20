/**
 * Dummy cube
 */
class Dummy {
  constructor(options) {
    this.group = options.group
    this.name = options.name
    this.init()
  }

  init() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 20, 20, 20),
      new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        // blending: THREE.AdditiveBlending,
        wireframe: true,
      })
    )
    this.instance.name = this.name
    this.instance.position.z = -5
    this.instance.position.y = 1
    this.group.add(this.instance)
  }

  update() {
    if (this.instance) {
      this.instance.rotation.x += 0.01
      this.instance.rotation.y += 0.01

      // this.instance.scale.x = Math.sin(performance.now() / 6000)
      // this.instance.scale.x = Math.sin(performance.now() / 1000)
      // this.instance.scale.z = Math.sin(performance.now() / 2000)

      // this.instance.position.y = Math.sin(performance.now() / 2000)
      // this.instance.position.x = Math.sin(performance.now() / 1000)
    }
  }
}

export default Dummy

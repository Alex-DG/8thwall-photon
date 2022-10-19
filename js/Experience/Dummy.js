/**
 * Dummy cube
 */
class Dummy {
  constructor(options) {
    this.scene = options.scene
    this.init()
  }

  init() {
    this.instance = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 10, 10, 10),
      new THREE.MeshNormalMaterial({
        // blending: THREE.AdditiveBlending,
        // wireframe: true,
      })
    )
    this.instance.position.z = -5
    this.instance.position.y = 1
    this.scene.add(this.instance)
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

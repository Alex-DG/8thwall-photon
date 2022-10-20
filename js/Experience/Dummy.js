/**
 * Dummy cube
 */
class Dummy {
  constructor(options) {
    const { scene } = XR8.Threejs.xrScene()
    this.scene = scene
    this.name = options.name
    this.index = options.index

    const colors = {
      1: 'red',
      2: 'orange',
      3: 'white',
      4: 'blue',
    }
    this.color = new THREE.Color(colors[this.index])

    this.init()
  }

  init() {
    this.instance = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1, 20, 20, 20),
      new THREE.MeshBasicMaterial({
        color: this.color,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      })
    )
    this.instance.name = this.name
    this.instance.position.z = -5
    this.instance.position.y = 1
    if (this.index > 1) this.instance.position.x += this.index / 2
    this.scene.add(this.instance)
  }

  destroy() {
    this.instance.geometry.dispose()
    this.instance.material.dispose()
    this.scene.remove(this.instance)
    this.instance = null
  }

  update() {
    if (this.instance) {
      this.instance.rotation.x += 0.01
      this.instance.rotation.y += 0.01

      // this.instance.scale.x = Math.sin(performance.now() / 6000)
      this.instance.scale.x = Math.sin(performance.now() / 1000)
      // this.instance.scale.z = Math.sin(performance.now() / 2000)

      // this.instance.position.y = Math.sin(performance.now() / 2000)
      // this.instance.position.x = Math.sin(performance.now() / 1000)
    }
  }
}

export default Dummy

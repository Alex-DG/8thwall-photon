import Photon from '../Lib/Photon-Javascript_SDK.min.js'

class _Multiplayer {
  init(options) {
    this.isConnected = false

    this.id = options?.id || 'dbd2e5c5-443e-4001-aeab-399c978c7206'
    this.wss = options?.wss || 1
    this.region = options?.region || 'asia'
    this.version = options?.version || '1.0'

    this.connection()
  }

  connection() {
    try {
      // Photon Settings
      this.client = new Photon.LoadBalancing.LoadBalancingClient(
        this.wss,
        this.id,
        this.version
      )

      this.client.connectToRegionMaster(this.region)

      console.log('✅', 'Photon client connected!')
      console.log({ photonClient: this.client })
      this.isConnected = true
    } catch (error) {
      console.log('❌', 'Photon client error!')
      console.log({ error })
    }
  }

  update() {
    if (this.isConnected) {
      // this.client?.Service()
      // Thread.Sleep(33)
    }
  }
}

const Multiplayer = new _Multiplayer()
export default Multiplayer

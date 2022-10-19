import Photon from '../Lib/Photon-Javascript_SDK.min.js'

class _Multiplayer {
  init(APPID = 'dbd2e5c5-443e-4001-aeab-399c978c7206') {
    try {
      // Photon Settings
      this.client = new Photon.LoadBalancing.LoadBalancingClient(
        1,
        APPID,
        '1.0'
      )

      this.client.connectToRegionMaster('ASIA')

      console.log('✅', 'Photon client connected!')
    } catch (error) {
      console.log('❌', 'Photon client error!')
      console.log({ error })
    }
  }
}

const Multiplayer = new _Multiplayer()
export default Multiplayer

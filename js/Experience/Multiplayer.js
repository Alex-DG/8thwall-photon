import Photon from '../Lib/Photon-Javascript_SDK.min.js'

class _Multiplayer {
  init(APPID = 'dbd2e5c5-443e-4001-aeab-399c978c7206') {
    try {
      const client = new Photon.LoadBalancing.LoadBalancingClient(
        Photon.ConnectionProtocol.Ws,
        APPID,
        '1.0'
      )
      console.log({ client })

      client.connectToRegionMaster('ASIA')
    } catch (error) {
      console.log('MULITPLAYER ERROR ------')
      console.log({ error })
    }
  }
}

const Multiplayer = new _Multiplayer()
export default Multiplayer

import Photon from '../Lib/Photon-Javascript_SDK.min.js'

class _Multiplayer {
  init(options) {
    this.isConnected = false

    this.id = options?.id || 'dbd2e5c5-443e-4001-aeab-399c978c7206'
    this.wss = options?.wss || 1
    this.region = options?.region || 'asia'
    this.version = options?.version || '1.0'

    this.bind()
    this.connection()
  }

  onRoomList(data) {
    console.log('> onRoomList', { data })
  }
  onJoinRoom(data) {
    console.log('> Joined the room.', { data })
  }

  bind() {
    this.onRoomList = this.onRoomList.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
  }

  connection() {
    try {
      // Photon Settings
      this.client = new Photon.LoadBalancing.LoadBalancingClient(
        this.wss,
        this.id,
        this.version
      )

      // this.client.connectToRegionMaster(this.region)

      // Connect to the master server
      if (!this.client.isInLobby()) {
        this.client.connectToRegionMaster(this.region)
      }

      // Added
      this.client.onRoomList = this.onRoomList
      this.client.onJoinRoom = this.onJoinRoom

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

import Photon from '../Lib/Photon-Javascript_SDK.min.js'

class _Multiplayer {
  init(options) {
    this.isConnected = false

    this.players = []

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
    console.log('> onJoinRoom.', { data })
  }

  onActorJoin(actor) {
    console.log('> onActorJoin', { actor })

    const { actorNr } = actor

    if (actor.isLocal) return

    const otherPlayer = new pc.Entity()
    otherPlayer.addComponent('render', { type: 'capsule' })
    otherPlayer.setLocalPosition(0, 1, 0)
    otherPlayer.name = actorNr

    // this.app.root.children[0].addChild(otherPlayer);
    this.players = [otherPlayer, ...this.players]
  }
  onActorLeave(data) {
    console.log('> onActorLeave', { actor })

    // todo:
    // const { actorNr } = actor;
    // const otherPlayer = this.app.root.children[0].findByName(actorNr);

    // if (actor.isLocal || !otherPlayer) return;
    // otherPlayer.destroy();
  }

  bind() {
    this.onRoomList = this.onRoomList.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
    this.onActorJoin = this.onActorJoin.bind(this)
    this.onActorLeave = this.onActorLeave.bind(this)
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

      this.client.onRoomList = this.onRoomList
      this.client.onJoinRoom = this.onJoinRoom

      this.client.onActorJoin = this.onActorJoin
      this.client.onActorLeave = this.onActorLeave

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

import Photon from '../Lib/Photon-Javascript_SDK.min.js'
import Dummy from './Dummy.js'

class _Multiplayer {
  init(options) {
    const { scene } = XR8.Threejs.xrScene()

    this.isConnected = false
    this.scene = scene
    this.playerGroup = new THREE.Group()
    this.scene.add(this.playerGroup)

    this.actors = {} // { roomName1: [actor1, actor2, etc..], roomName2: [...], ... }
    this.players = []
    this.rooms = []

    this.gameIndex = 0

    this.id = options?.id || 'dbd2e5c5-443e-4001-aeab-399c978c7206'
    this.wss = options?.wss || 1
    this.region = options?.region || 'asia'
    this.version = options?.version || '1.0'

    this.bind()

    this.connection()
    this.actions()
  }

  ////////////////////////////////////////////////////

  error(name, error) {
    console.log('❌', name)
    console.log({ error })
    console.log({ message: error.message })
  }

  ////////////////////////////////////////////////////

  updateGameIndex(index) {
    this.gameIndex = index
  }

  createPlayerEntity(name) {
    const isPlayerExist = this.playerGroup.children.some((p) => p.name === name)
    if (!isPlayerExist) {
      const player = new Dummy({ group: this.playerGroup, name })
      this.players.push(player)
    }
  }

  addRoomUI(name) {
    var opt = document.createElement('option')
    opt.value = name
    opt.innerHTML = name
    this.roomList.appendChild(opt)
  }

  removeRoomUI(name) {
    const room = document.getElementById(name)
    this.roomList.removeChild(room)
  }

  addPlayerUI(name) {
    const list = document.getElementById('actorlist')

    const isActorExist = [...list.children].some((c) => c.id === name)
    if (isActorExist) return

    var opt = document.createElement('option')
    opt.id = name
    opt.value = name
    opt.innerHTML = name
    list.appendChild(opt)
  }

  removePlayerUI(name) {
    const room = document.getElementById(name)
    const list = document.getElementById('actorlist')
    list.removeChild(room)
  }

  ////////////////////////////////////////////////////

  onRoomSelected() {
    const index = this.roomList.selectedIndex
    const roomName = this.roomList.options[index].text

    this.client.joinRoom(roomName)
  }

  onCreateNewRoom() {
    const index = this.gameIndex + 1
    const name = `room-${index}`

    try {
      this.client.createRoom(name)

      this.updateGameIndex(index)
      this.addRoomUI(name)
    } catch (error) {
      this.error('Create game error!', error)
    }
  }

  ////////////////////////////////////////////////////

  onRoomList(rooms) {
    console.log('::: onRoomList :::')
    console.log('---------------------')
    console.log('🎉', { rooms })
    console.log('---------------------')
    this.rooms = rooms

    for (let i = 0; i < rooms.length; i++) {
      const name = rooms[i].name
      this.addRoomUI(name)
    }
  }

  onJoinRoom(data) {
    console.log('> onJoinRoom.', { data })
  }

  onActorJoin(actor) {
    console.log('> onActorJoin', { actor })

    const name = `actor-${actor.actorNr}`

    actor.setName(name)

    const myRoom = this.client.myRoom()
    const myRoomActors = this.client.myRoomActors()

    this.actors = { ...this.actors, [myRoom.name]: myRoomActors }
    Object.keys(myRoomActors).forEach((index) => {
      const roomActor = myRoomActors[index]
      this.addPlayerUI(roomActor.name)
      // this.createPlayerEntity(roomActor.name)
    })

    const isRoomExist = this.rooms.some((r) => r.name === myRoom.name)
    if (!isRoomExist) this.rooms = [...this.rooms, myRoom]

    // console.log({
    //   actors: this.actors,
    //   rooms: this.rooms,
    //   playerGroup: this.playerGroup,
    //   players: this.players,
    // })
  }

  onActorLeave(actor) {
    console.log('> onActorLeave', { actor })

    // const userId = actor.userId
    const name = actor.name

    this.removePlayerUI(name)
    // this.actors = this.actors.filter((p) => p.userId !== userId)
  }

  ////////////////////////////////////////////////////

  bind() {
    this.onRoomList = this.onRoomList.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)

    this.onActorJoin = this.onActorJoin.bind(this)
    this.onActorLeave = this.onActorLeave.bind(this)

    this.onCreateNewRoom = this.onCreateNewRoom.bind(this)
    this.onRoomSelected = this.onRoomSelected.bind(this)

    this.createPlayerEntity = this.createPlayerEntity.bind(this)
  }

  ////////////////////////////////////////////////////

  connection() {
    try {
      // Photon Settings
      this.client = new Photon.LoadBalancing.LoadBalancingClient(
        this.wss,
        this.id,
        this.version
      )

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
      this.error('Photon client error!', error)
    }
  }

  actions() {
    this.newRoomBtn = document.getElementById('newroom')
    this.newRoomBtn.addEventListener('click', this.onCreateNewRoom)

    this.roomList = document.getElementById('roomlist')
    this.roomList.addEventListener('change', this.onRoomSelected)
  }

  ////////////////////////////////////////////////////

  update() {
    if (this.isConnected) {
      // this.client?.Service()
      // Thread.Sleep(33)

      for (let index = 0; index < this.players?.length; index++) {
        const p = this.players[index]
        p.update()
      }
    }
  }
}

const Multiplayer = new _Multiplayer()
export default Multiplayer

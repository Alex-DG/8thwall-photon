import Photon from '../Lib/Photon-Javascript_SDK.min.js'
import Dummy from './Dummy.js'

/**
 * Documentation:
 * https://doc-api.photonengine.com/en/javascript/current/Photon.LoadBalancing.LoadBalancingClient.html
 */
class _Multiplayer {
  init(options) {
    this.isConnected = false

    this.actors = {} // { roomName1: [actor1, actor2, etc..], roomName2: [...], ... }
    this.entities = []
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

  createEntity(name, actorNr) {
    const isPlayerExist = this.entities.some((e) => e.name === name)

    if (!isPlayerExist) {
      console.log('---> Create new entity ', name)
      const player = new Dummy({ name, index: actorNr })
      this.entities.push(player)
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

  addActorUI(name) {
    const list = document.getElementById('actorlist')

    const isActorExist = [...list.children].some((c) => c.id === name)
    if (isActorExist) return

    var opt = document.createElement('option')
    opt.id = name
    opt.value = name
    opt.innerHTML = name
    list.appendChild(opt)
  }

  removeActorUI(name) {
    const room = document.getElementById(name)
    const list = document.getElementById('actorlist')
    list.removeChild(room)
  }

  ////////////////////////////////////////////////////

  onAddEntity() {
    // local only
    const index = this.entities.length + 1
    const name = `actor-${index}`
    this.createEntity(name, index)
  }

  onRoomSelected() {
    const index = this.roomList.selectedIndex || 1
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
      const { name, actorNr } = roomActor
      this.addActorUI(name)
      this.createEntity(name, actorNr)
    })

    const isRoomExist = this.rooms.some((r) => r.name === myRoom.name)
    if (!isRoomExist) this.rooms = [...this.rooms, myRoom]

    console.log({
      actors: this.actors,
      rooms: this.rooms,
      entities: this.entities,
      scene: XR8.Threejs.xrScene().scene,
    })
  }

  onActorLeave(actor) {
    console.log('> onActorLeave', { actor })

    const name = actor.name
    const actorNr = actor.actorNr

    // Remove entities
    this.entities.filter((e) => {
      if (e.name === name) {
        e.destroy()
        return true
      }
      return false
    })

    // Remove UI
    this.removeActorUI(name)

    // Remove actors
    const myRoomName = this.client.myRoom().name
    delete this.actors[myRoomName][actorNr]

    console.log({ actors: this.actors })
  }

  ////////////////////////////////////////////////////

  bind() {
    this.onAddEntity = this.onAddEntity.bind(this)

    this.onRoomList = this.onRoomList.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)

    this.onActorJoin = this.onActorJoin.bind(this)
    this.onActorLeave = this.onActorLeave.bind(this)

    this.onCreateNewRoom = this.onCreateNewRoom.bind(this)
    this.onRoomSelected = this.onRoomSelected.bind(this)

    this.createEntity = this.createEntity.bind(this)
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

    this.addEntityBtn = document.getElementById('addentity')
    this.addEntityBtn.addEventListener('click', this.onAddEntity)

    this.roomList = document.getElementById('roomlist')
    this.roomList.addEventListener('change', this.onRoomSelected)
  }

  ////////////////////////////////////////////////////

  update() {
    if (this.isConnected) {
      // this.client?.Service()
      // Thread.Sleep(33)
      for (let index = 0; index < this.entities?.length; index++) {
        const e = this.entities[index]
        e?.update()
      }
    }
  }
}

const Multiplayer = new _Multiplayer()
export default Multiplayer

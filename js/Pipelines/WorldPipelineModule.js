import Dummy from '../Experience/Dummy'
import ParticleSystem from '../Experience/ParticleSystem'
import Multiplayer from '../Experience/Multiplayer'

export const initWorldPipelineModule = () => {
  let dummy
  let particleSystem

  const initExperience = () => {
    const { scene } = XR8.Threejs.xrScene()

    dummy = new Dummy({ scene })
    particleSystem = new ParticleSystem({ scene })

    console.log('✨', 'World ready')
  }

  const initModules = () => {
    Multiplayer.init()
  }

  const updateWorld = () => {
    Multiplayer?.update()

    dummy?.update()
    particleSystem?.update()
  }

  return {
    name: 'world',

    onStart: () => {
      initModules()
      initExperience()
    },

    onUpdate: () => updateWorld(),
  }
}

import Stats from 'stats.js'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const setSizes = ({ canvasWidth, canvasHeight }) => {
  const sizes = {
    width: canvasWidth,
    height: canvasHeight,
  }
  return sizes
}

const setScene = () => {
  const scene = new THREE.Scene()
  return scene
}

const setCamera = ({ sizes }) => {
  const aspect = sizes.width / sizes.height
  const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)

  // Set the initial camera position relative to the scene we just laid out. This must be at a
  // height greater than y=0.
  camera.position.set(0, 2, 0)

  XR8.XrController.updateCameraProjectionMatrix({
    origin: camera.position,
    facing: camera.quaternion,
  })

  return camera
}

const setRenderer = ({ canvas, sizes, GLctx }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: GLctx,
    alpha: true,
    antialias: true,
  })

  renderer.autoClear = false
  renderer.setSize(sizes.width, sizes.height)

  return renderer
}

export const initXRScenePipelineModule = () => {
  let scene
  let camera
  let renderer
  let sizes

  let xrSceneData

  const xrScene = () => xrSceneData

  let engaged = false

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({ canvas, canvasWidth, canvasHeight, GLctx }) => {
    if (engaged) return

    // Sizes
    sizes = setSizes({ canvasWidth, canvasHeight })

    // Scene
    scene = setScene()

    // Camera
    camera = setCamera({ sizes })
    scene.add(camera)

    // Renderer
    renderer = setRenderer({ canvas, sizes, GLctx })

    // XR Scene Data
    xrSceneData = { scene, camera, renderer }
    window.xrSceneData = xrSceneData
    window.XR8.Threejs.xrScene = xrScene

    // Prevent scroll/pinch gestures on canvas
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })

    // Ready ✨
    engaged = true
    console.log('🤖', 'XR Scene ready')
  }

  // This is a workaround for https://bugs.webkit.org/show_bug.cgi?id=237230
  // Once the fix is released, we can add `&& parseFloat(device.osVersion) < 15.x`
  const device = XR8.XrDevice.deviceEstimate()
  const needsPrerenderFinish =
    device.os === 'iOS' && parseFloat(device.osVersion) >= 15.4

  return {
    name: 'init',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    onStart: (args) => initXrScene(args), // Add objects set the starting camera position.

    onDetach: () => {
      engaged = false
    },
    onUpdate: ({ processCpuResult }) => {
      if (!processCpuResult?.reality) return

      const { rotation, position, intrinsics } = processCpuResult.reality

      let i = 0
      while (i < intrinsics?.length) {
        camera.projectionMatrix.elements[i] = intrinsics[i]
        i++
      }

      // Default 8th wall three module isn't doing this
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()

      if (rotation) {
        camera.setRotationFromQuaternion(rotation)
      }
      if (position) {
        camera.position.set(position.x, position.y, position.z)
      }
    },
    onCanvasSizeChange: ({ canvasWidth, canvasHeight }) => {
      if (!engaged) return
      setSizes({ sizes, canvasWidth, canvasHeight })
      renderer.setSize(canvasWidth, canvasHeight)
    },
    onRender: () => {
      stats.begin()

      renderer.clearDepth()
      renderer.render(scene, camera)

      stats.end()
    },
    xrScene: () => xrScene,
  }
}

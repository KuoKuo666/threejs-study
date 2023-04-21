import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { initCamera, initScene, initWebGLRenderer } from './init'
import { loadGLTF } from './load'

class Game {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    orbitControls: OrbitControls

    constructor() {
        this.scene = initScene()
        this.camera = initCamera()
        this.scene.add(this.camera)
        this.renderer = initWebGLRenderer()
        this.orbitControls = this.addOrbitControls(this.camera, this.renderer)
        this.addModel()
        this.addResizeEventListener()
    }

    addOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.autoRotate = true
        controls.enableDamping = true
        controls.update()
        return controls
    }

    async addModel() {
        const model = await loadGLTF('gltf/SheenChair.glb')
        this.scene.add(model)
    }

    addResizeEventListener() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    startMainLoop() {
        // 等待一帧用于初始化
        Promise.resolve().then(() => {
            this.step()
        })
    }

    step() {
        requestAnimationFrame(this.step.bind(this))
        this.orbitControls && this.orbitControls.update()
        this.renderer.render(this.scene, this.camera)
    }
}

const game = new Game()
game.startMainLoop()

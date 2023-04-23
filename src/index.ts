import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { initCamera, initScene, initWebGLRenderer } from './init'
import { loadGLTF } from './load'
import { AnimationManager } from './animation'

class Game {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    orbitControls: OrbitControls

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    animationManager = new AnimationManager()

    composer: EffectComposer
    outlinePass: OutlinePass

    constructor() {
        this.scene = initScene()
        this.camera = initCamera()
        this.scene.add(this.camera)
        this.renderer = initWebGLRenderer()

        this.orbitControls = this.addOrbitControls(this.camera, this.renderer)
        this.addModel()
        this.addResizeEventListener()
        this.addClickEvent()

        this.composer = new EffectComposer(this.renderer)
		const renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(renderPass)

		const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera)
        outlinePass.edgeStrength = 4
        outlinePass.edgeGlow = 1
        outlinePass.edgeThickness = 1
        outlinePass.visibleEdgeColor.set('#ffffff')
        outlinePass.hiddenEdgeColor.set('#190a05')
        this.composer.addPass(outlinePass)

        this.outlinePass = outlinePass
    }

    addClickEvent() {
        this.renderer.domElement.addEventListener('pointermove', (ev) => {
            this.mouse.x = (ev.clientX / window.innerWidth) * 2 - 1
            this.mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1
            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObject(this.scene, true)
            if (intersects.length) {
                this.outlinePass.selectedObjects = [intersects[0].object]
            } else {
                this.outlinePass.selectedObjects = []
            }
        })
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
        const geometryArray = []
        const materialArray = []
        model.traverse(obj => {
            if (obj instanceof THREE.Mesh) {
                geometryArray.push(obj.geometry)
                materialArray.push(obj.material)
            }
        })
        const mergeGeo = mergeBufferGeometries(geometryArray, true)
        const group = new THREE.Mesh(mergeGeo, materialArray)
        this.scene.add(group)
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
        this.animationManager.step()
        // this.renderer.render(this.scene, this.camera)
        this.composer.render()
    }
}

const game = new Game()
game.startMainLoop()

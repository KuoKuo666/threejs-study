import * as THREE from 'three'
import * as echarts from 'echarts'
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

    updateTexture: THREE.Texture

    constructor() {
        this.scene = initScene()
        this.camera = initCamera()
        this.scene.add(this.camera)
        this.renderer = initWebGLRenderer()

        this.orbitControls = this.addOrbitControls(this.camera, this.renderer)
        this.addModel()
        this.addCanvasModel()
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

    addCanvasModel() {
        // 创建一个 canvas 元素，并在其中绘制内容
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256

        const data = []
        for (let i = 0; i < 5; ++i) {
            data.push(Math.round(Math.random() * 200))
        }

        const dataArr1 = [1, 2, 3, 2, 1, 3]
        const dataArr2 = [2, 1, 1, 2, 1, 2]

        const chart = echarts.init(canvas)
        const option: echarts.EChartOption<{ name: string, type: string, data: number[] }> = {
            title: {
                text: 'World Population'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
            },
            series: [
                {
                    name: '2011',
                    type: 'bar',
                    data: dataArr1
                },
                {
                    name: '2012',
                    type: 'bar',
                    data: dataArr2
                }
            ]
        }
        chart.setOption(option)

        // 定时器变化
        setInterval(() => {
            // 随机加减
            const newArr1 = dataArr1.map(v => (v + Math.random()))
            const newArr2 = dataArr1.map(v => (v + Math.random()))
            option.series[0].data = newArr1
            option.series[1].data = newArr2
            chart.setOption(option)
        }, 600)

        // 将 canvas 元素创建为纹理，并应用到模型上
        const texture = new THREE.CanvasTexture(canvas)
        this.updateTexture = texture
        // 创建一个正方体模型
        const geometry = new THREE.BoxGeometry(1, 0.65, 0.001)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        })
        const cube = new THREE.Mesh(geometry, material)
        cube.position.set(0, 1.2, 0)
        this.scene.add(cube)
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
        this.updateTexture && (this.updateTexture.needsUpdate = true)
        this.orbitControls && this.orbitControls.update()
        this.animationManager.step()
        // this.renderer.render(this.scene, this.camera)
        this.composer.render()
    }
}

const game = new Game()
game.startMainLoop()

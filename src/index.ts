import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
scene.background = new THREE.Color('white')
const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.set(0, 3, 5)
camera.lookAt(new THREE.Vector3(0, 0, 0))
// 环境光
const light = new THREE.AmbientLight('white', 1.5)
scene.add(light)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

// 自动旋转
controls.autoRotate = true
// 阻尼衰减
controls.enableDamping = true

const loader = new GLTFLoader()
loader.load('gltf/SheenChair.glb', (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
})

const animate = () => {
    requestAnimationFrame(animate)
    // 如果不开启自动旋转/阻尼衰减，可以不每帧调用
    controls.update()
    renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

import * as THREE from 'three'

// 初始化一个 Three 场景
const scene = new THREE.Scene()
// 新建一个摄像机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
// 初始化 Three 的渲染器
const renderer = new THREE.WebGLRenderer()
// 设置成屏幕大小，将生成的 canvas 插入到 body 下
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 新建一个盒子形状
const geometry = new THREE.BoxGeometry()
// 贴上材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
// 将网格装入场景，默认位置 0 0 0
scene.add(cube)

// 改变摄像机的位置，离物体远点
camera.position.z = 5

const animate = () => {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
}
// 利用 requestAnimationFrame 实现 60 帧触发
animate()

// 屏幕容器改变大小后，从新计算视图
window.addEventListener('resize', () => {
    // 重新设置相机宽高比例
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
    // 重新设置渲染器渲染范围
    renderer.setSize(window.innerWidth, window.innerHeight)
})

import * as THREE from 'three'

export class AnimationManager {
    mixers: THREE.AnimationMixer[] = []
    clock = new THREE.Clock()

    addOnePosAnima(obj: THREE.Object3D) {
        const positionTimes = [0, 1, 2]
        const positionArr = [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ]
        const track = new THREE.VectorKeyframeTrack(
            `${obj.name}.position`,
            positionTimes,
            positionArr,
            THREE.InterpolateSmooth
        )
        // 动画名称，持续时间，track
        const clip = new THREE.AnimationClip('clip1', 2, [track])
        const mixer = new THREE.AnimationMixer(obj)
        const action = mixer.clipAction(clip)
        action.play()
        this.mixers.push(mixer)
    }

    step() {
        const dt = this.clock.getDelta()
        this.mixers.forEach(m => m.update(dt))
    }
}

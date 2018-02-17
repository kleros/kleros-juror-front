import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import icosahedron from '../../assets/models/icosahedron'

class Icosahedron extends PureComponent {
  static propTypes = {
    size: PropTypes.number
  }

  static defaultProps = {
    size: 100
  }

  // Loader
  static loader = new THREE.ObjectLoader()

  // Lights
  static ambientLight = new THREE.AmbientLight('0xffffff', 0.25) // Ambient
  static keyLight = new THREE.DirectionalLight( // Key
    new THREE.Color('hsl(30, 100%, 75%)'),
    1.0
  )
  static fillLight = new THREE.DirectionalLight( // Fill
    new THREE.Color('hsl(240, 100%, 75%)'),
    0.75
  )
  static backLight = new THREE.DirectionalLight('0xffffff', 1.0) // Back

  // Inclination and base speeds
  static inclination = Math.PI / 8
  static spinTime = 3000
  static ySpinsPerSpin = 4

  static calcRotations() {
    const angleOfTime =
      2 * Math.PI * ((Date.now() % Icosahedron.spinTime) / Icosahedron.spinTime)
    return {
      xRotation: Math.cos(angleOfTime + Math.PI / 2) * Icosahedron.inclination,
      yRotation: -angleOfTime * Icosahedron.ySpinsPerSpin / 2,
      zRotation: Math.cos(angleOfTime) * Icosahedron.inclination
    }
  }

  constructor(props) {
    super(props)
    const { size } = this.props

    // Load model into a container for spinning and set up for pivot
    const object = Icosahedron.loader.parse(icosahedron)
    object.position.y = 1
    object.rotation.x = -0.4
    this.spinContainer = new THREE.Object3D()
    this.spinContainer.add(object)

    // Create camera and set up for pivot
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000)
    this.camera.position.y = 1
    this.camera.position.z = 4

    // Create scene
    this.scene = new THREE.Scene()

    // Add container to the scene
    this.scene.add(this.spinContainer)

    // Add lights to the scene
    this.scene.add(Icosahedron.ambientLight)
    this.scene.add(Icosahedron.keyLight)
    this.scene.add(Icosahedron.fillLight)
    this.scene.add(Icosahedron.backLight)

    // Create renderer and set size
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    this.renderer.setSize(size, size)
  }

  componentDidMount() {
    // Mount renderer
    this.ref.appendChild(this.renderer.domElement)

    // Start drawing
    this.draw()
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrame)
  }

  getRef = ref => (this.ref = ref)

  draw = () => {
    // Draw scene
    this.renderer.render(this.scene, this.camera)

    // Transformations
    const { xRotation, yRotation, zRotation } = Icosahedron.calcRotations()
    this.scene.rotation.x = xRotation
    this.spinContainer.rotation.y = yRotation
    this.scene.rotation.z = zRotation

    // Draw again
    this.animationFrame = requestAnimationFrame(this.draw)
  }

  render() {
    return <div ref={this.getRef} />
  }
}

Icosahedron.keyLight.position.set(-100, 0, 100)
Icosahedron.fillLight.position.set(100, 0, 100)
Icosahedron.backLight.position.set(100, 0, -100).normalize()

export default Icosahedron

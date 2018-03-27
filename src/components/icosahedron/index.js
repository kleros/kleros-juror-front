import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import * as THREE from 'three'

import icosahedron from '../../assets/models/icosahedron'

import './icosahedron.css'

class Icosahedron extends PureComponent {
  static propTypes = {
    // State
    size: PropTypes.number,
    loading: PropTypes.bool
  }

  static defaultProps = {
    size: 100,
    loading: null
  }

  // Loader
  static loader = new THREE.ObjectLoader()

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

    // Create lights
    const ambientLight = new THREE.AmbientLight('0xffffff', 0.25) // Ambient
    const keyLight = new THREE.DirectionalLight( // Key
      new THREE.Color('hsl(30, 100%, 75%)'),
      1.0
    )
    const fillLight = new THREE.DirectionalLight( // Fill
      new THREE.Color('hsl(240, 100%, 75%)'),
      0.75
    )
    const backLight = new THREE.DirectionalLight('0xffffff', 1.0) // Back
    keyLight.position.set(-100, 0, 100)
    fillLight.position.set(100, 0, 100)
    backLight.position.set(100, 0, -100).normalize()

    // Add lights to the scene
    this.scene.add(ambientLight)
    this.scene.add(keyLight)
    this.scene.add(fillLight)
    this.scene.add(backLight)

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
    const { loading } = this.props
    const loadingNotDefined = loading === null

    return (
      <div
        ref={this.getRef}
        className={`Icosahedron ${
          loadingNotDefined ? '' : 'Icosahedron--absolute'
        } ${loadingNotDefined || loading ? '' : 'is-hidden'}`}
      />
    )
  }
}

export default Icosahedron

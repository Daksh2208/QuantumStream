import { useEffect, useMemo, useRef } from 'react'

import * as THREE from 'three'
import { cameraFromProgress, sceneFromProgress, smoothstep, clamp01 } from './scrollScenes.js'


function usePrefersReducedMotion() {
  const ref = useRef(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      ref.current = !!mql.matches
    }
    update()
    mql.addEventListener?.('change', update)
    return () => mql.removeEventListener?.('change', update)
  }, [])

  return ref
}

function createProcessorCore() {
  const group = new THREE.Group()

  // Ceramic base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.7, 0.12, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      metalness: 0.12,
      roughness: 0.45,
    }),
  )
  base.position.y = 0
  group.add(base)

  // Inner translucent ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.12, 20, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.05,
      roughness: 0.15,
      transparent: true,
      opacity: 0.75,
      emissive: 0x00bfff,
      emissiveIntensity: 0.25,
    }),
  )
  ring.position.y = 0.06
  group.add(ring)

  // Quantum circuit visualization (gate lattice)

  const traceGeo = new THREE.BoxGeometry(0.62, 0.006, 0.02)
  const traceCount = 240
  const traces = new THREE.InstancedMesh(
    traceGeo,
    new THREE.MeshStandardMaterial({
      color: 0x7c5cff,
      metalness: 0.05,
      roughness: 0.35,
      emissive: 0x7c5cff,
      emissiveIntensity: 0.12,
      transparent: true,
      opacity: 0.85,
    }),
    traceCount,
  )
  const dummy = new THREE.Object3D()

  for (let i = 0; i < traceCount; i++) {
    const angle = (i / traceCount) * Math.PI * 2
    const radius = 0.22 + (i % 17) * 0.012
    const y = -0.02 + (i % 9) * 0.008
    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
    dummy.rotation.y = angle
    dummy.rotation.z = (i % 7) * 0.12 - 0.4
    const s = 0.35 + (i % 13) * 0.02
    dummy.scale.set(s, 1, 1)
    dummy.updateMatrix()
    traces.setMatrixAt(i, dummy.matrix)
  }
  group.add(traces)

  // Qubit markers (instanced qubit micro-spheres)
  // Small spheres tuned for a dense, readable responsive display.
  const qbGeo = new THREE.SphereGeometry(0.018, 14, 14)

  const qbCount = 420
  const qubits = new THREE.InstancedMesh(
    qbGeo,
    new THREE.MeshStandardMaterial({
      color: 0x4a90ff,
      metalness: 0.1,
      roughness: 0.2,
      emissive: 0x4a90ff,
      emissiveIntensity: 0.35,
    }),
    qbCount,
  )


  const qbSeeds = new Float32Array(qbCount * 4)
  for (let i = 0; i < qbCount; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 0.45 * Math.random()
    const speed = 0.4 + Math.random() * 1.2
    const phase = Math.random() * Math.PI * 2
    qbSeeds.set([a, r, speed, phase], i * 4)
  }

  // state vector “probability” rings (small line loops)
  const ringGroup = new THREE.Group()
  group.add(ringGroup)

  const rings = []
  const ringMat = new THREE.LineBasicMaterial({ color: 0x00bfff, transparent: true, opacity: 0.4 })
  for (let i = 0; i < 18; i++) {
    const rad = 0.22 + i * 0.018
    const pts = []
    const segments = 96
    for (let s = 0; s <= segments; s++) {
      const t = (s / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(t) * rad, 0.16 + i * 0.002, Math.sin(t) * rad))
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    const line = new THREE.Line(geom, ringMat.clone())
    line.rotation.x = Math.PI / 2
    line.scale.set(1, 1, 1)
    ringGroup.add(line)
    rings.push(line)
  }

  return { group, traces, qubits, qbSeeds, ringGroup, rings }
}

export default function QuantumScene() {
  const containerRef = useRef(null)
  const reducedMotionRef = usePrefersReducedMotion()

  const size = useRef({ w: 1, h: 1, dpr: 1 })
  const stateRef = useRef({ scroll: 0, pointerX: 0, pointerY: 0 })

  const api = useMemo(() => ({
    setScroll(p) {
      stateRef.current.scroll = clamp01(p)
    },
    setPointer(x, y) {
      stateRef.current.pointerX = x
      stateRef.current.pointerY = y
    },
  }), [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const scene = new THREE.Scene()
    scene.fog = null

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    el.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.01, 50)
    camera.position.set(0, 0.85, 3.6)

    const core = createProcessorCore()
    scene.add(core.group)
    core.group.position.y = 0

    // Lighting — subtle, white-first
    const key = new THREE.DirectionalLight(0xffffff, 1.1)
    key.position.set(1.5, 2.2, 2.0)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xffffff, 0.55)
    fill.position.set(-2.2, 0.7, 1.2)
    scene.add(fill)

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    // Background surface (very light)
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ color: 0xfbfcfd })
    )
    bg.position.z = -6
    bg.position.y = -0.8
    scene.add(bg)

    const tmp = new THREE.Object3D()

    function resize() {
      const w = el.clientWidth
      const h = el.clientHeight
      size.current = { w, h, dpr: Math.min(2, window.devicePixelRatio || 1) }
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(size.current.dpr)
      renderer.setSize(w, h)
    }

    resize()
    const ro = new ResizeObserver(() => resize())
    ro.observe(el)

    let raf = 0
    const clock = new THREE.Clock()

    function tick() {
      raf = requestAnimationFrame(tick)

      const t = clock.elapsedTime

      const p = stateRef.current.scroll
      const { pos, target, fov } = cameraFromProgress(p)
      camera.fov = fov
      camera.updateProjectionMatrix()

      const pointerX = stateRef.current.pointerX
      const pointerY = stateRef.current.pointerY

      // Reduced motion: clamp camera and disable orbital drift
      const rm = reducedMotionRef.current

      if (rm) {
        camera.position.lerp(new THREE.Vector3(pos.x, pos.y, pos.z), 0.08)
      } else {
        camera.position.lerp(
          new THREE.Vector3(pos.x + pointerX * 0.08, pos.y + pointerY * 0.05, pos.z),
          0.08,
        )
      }

      camera.lookAt(target.x, target.y + (rm ? 0 : pointerY * 0.04), target.z)

      // Core motion: slow rotation + scroll-driven internal intensity
      const { index: sceneIndex } = sceneFromProgress(p)


      const rotBase = rm ? 0.1 : 0.15
      core.group.rotation.y = (t * rotBase) + pointerX * 0.25
      core.group.rotation.x = (rm ? 0 : -pointerY * 0.08)

      const intensity = 0.15 + 0.85 * smoothstep(sceneIndex / 5, sceneIndex / 5 + 0.35, p)

      // Traces: jitter + emissive ramp per scene
    const traceOpacity = 0.45 + intensity * 0.40
    core.traces.material.opacity = traceOpacity
    core.traces.material.emissiveIntensity = 0.05 + intensity * 0.18


      // Qubits: orbiting / collapsing based on scene
      const collapseAmt = rm ? 0.0 : smoothstep(0.82, 1.0, p)
      const orbitAmt = 1.0 - collapseAmt

      for (let i = 0; i < core.qubits.count; i++) {
        // Keep motion subtle on small screens: density+scale > large camera jumps.

        const a = core.qbSeeds[i * 4 + 0]
        const r = core.qbSeeds[i * 4 + 1]
        const sp = core.qbSeeds[i * 4 + 2]
        const ph = core.qbSeeds[i * 4 + 3]

        const ang = a + t * sp * 0.28
        const rr = r * (0.15 + 0.85 * orbitAmt)

        const x = Math.cos(ang) * rr
        const z = Math.sin(ang) * rr
        const y = 0.03 + Math.sin(ang * 2 + ph) * 0.05 * orbitAmt

        // Collapse toward center and slightly up into the logo moment
        const cx = x * (1 - collapseAmt)
        const cy = y * (1 - collapseAmt) + collapseAmt * 0.14
        const cz = z * (1 - collapseAmt)

        tmp.position.set(cx, cy, cz)
        tmp.scale.setScalar(1.0 - collapseAmt * 0.65)

        // Color/opacity for scientific feel: ring in later scenes
        tmp.rotation.y = ang
        tmp.updateMatrix()
        core.qubits.setMatrixAt(i, tmp.matrix)
      }
      core.qubits.instanceMatrix.needsUpdate = true

      // Probability rings: fade/expand per scene
      const ringPulse = rm ? 0.0 : 0.5 + 0.5 * Math.sin(t * 0.7 + p * Math.PI * 2)
      const ringBaseOpacity = 0.08 + intensity * 0.35
      for (let i = 0; i < core.rings.length; i++) {
        const line = core.rings[i]
        const k = i / (core.rings.length - 1)
        const sceneBoost = 1 - Math.abs(k - (0.1 + sceneIndex * 0.15)) * 2
        const op = ringBaseOpacity * Math.max(0, sceneBoost) * (0.7 + ringPulse * 0.6)
        line.material.opacity = op
        line.rotation.z = t * 0.02 * (rm ? 0.0 : 1.0) + k * 0.06
      }

      // Render
      renderer.render(scene, camera)
    }

    tick()

    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      api.setScroll(p)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const onPointerMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      api.setPointer((x - 0.5) * 2, (y - 0.5) * 2)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
      cancelAnimationFrame(raf)
      renderer.dispose()
      el.innerHTML = ''
      scene.clear()
    }
  }, [api, reducedMotionRef])

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
}


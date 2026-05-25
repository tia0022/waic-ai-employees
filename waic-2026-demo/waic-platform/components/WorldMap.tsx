'use client'
import { useEffect, useRef, useState } from 'react'

// Route waypoints: Jingdezhen → Shenzhen → Pacific → LA Port → LA City
const WAYPOINTS = [
  { lng: 117.18, lat: 29.27,  label: '景德镇', tag: '出发地', color: '#00c9a7' },
  { lng: 114.26, lat: 22.56,  label: '深圳盐田港', tag: '出境', color: '#f59e0b' },
  { lng: 160,    lat: 25,     label: '太平洋干线', tag: '海运13天', color: '#38bdf8' },
  { lng: -118.22, lat: 33.73, label: '洛杉矶港', tag: '清关', color: '#f97316' },
  { lng: -118.24, lat: 34.05, label: '洛杉矶买家', tag: 'C端交付', color: '#a78bfa' },
]

// Interpolate points along the route for smooth animation
function interpolateRoute(points: typeof WAYPOINTS, steps = 200) {
  const result: [number, number][] = []
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i], p2 = points[i + 1]
    const seg = Math.floor(steps / (points.length - 1))
    for (let s = 0; s <= seg; s++) {
      const t = s / seg
      // Simple cubic ease
      const lat = p1.lat + (p2.lat - p1.lat) * t
      // For Pacific crossing, wrap longitude correctly
      let lng1 = p1.lng, lng2 = p2.lng
      if (lng2 < lng1 && Math.abs(lng2 - lng1) > 180) lng2 += 360
      const lng = lng1 + (lng2 - lng1) * t
      result.push([lat, lng > 180 ? lng - 360 : lng])
    }
  }
  return result
}

interface Props {
  activeNode?: number  // 0-4, which waypoint is currently active
  playing?: boolean
}

export default function WorldMap({ activeNode = -1, playing = false }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const animFrameRef = useRef<number>(0)
  const routePoints = interpolateRoute(WAYPOINTS)
  const [animProgress, setAnimProgress] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return
    if (leafletRef.current) return // already initialized

    // Dynamically load leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(L => {
      if (!mapRef.current) return

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [25, 30],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      })

      // Dark tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map)

      leafletRef.current = { map, L }

      // Draw full route (dim)
      const routeLatLngs = routePoints.map(([lat, lng]) => L.latLng(lat, lng))
      L.polyline(routeLatLngs, { color: '#1e2640', weight: 2, dashArray: '4 6', opacity: 0.6 }).addTo(map)

      // Draw waypoint markers
      WAYPOINTS.forEach((wp, i) => {
        const icon = L.divIcon({
          html: `<div style="
            width:10px;height:10px;border-radius:50%;
            background:${wp.color};
            border:2px solid #0d1120;
            box-shadow:0 0 8px ${wp.color};
            transition:all 0.4s;
          "></div>`,
          className: '',
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        })
        const marker = L.marker([wp.lat, wp.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b style="color:${wp.color}">${wp.label}</b><br><span style="color:#64748b;font-size:10px">${wp.tag}</span>`, {
            permanent: false, direction: 'top',
            className: 'waic-tooltip',
          })
      })

      // Animated ship marker
      const shipIcon = L.divIcon({
        html: `<div style="font-size:18px;line-height:1;filter:drop-shadow(0 0 6px #38bdf8)">🚢</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
      const shipMarker = L.marker([WAYPOINTS[0].lat, WAYPOINTS[0].lng], { icon: shipIcon }).addTo(map)
      markerRef.current = shipMarker

      setMapLoaded(true)
    })
  }, [])

  // Animate ship along route when playing
  useEffect(() => {
    if (!playing || !leafletRef.current || !markerRef.current) return
    let frame = 0
    const total = routePoints.length - 1

    const animate = () => {
      if (frame >= total) {
        frame = 0
        setAnimProgress(0)
        return
      }
      const [lat, lng] = routePoints[frame]
      markerRef.current.setLatLng([lat, lng])
      setAnimProgress(frame / total)

      // Draw traveled path
      if (frame % 5 === 0 && leafletRef.current) {
        // update progress line  
      }

      frame += 1
      animFrameRef.current = window.setTimeout(animate, 80) as unknown as number
    }
    animate()
    return () => clearTimeout(animFrameRef.current)
  }, [playing])

  // Fly to active waypoint
  useEffect(() => {
    if (!leafletRef.current || activeNode < 0) return
    const wp = WAYPOINTS[activeNode]
    leafletRef.current.map.flyTo([wp.lat, wp.lng], 4, { duration: 1.2 })
  }, [activeNode])

  return (
    <div style={{ position: 'relative', height: '100%', background: '#070a12' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

      {/* Overlay: route progress */}
      {mapLoaded && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(7,10,18,0.88)', border: '1px solid #1e2640',
          borderRadius: 20, padding: '8px 20px', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: 12, zIndex: 1000,
        }}>
          {WAYPOINTS.map((wp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 7, height: 7, borderRadius: '50%', background: wp.color,
                opacity: activeNode >= i ? 1 : 0.3,
                boxShadow: activeNode === i ? `0 0 6px ${wp.color}` : 'none',
              }} />
              <span style={{ fontSize: 10, color: activeNode >= i ? '#e2e8f0' : '#64748b', whiteSpace: 'nowrap' }}>
                {wp.label}
              </span>
              {i < WAYPOINTS.length - 1 && (
                <div style={{ width: 20, height: 1, background: activeNode > i ? wp.color : '#1e2640' }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tooltip style injection */}
      <style>{`
        .waic-tooltip { background: #0d1120; border: 1px solid #1e2640; border-radius: 6px;
          color: #e2e8f0; font-size: 11px; padding: 4px 8px; box-shadow: none; }
        .waic-tooltip::before { display: none; }
        .leaflet-container { background: #070a12 !important; }
      `}</style>
    </div>
  )
}

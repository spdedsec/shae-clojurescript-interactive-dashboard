# Interactive System Dashboard

A real-time telemetry and process monitoring dashboard engineered strictly following the Apple Human Interface Guidelines (HIG).

## Features

- **Apple HIG Design System** — Cupertino-style translucent navigation bar, San Francisco typography, segmented control pills, elevation shadows
- **Native Light & Dark Mode** — Dynamic switching via `color-scheme: light dark` with `@media (prefers-color-scheme: dark)`
- **Real-Time Telemetry** — Live gauges for CPU load, memory utilization, disk space, and network bandwidth
- **Interactive Spline Charts** — Smooth Bezier performance charts with gradient fills and live telemetry stream
- **Active Process Monitor** — Live process listing with PID status indicators
- **Live Structured Logs** — Filterable, search-enabled console log viewer
- **Accessibility** — Semantic HTML5 markup, live regions, high-contrast focus rings, touch targets ≥ 44pt, reduced-motion compliance

## Quick Start

```bash
# Serve locally
python3 -m http.server 8080 -d src
```

Open `http://localhost:8080`.

## Design System

Engineered strictly following the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/):
- **Typography:** San Francisco (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `SF Pro Display`)
- **System Colors:** Apple System Blue (`#007AFF` / `#0A84FF`), Apple System Green (`#34C759` / `#30D158`), Apple System Orange (`#FF9500` / `#FF9F0A`), Apple System Purple (`#AF52DE` / `#BF5AF2`)
- **Light/Dark Mode:** Full support via `color-scheme: light dark`
- **8pt Grid:** 8, 16, 24, 32, 48px rhythm
- **Corner Radii:** 8pt, 12pt, 16pt, pill buttons
- **Elevation:** Apple 5-tier elevation shadows
- **Motion:** Spring curves (`cubic-bezier(0.4, 0, 0.2, 1)`) with `prefers-reduced-motion`

## License

MIT © 2026 spdedsec

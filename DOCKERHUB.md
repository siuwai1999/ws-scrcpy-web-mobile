# ws-scrcpy-web-mobile

> **Fork of [bilbospocketses/ws-scrcpy-web](https://github.com/bilbospocketses/ws-scrcpy-web)** with fixes for using it from **phones and tablets (iPhone / iPad)**.

## What this fork changes

- **iPad touch control works.** On iPadOS (Safari and Chrome) dragging on the phone screen used to scroll the whole web page and the device never received the touch. The touch layer now sits above the video layer (`touch-action: none`), and the page behind the stream dialog no longer scrolls.
- **Survives going to the Home screen.** iOS/iPadOS suspends a backgrounded page and drops its WebSocket (close code `1006`). Returning to the page now reconnects automatically instead of showing `stream failed`, and drops audio queued while away, so sound no longer lags far behind the picture. Tap the screen once after returning to re-enable audio (iOS requires a gesture).

> A web page cannot keep streaming while it is in the background on iOS; this fork makes coming back seamless instead.

## Docker

Image: [`siuwai1999/ws-scrcpy-web-mobile`](https://hub.docker.com/r/siuwai1999/ws-scrcpy-web-mobile) (linux/amd64)

```bash
docker pull siuwai1999/ws-scrcpy-web-mobile:latest
```

```yaml
services:
  ws-scrcpy-web-mobile:
    image: siuwai1999/ws-scrcpy-web-mobile:latest
    container_name: ws-scrcpy-web-mobile
    restart: unless-stopped
    ports:
      - "127.0.0.1:8000:8000"   # put a reverse proxy with auth in front
    volumes:
      - ./data:/data
      - /dev/bus/usb:/dev/bus/usb   # USB-attached Android devices
    device_cgroup_rules:
      - 'c 189:* rmw'
    environment:
      - WS_SCRCPY_ALLOW_REMOTE_ADMIN=1   # only behind an authenticated proxy, see SECURITY.md
```

Source: https://github.com/siuwai1999/ws-scrcpy-web-mobile

Build it yourself: `docker build -t ws-scrcpy-web-mobile .`

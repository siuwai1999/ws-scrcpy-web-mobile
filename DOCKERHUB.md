# ws-scrcpy-web-mobile

> **Fork of [bilbospocketses/ws-scrcpy-web](https://github.com/bilbospocketses/ws-scrcpy-web)** with fixes for using it from **phones and tablets (iPhone / iPad)**.

## What this fork changes

**A redesigned, mobile-friendly interface**

- **Modern flat UI** built on a design-token system (colour, type, spacing, radius, motion) with matching dark and light themes.
- **Site header** with a Devices / Network tab switch (Devices is the default) and the update, settings and theme controls.
- **Device cards** with a clear action hierarchy: a large **connect** button next to **turn on/off**, quiet shell / file links, and small icon buttons for rename, disconnect and stream settings.
- **One button system** across the whole app (primary, secondary, danger, icon) and consistent form fields and dropdowns in every dialog.
- **Network tab** reorganised: quick scan, scan QR code and pairing code sit together (QR code centred, cancel beneath it); *scan network* and *manually add* are tucked behind a `...` menu.
- **Phone-sized dialogs**: Settings, the file browser and the others fit a phone screen; the file browser gives the file name the room.

**iPhone / iPad fixes**

- **Touch control works on iPad.** Dragging on the phone screen used to scroll the whole page and never reached the device. The touch layer now sits above the video layer (`touch-action: none`) and the page behind the stream dialog no longer scrolls.
- **File browser no longer hangs on "loading...".** iOS/iPadOS Safari has no `Symbol.dispose`, which the client's `using` declarations need; a small polyfill fixes it (this also repaired the turn on/off and update buttons there).
- **Survives going to the Home screen.** iOS suspends a backgrounded page and drops its WebSocket (close code `1006`). Returning now reconnects automatically instead of showing `stream failed`, and audio queued while away is dropped so sound does not lag behind the picture. Tap the screen once after returning to re-enable audio (iOS requires a gesture).

> A web page cannot keep streaming while it is in the background on iOS; this fork makes coming back seamless instead.

**Debugging on a phone:** add `?debug` to the page URL to mirror the console on screen (for devices with no dev tools).

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

**Dialog** — the soft modal sheet for pause, confirm, and info. Warm scrim + a rounded card that springs in. Renders absolutely inside the nearest positioned ancestor, so give the phone frame `position: relative`.

```jsx
<Dialog
  open={paused}
  title="Tạm dừng"
  icon="pause"
  onClose={resume}
  actions={<>
    <Button variant="primary" fullWidth onClick={resume}>Tiếp tục</Button>
    <Button variant="ghost" fullWidth icon="home">Về Home</Button>
  </>}
/>
```

- Stack action Buttons (usually `fullWidth`) in `actions`.
- `dismissable={false}` for required choices (e.g. game-over).

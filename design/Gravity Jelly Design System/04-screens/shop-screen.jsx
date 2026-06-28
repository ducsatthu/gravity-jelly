/* shop-screen.jsx — SHOP / STORE. Coin balance header, booster shelf, coin
   packs. Tabbed. Exposes window.GJShopScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, Icon } = NS;
  const EX = window.GJExtras;

  function Tabs({ value, onChange }) {
    const opts = [['boosters', 'Vật phẩm'], ['coins', 'Mua xu']];
    return (
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-surface-sunken)', borderRadius: 999, margin: '0 var(--space-lg) var(--space-md)' }}>
        {opts.map(([k, l]) => (
          <button key={k} type="button" onClick={() => onChange(k)} style={{ flex: 1, height: 38, border: 'none', cursor: 'pointer', borderRadius: 999, background: value === k ? 'var(--color-surface)' : 'transparent', boxShadow: value === k ? 'var(--shadow-sm)' : 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-label)', color: value === k ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{l}</button>
        ))}
      </div>
    );
  }

  function BoosterCard({ glyph, color, name, desc, price }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: `color-mix(in srgb, ${color} 16%, var(--color-surface))`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{glyph}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>{desc}</div>
        </div>
        <button type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: 999, background: 'var(--color-primary)', boxShadow: '0 3px 0 var(--color-primary-edge)', color: '#fff', flexShrink: 0 }}>
          <EX.Coin size={17} /><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-label)' }}>{price}</span>
        </button>
      </div>
    );
  }

  function CoinPack({ amount, price, tag, best }) {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 'var(--space-lg) var(--space-md) var(--space-md)', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: best ? '0 0 0 3px var(--color-warning), var(--shadow-md)' : 'var(--shadow-sm)' }}>
        {best && <span style={{ position: 'absolute', top: -10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, letterSpacing: '0.06em', color: 'var(--color-text)', background: 'var(--color-warning)', padding: '3px 10px', borderRadius: 999 }}>TỐT NHẤT</span>}
        <div style={{ display: 'flex' }}>{[0, 1, 2].map((i) => <div key={i} style={{ marginLeft: i ? -10 : 0 }}><EX.Coin size={tag === 'lg' ? 40 : tag === 'md' ? 32 : 26} /></div>)}</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-heading)', color: 'var(--color-text)', lineHeight: 1 }}>{amount.toLocaleString('vi-VN')}</span>
        <button type="button" style={{ width: '100%', border: 'none', cursor: 'pointer', padding: '9px 0', borderRadius: 'var(--radius-md)', background: 'var(--color-success)', boxShadow: '0 3px 0 #4FAE60', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-label)' }}>{price}</button>
      </div>
    );
  }

  function ShopScreen({ balance = 1240, tab = 'boosters', onTab, onBack }) {
    const [t, setT] = React.useState(tab);
    const setTab = (k) => { setT(k); onTab && onTab(k); };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: 'var(--dim-hud-h)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '0 var(--space-md)' }}>
          <button type="button" onClick={onBack} aria-label="Quay lại" style={{ width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'transparent', color: 'var(--color-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="back" size={24} /></button>
          <h1 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)' }}>Cửa hàng</h1>
          <EX.CoinChip amount={balance} size="lg" />
        </div>

        <Tabs value={t} onChange={setTab} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-xl)' }}>
          {t === 'boosters' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <BoosterCard color="var(--color-gravity)" glyph={<Icon name="rotateCw" size={28} color="var(--color-gravity)" />} name="Thêm lượt xoay" desc="+5 lượt xoay trọng lực" price={120} />
              <BoosterCard color="var(--color-danger)" glyph={<EX.Bomb size={28} color="var(--color-danger)" />} name="Bom phá khối" desc="Xóa 1 vùng 3×3" price={200} />
              <BoosterCard color="var(--color-info)" glyph={<EX.Target size={28} color="var(--color-info)" />} name="Đổi màu khối" desc="Đổi 1 khối sang màu bạn chọn" price={160} />
              <BoosterCard color="var(--color-success)" glyph={<Icon name="refresh" size={28} color="var(--color-success)" />} name="Xáo lại bàn" desc="Trộn lại toàn bộ khối" price={150} />
              <BoosterCard color="var(--color-primary)" glyph={<Icon name="heart" size={28} color="var(--color-primary)" />} name="Đầy lượt chơi" desc="Hồi đầy 5 tim ngay" price={250} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
              <CoinPack amount={500} price="22.000đ" tag="sm" />
              <CoinPack amount={1200} price="49.000đ" tag="md" />
              <CoinPack amount={3000} price="99.000đ" tag="lg" best />
              <CoinPack amount={6500} price="199.000đ" tag="lg" />
            </div>
          )}
        </div>
      </div>
    );
  }

  window.GJShopScreen = ShopScreen;
})();

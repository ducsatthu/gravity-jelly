/* daily-reward-screen.jsx — DAILY REWARD. 7-day streak: claimed days, today
   (claimable), locked future days; streak header; Claim CTA. Exposes
   window.GJDailyRewardScreen. */

(function () {
  const NS = window.GravityJellyDesignSystem_3e0487;
  const { Button, Icon } = NS;
  const EX = window.GJExtras;

  const DAYS = [
    { coins: 50 }, { coins: 80 }, { coins: 120 }, { booster: 'rotate', label: '+3 Xoay' },
    { coins: 200 }, { coins: 300 }, { booster: 'gift', label: 'Rương lớn', big: true },
  ];

  function DayCard({ index, day, state }) {
    const claimed = state === 'claimed', today = state === 'today', locked = state === 'locked';
    const big = day.big;
    return (
      <div style={{
        gridColumn: big ? 'span 3' : 'auto',
        position: 'relative',
        display: 'flex', flexDirection: big ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: big ? 'var(--space-md)' : 4,
        padding: big ? 'var(--space-md)' : '10px 4px', minHeight: big ? 64 : 84,
        borderRadius: 'var(--radius-lg)',
        background: today ? 'var(--color-surface)' : claimed ? 'color-mix(in srgb, var(--color-success) 14%, var(--color-surface))' : 'var(--color-surface-sunken)',
        boxShadow: today ? '0 0 0 3px var(--color-primary), var(--shadow-md)' : 'var(--shadow-sm)',
        opacity: locked ? 0.6 : 1, boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 10, letterSpacing: '0.06em', color: 'var(--color-text-muted)', position: big ? 'static' : 'absolute', top: 6 }}>
          {big ? 'NGÀY 7' : `NGÀY ${index + 1}`}
        </span>
        <div style={{ marginTop: big ? 0 : 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          {day.booster === 'gift' ? <EX.Gift size={big ? 34 : 28} color="var(--color-primary)" />
            : day.booster ? <Icon name="rotateCw" size={28} color="var(--color-gravity)" />
            : <EX.Coin size={big ? 34 : 30} />}
          {big && <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-body)', color: 'var(--color-text)' }}>{day.label}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, color: 'var(--color-text-muted)' }}>Phần thưởng đặc biệt</span>
          </div>}
        </div>
        {!big && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--color-text)' }}>{day.label || `+${day.coins}`}</span>}
        {claimed && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'color-mix(in srgb, var(--color-success) 20%, transparent)', borderRadius: 'var(--radius-lg)' }}><span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={16} color="#fff" /></span></span>}
      </div>
    );
  }

  function DailyRewardScreen({ streak = 4, onClaim, onClose }) {
    // days before `streak`-1 claimed, day index streak-1 = today, rest locked
    const stateFor = (i) => i < streak - 1 ? 'claimed' : i === streak - 1 ? 'today' : 'locked';
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--space-xl)', boxSizing: 'border-box', justifyContent: 'center' }}>
        <button type="button" onClick={onClose} aria-label="Đóng" style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', width: 'var(--dim-icon-btn)', height: 'var(--dim-icon-btn)', borderRadius: 'var(--radius-lg)', border: 'none', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={22} /></button>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <EX.Calendar size={26} color="var(--color-primary)" />
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-title)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>Quà mỗi ngày</h1>
          </div>
          <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>Chuỗi <span style={{ color: 'var(--color-primary)' }}>{streak} ngày</span> · quay lại mỗi ngày để nhận nhiều hơn</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
          {DAYS.map((d, i) => <DayCard key={i} index={i} day={d} state={stateFor(i)} />)}
        </div>

        <Button variant="primary" size="cta" icon="star" fullWidth onClick={onClaim}>NHẬN QUÀ HÔM NAY</Button>
      </div>
    );
  }

  window.GJDailyRewardScreen = DailyRewardScreen;
})();

package com.gravityjelly.game

/**
 * Audio cue phát từ game loop — holder phát qua callback [EndlessGameHolder.onGameSound],
 * lớp vỏ (:app) map sang asset cụ thể rồi chơi qua SoundPool. Giữ ở :game vì thời điểm
 * phát gắn liền animation/playback (onClearStep, onComboBurst…) mà :app không biết.
 */
enum class GameSfx {
    PLACE,
    GRAVITY_ROTATE,
    CLEAR_BASE,
    CLEAR_COMBO,
    CLUSTER_COLLAPSE,
    SETTLED,
    SUPER_FORM_1,
    SUPER_FORM_2,
    RAINBOW_FORM,
    SUPER_DETONATE_1,
    SUPER_DETONATE_2,
    RAINBOW_DETONATE,
    ROTATION_REFUND,
    // Combo burst phát qua callback riêng onComboBurstSound(level) — không dùng enum.
    COMBO_EXPIRED,
    TRAY_DEALT,
    GAME_OVER,
    VINE_GROW,
    VINE_SNAP,
    TRASH_CRUMBLE,
    TRASH_TICK,
    DROP_CLEAR,
    STONE_ADDED,
    DEBRIS_ADDED,
    BOSS_GRAVITY_FLIP,
    BOSS_SHIELD_HIT,
}

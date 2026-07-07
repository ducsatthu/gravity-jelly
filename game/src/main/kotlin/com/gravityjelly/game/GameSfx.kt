package com.gravityjelly.game

/**
 * Audio cue phát từ game loop — holder phát qua callback [EndlessGameHolder.onGameSound],
 * lớp vỏ (:app) map sang asset cụ thể rồi chơi qua SoundPool. Giữ ở :game vì thời điểm
 * phát gắn liền animation/playback (onClearStep, onComboBurst…) mà :app không biết.
 */
enum class GameSfx {
    PLACE,
    GRAVITY_ROTATE,
    SUPER_FORM_1,
    SUPER_FORM_2,
    RAINBOW_FORM,
    RAINBOW_DETONATE,
    ROTATION_REFUND,
    // Combo burst phát qua callback riêng onComboBurstSound(level) — không dùng enum.
    COMBO_EXPIRED,
    GAME_OVER,
    DROP_CLEAR,
    BOSS_GRAVITY_FLIP,
}

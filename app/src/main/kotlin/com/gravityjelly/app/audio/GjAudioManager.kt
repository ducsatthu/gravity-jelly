package com.gravityjelly.app.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.SoundPool
import androidx.compose.runtime.staticCompositionLocalOf
import com.gravityjelly.app.R
import com.gravityjelly.game.GameSfx

val LocalGjAudio = staticCompositionLocalOf<GjAudioManager?> { null }

private const val SFX_VOL = 0.55f
private const val BGM_VOL = 0.72f

class GjAudioManager(private val context: Context) {

    var soundEnabled = true
    var musicEnabled = true
        set(value) {
            field = value
            if (value) {
                if (bgmWanted) bgmPlayer?.start()
            } else {
                bgmPlayer?.pause()
            }
        }

    // ── SoundPool (SFX) ────────────────────────────────────────────────────────

    private val pool: SoundPool = SoundPool.Builder()
        .setMaxStreams(8)
        .setAudioAttributes(
            AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_GAME)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
        )
        .build()

    private val ids = HashMap<GjSfx, Int>(GjSfx.entries.size)
    private var loaded = 0
    private val total = GjSfx.entries.size

    init {
        pool.setOnLoadCompleteListener { _, _, _ -> loaded++ }
        for (sfx in GjSfx.entries) {
            ids[sfx] = pool.load(context, sfx.rawResId, 1)
        }
    }

    fun play(sfx: GjSfx, rate: Float = 1f) {
        if (!soundEnabled || loaded < total) return
        val id = ids[sfx] ?: return
        pool.play(id, SFX_VOL, SFX_VOL, 1, 0, rate)
    }

    fun playGame(cue: GameSfx) {
        play(cue.toSfx())
    }

    /** Combo burst 20 bậc — comboStep 1..20; ≥20 dùng bậc cao nhất. */
    fun playComboBurst(comboStep: Int) {
        val idx = (comboStep - 1).coerceIn(0, COMBO_BURST.lastIndex)
        play(COMBO_BURST[idx])
    }

    // ── MediaPlayer (BGM) ──────────────────────────────────────────────────────

    private var bgmPlayer: MediaPlayer? = null
    private var bgmWanted = false

    fun startBgm() {
        bgmWanted = true
        if (!musicEnabled) return
        if (bgmPlayer == null) {
            bgmPlayer = MediaPlayer.create(context, R.raw.bgm_world_1)?.apply {
                isLooping = true
                setVolume(BGM_VOL, BGM_VOL)
            }
        }
        bgmPlayer?.let { if (!it.isPlaying) it.start() }
    }

    fun pauseBgm() {
        bgmPlayer?.pause()
    }

    fun resumeBgm() {
        if (bgmWanted && musicEnabled) bgmPlayer?.start()
    }

    fun stopBgm() {
        bgmWanted = false
        bgmPlayer?.stop()
        bgmPlayer?.release()
        bgmPlayer = null
    }

    fun release() {
        stopBgm()
        pool.release()
    }
}

private val COMBO_BURST = arrayOf(
    GjSfx.SFX_COMBO_BURST_01, GjSfx.SFX_COMBO_BURST_02, GjSfx.SFX_COMBO_BURST_03, GjSfx.SFX_COMBO_BURST_04,
    GjSfx.SFX_COMBO_BURST_05, GjSfx.SFX_COMBO_BURST_06, GjSfx.SFX_COMBO_BURST_07, GjSfx.SFX_COMBO_BURST_08,
    GjSfx.SFX_COMBO_BURST_09, GjSfx.SFX_COMBO_BURST_10, GjSfx.SFX_COMBO_BURST_11, GjSfx.SFX_COMBO_BURST_12,
    GjSfx.SFX_COMBO_BURST_13, GjSfx.SFX_COMBO_BURST_14, GjSfx.SFX_COMBO_BURST_15, GjSfx.SFX_COMBO_BURST_16,
    GjSfx.SFX_COMBO_BURST_17, GjSfx.SFX_COMBO_BURST_18, GjSfx.SFX_COMBO_BURST_19, GjSfx.SFX_COMBO_BURST_20,
)

private fun GameSfx.toSfx(): GjSfx = when (this) {
    GameSfx.PLACE -> GjSfx.SFX_PLACE
    GameSfx.GRAVITY_ROTATE -> GjSfx.SFX_GRAVITY_ROTATE
    GameSfx.CLEAR_BASE -> GjSfx.SFX_CLEAR_BASE
    GameSfx.CLEAR_COMBO -> GjSfx.SFX_CLEAR_COMBO
    GameSfx.CLUSTER_COLLAPSE -> GjSfx.SFX_CLUSTER_COLLAPSE
    GameSfx.SETTLED -> GjSfx.SFX_SETTLED
    GameSfx.SUPER_FORM_1 -> GjSfx.SFX_SUPER_FORM_1
    GameSfx.SUPER_FORM_2 -> GjSfx.SFX_SUPER_FORM_2
    GameSfx.RAINBOW_FORM -> GjSfx.SFX_RAINBOW_FORM
    GameSfx.SUPER_DETONATE_1 -> GjSfx.SFX_SUPER_DETONATE_1
    GameSfx.SUPER_DETONATE_2 -> GjSfx.SFX_SUPER_DETONATE_2
    GameSfx.RAINBOW_DETONATE -> GjSfx.SFX_RAINBOW_DETONATE
    GameSfx.ROTATION_REFUND -> GjSfx.SFX_ROTATION_REFUND
    GameSfx.COMBO_EXPIRED -> GjSfx.SFX_COMBO_EXPIRED
    GameSfx.TRAY_DEALT -> GjSfx.SFX_TRAY_DEALT
    GameSfx.GAME_OVER -> GjSfx.SFX_GAME_OVER
    GameSfx.VINE_GROW -> GjSfx.SFX_W2_VINE_GROW
    GameSfx.VINE_SNAP -> GjSfx.SFX_W2_VINE_SNAP
    GameSfx.TRASH_CRUMBLE -> GjSfx.SFX_W2_TRASH_CRUMBLE
    GameSfx.TRASH_TICK -> GjSfx.SFX_W2_TRASH_TICK
    GameSfx.DROP_CLEAR -> GjSfx.SFX_W3_DROP_CLEAR
    GameSfx.STONE_ADDED -> GjSfx.SFX_STONE_ADDED
    GameSfx.DEBRIS_ADDED -> GjSfx.SFX_DEBRIS_ADDED
    GameSfx.BOSS_GRAVITY_FLIP -> GjSfx.SFX_BOSS_GRAVITY_FLIP
    GameSfx.BOSS_SHIELD_HIT -> GjSfx.SFX_BOSS_SHIELD_HIT
}

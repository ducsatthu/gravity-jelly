package com.gravityjelly.app.audio

import com.gravityjelly.app.R

/**
 * Chỉ giữ các sfx thuộc BỘ ÂM THIẾT KẾ (design/Music/sfx). Các âm cũ không nằm trong bộ này
 * (clear_base/combo, cluster_collapse, super_detonate, settled, tray_dealt, vine/trash,
 * stone/debris, boss_shield_hit/vine_spawn, dialog_close) đã bị gỡ hẳn.
 */
enum class GjSfx {
    SFX_PLACE,
    SFX_GRAVITY_ROTATE,
    SFX_SUPER_FORM_1,
    SFX_SUPER_FORM_2,
    SFX_RAINBOW_FORM,
    SFX_RAINBOW_DETONATE,
    SFX_ROTATION_REFUND,
    SFX_COMBO_BURST_01,
    SFX_COMBO_BURST_02,
    SFX_COMBO_BURST_03,
    SFX_COMBO_BURST_04,
    SFX_COMBO_BURST_05,
    SFX_COMBO_BURST_06,
    SFX_COMBO_BURST_07,
    SFX_COMBO_BURST_08,
    SFX_COMBO_EXPIRED,
    SFX_NEW_BEST,
    SFX_GAME_OVER,
    SFX_W3_DROP_CLEAR,
    SFX_BOSS_GRAVITY_FLIP,
    SFX_BOSS_TELL,
    SFX_BOSS_DEFEATED,
    SFX_LEVEL_WIN,
    SFX_STAR_REVEAL,
    SFX_LEVEL_FAIL,
    SFX_OBJECTIVE_DONE,
    SFX_UI_PRIMARY,
    SFX_UI_SECONDARY,
    SFX_DIALOG_OPEN,
    SFX_TOGGLE_ON,
    SFX_TOGGLE_OFF,
    SFX_SCREEN_TRANSITION,
    SFX_CAMPAIGN_NODE_TAP,
    SFX_GUIDE_OPEN,
    SFX_GUIDE_CONFIRM,
    SFX_CONFETTI,
}

val GjSfx.rawResId: Int
    get() = when (this) {
        GjSfx.SFX_PLACE -> R.raw.sfx_place
        GjSfx.SFX_GRAVITY_ROTATE -> R.raw.sfx_gravity_rotate
        GjSfx.SFX_SUPER_FORM_1 -> R.raw.sfx_super_form_1
        GjSfx.SFX_SUPER_FORM_2 -> R.raw.sfx_super_form_2
        GjSfx.SFX_RAINBOW_FORM -> R.raw.sfx_rainbow_form
        GjSfx.SFX_RAINBOW_DETONATE -> R.raw.sfx_rainbow_detonate
        GjSfx.SFX_ROTATION_REFUND -> R.raw.sfx_rotation_refund
        GjSfx.SFX_COMBO_BURST_01 -> R.raw.sfx_combo_burst_01
        GjSfx.SFX_COMBO_BURST_02 -> R.raw.sfx_combo_burst_02
        GjSfx.SFX_COMBO_BURST_03 -> R.raw.sfx_combo_burst_03
        GjSfx.SFX_COMBO_BURST_04 -> R.raw.sfx_combo_burst_04
        GjSfx.SFX_COMBO_BURST_05 -> R.raw.sfx_combo_burst_05
        GjSfx.SFX_COMBO_BURST_06 -> R.raw.sfx_combo_burst_06
        GjSfx.SFX_COMBO_BURST_07 -> R.raw.sfx_combo_burst_07
        GjSfx.SFX_COMBO_BURST_08 -> R.raw.sfx_combo_burst_08
        GjSfx.SFX_COMBO_EXPIRED -> R.raw.sfx_combo_expired
        GjSfx.SFX_NEW_BEST -> R.raw.sfx_new_best
        GjSfx.SFX_GAME_OVER -> R.raw.sfx_game_over
        GjSfx.SFX_W3_DROP_CLEAR -> R.raw.sfx_w3_drop_clear
        GjSfx.SFX_BOSS_GRAVITY_FLIP -> R.raw.sfx_boss_gravity_flip
        GjSfx.SFX_BOSS_TELL -> R.raw.sfx_boss_tell
        GjSfx.SFX_BOSS_DEFEATED -> R.raw.sfx_boss_defeated
        GjSfx.SFX_LEVEL_WIN -> R.raw.sfx_level_win
        GjSfx.SFX_STAR_REVEAL -> R.raw.sfx_star_reveal
        GjSfx.SFX_LEVEL_FAIL -> R.raw.sfx_level_fail
        GjSfx.SFX_OBJECTIVE_DONE -> R.raw.sfx_objective_done
        GjSfx.SFX_UI_PRIMARY -> R.raw.sfx_ui_primary
        GjSfx.SFX_UI_SECONDARY -> R.raw.sfx_ui_secondary
        GjSfx.SFX_DIALOG_OPEN -> R.raw.sfx_dialog_open
        GjSfx.SFX_TOGGLE_ON -> R.raw.sfx_toggle_on
        GjSfx.SFX_TOGGLE_OFF -> R.raw.sfx_toggle_off
        GjSfx.SFX_SCREEN_TRANSITION -> R.raw.sfx_screen_transition
        GjSfx.SFX_CAMPAIGN_NODE_TAP -> R.raw.sfx_campaign_node_tap
        GjSfx.SFX_GUIDE_OPEN -> R.raw.sfx_guide_open
        GjSfx.SFX_GUIDE_CONFIRM -> R.raw.sfx_guide_confirm
        GjSfx.SFX_CONFETTI -> R.raw.sfx_confetti
    }

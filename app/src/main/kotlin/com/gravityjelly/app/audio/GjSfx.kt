package com.gravityjelly.app.audio

import com.gravityjelly.app.R

enum class GjSfx {
    SFX_PLACE,
    SFX_GRAVITY_ROTATE,
    SFX_CLEAR_BASE,
    SFX_CLEAR_COMBO,
    SFX_CLUSTER_COLLAPSE,
    SFX_SUPER_FORM_1,
    SFX_SUPER_FORM_2,
    SFX_RAINBOW_FORM,
    SFX_SUPER_DETONATE_1,
    SFX_SUPER_DETONATE_2,
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
    SFX_COMBO_BURST_09,
    SFX_COMBO_BURST_10,
    SFX_COMBO_BURST_11,
    SFX_COMBO_BURST_12,
    SFX_COMBO_BURST_13,
    SFX_COMBO_BURST_14,
    SFX_COMBO_BURST_15,
    SFX_COMBO_BURST_16,
    SFX_COMBO_BURST_17,
    SFX_COMBO_BURST_18,
    SFX_COMBO_BURST_19,
    SFX_COMBO_BURST_20,
    SFX_COMBO_EXPIRED,
    SFX_TRAY_DEALT,
    SFX_NEW_BEST,
    SFX_GAME_OVER,
    SFX_SETTLED,
    SFX_W2_VINE_GROW,
    SFX_W2_VINE_SNAP,
    SFX_W2_TRASH_CRUMBLE,
    SFX_W2_TRASH_TICK,
    SFX_W3_DROP_CLEAR,
    SFX_STONE_ADDED,
    SFX_DEBRIS_ADDED,
    SFX_BOSS_GRAVITY_FLIP,
    SFX_BOSS_TELL,
    SFX_BOSS_SHIELD_HIT,
    SFX_BOSS_DEFEATED,
    SFX_BOSS_VINE_SPAWN,
    SFX_LEVEL_WIN,
    SFX_STAR_REVEAL,
    SFX_LEVEL_FAIL,
    SFX_OBJECTIVE_DONE,
    SFX_UI_PRIMARY,
    SFX_UI_SECONDARY,
    SFX_DIALOG_OPEN,
    SFX_DIALOG_CLOSE,
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
        GjSfx.SFX_CLEAR_BASE -> R.raw.sfx_clear_base
        GjSfx.SFX_CLEAR_COMBO -> R.raw.sfx_clear_combo
        GjSfx.SFX_CLUSTER_COLLAPSE -> R.raw.sfx_cluster_collapse
        GjSfx.SFX_SUPER_FORM_1 -> R.raw.sfx_super_form_1
        GjSfx.SFX_SUPER_FORM_2 -> R.raw.sfx_super_form_2
        GjSfx.SFX_RAINBOW_FORM -> R.raw.sfx_rainbow_form
        GjSfx.SFX_SUPER_DETONATE_1 -> R.raw.sfx_super_detonate_1
        GjSfx.SFX_SUPER_DETONATE_2 -> R.raw.sfx_super_detonate_2
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
        GjSfx.SFX_COMBO_BURST_09 -> R.raw.sfx_combo_burst_09
        GjSfx.SFX_COMBO_BURST_10 -> R.raw.sfx_combo_burst_10
        GjSfx.SFX_COMBO_BURST_11 -> R.raw.sfx_combo_burst_11
        GjSfx.SFX_COMBO_BURST_12 -> R.raw.sfx_combo_burst_12
        GjSfx.SFX_COMBO_BURST_13 -> R.raw.sfx_combo_burst_13
        GjSfx.SFX_COMBO_BURST_14 -> R.raw.sfx_combo_burst_14
        GjSfx.SFX_COMBO_BURST_15 -> R.raw.sfx_combo_burst_15
        GjSfx.SFX_COMBO_BURST_16 -> R.raw.sfx_combo_burst_16
        GjSfx.SFX_COMBO_BURST_17 -> R.raw.sfx_combo_burst_17
        GjSfx.SFX_COMBO_BURST_18 -> R.raw.sfx_combo_burst_18
        GjSfx.SFX_COMBO_BURST_19 -> R.raw.sfx_combo_burst_19
        GjSfx.SFX_COMBO_BURST_20 -> R.raw.sfx_combo_burst_20
        GjSfx.SFX_COMBO_EXPIRED -> R.raw.sfx_combo_expired
        GjSfx.SFX_TRAY_DEALT -> R.raw.sfx_tray_dealt
        GjSfx.SFX_NEW_BEST -> R.raw.sfx_new_best
        GjSfx.SFX_GAME_OVER -> R.raw.sfx_game_over
        GjSfx.SFX_SETTLED -> R.raw.sfx_settled
        GjSfx.SFX_W2_VINE_GROW -> R.raw.sfx_w2_vine_grow
        GjSfx.SFX_W2_VINE_SNAP -> R.raw.sfx_w2_vine_snap
        GjSfx.SFX_W2_TRASH_CRUMBLE -> R.raw.sfx_w2_trash_crumble
        GjSfx.SFX_W2_TRASH_TICK -> R.raw.sfx_w2_trash_tick
        GjSfx.SFX_W3_DROP_CLEAR -> R.raw.sfx_w3_drop_clear
        GjSfx.SFX_STONE_ADDED -> R.raw.sfx_stone_added
        GjSfx.SFX_DEBRIS_ADDED -> R.raw.sfx_debris_added
        GjSfx.SFX_BOSS_GRAVITY_FLIP -> R.raw.sfx_boss_gravity_flip
        GjSfx.SFX_BOSS_TELL -> R.raw.sfx_boss_tell
        GjSfx.SFX_BOSS_SHIELD_HIT -> R.raw.sfx_boss_shield_hit
        GjSfx.SFX_BOSS_DEFEATED -> R.raw.sfx_boss_defeated
        GjSfx.SFX_BOSS_VINE_SPAWN -> R.raw.sfx_boss_vine_spawn
        GjSfx.SFX_LEVEL_WIN -> R.raw.sfx_level_win
        GjSfx.SFX_STAR_REVEAL -> R.raw.sfx_star_reveal
        GjSfx.SFX_LEVEL_FAIL -> R.raw.sfx_level_fail
        GjSfx.SFX_OBJECTIVE_DONE -> R.raw.sfx_objective_done
        GjSfx.SFX_UI_PRIMARY -> R.raw.sfx_ui_primary
        GjSfx.SFX_UI_SECONDARY -> R.raw.sfx_ui_secondary
        GjSfx.SFX_DIALOG_OPEN -> R.raw.sfx_dialog_open
        GjSfx.SFX_DIALOG_CLOSE -> R.raw.sfx_dialog_close
        GjSfx.SFX_TOGGLE_ON -> R.raw.sfx_toggle_on
        GjSfx.SFX_TOGGLE_OFF -> R.raw.sfx_toggle_off
        GjSfx.SFX_SCREEN_TRANSITION -> R.raw.sfx_screen_transition
        GjSfx.SFX_CAMPAIGN_NODE_TAP -> R.raw.sfx_campaign_node_tap
        GjSfx.SFX_GUIDE_OPEN -> R.raw.sfx_guide_open
        GjSfx.SFX_GUIDE_CONFIRM -> R.raw.sfx_guide_confirm
        GjSfx.SFX_CONFETTI -> R.raw.sfx_confetti
    }

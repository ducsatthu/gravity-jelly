package com.gravityjelly.app

import androidx.annotation.DrawableRes
import androidx.annotation.RawRes
import androidx.annotation.StringRes

/**
 * Cảnh (nền + nhạc) — dùng chung cho cả Home và in-game (home-screen.jsx SCENES).
 * Mở khoá bằng điểm kỷ lục Endless. Mỗi cảnh gắn 1 nhạc nền; người chơi chọn cảnh + nhạc
 * ĐỘC LẬP trong Tùy chỉnh.
 */
data class Scene(
    val id: String,
    @StringRes val nameRes: Int,
    @DrawableRes val bgRes: Int,
    @StringRes val trackNameRes: Int,
    @RawRes val trackRes: Int,
    val unlockAt: Int,
)

object Scenes {
    val meadow = Scene(
        id = "meadow",
        nameRes = R.string.scene_meadow,
        bgRes = R.drawable.ingame_world_1_bg,
        trackNameRes = R.string.track_meadow,
        trackRes = R.raw.bgm_world_1,
        unlockAt = 0,
    )
    val forest = Scene(
        id = "forest",
        nameRes = R.string.scene_forest,
        bgRes = R.drawable.ingame_world_2_bg,
        trackNameRes = R.string.track_forest,
        trackRes = R.raw.bgm_world_2,
        unlockAt = 6_000,
    )
    val waterfall = Scene(
        id = "waterfall",
        nameRes = R.string.scene_waterfall,
        bgRes = R.drawable.ingame_world_3_bg,
        trackNameRes = R.string.track_waterfall,
        trackRes = R.raw.bgm_world_3,
        unlockAt = 40_000,
    )

    val all = listOf(meadow, forest, waterfall)

    fun byId(id: String): Scene = all.find { it.id == id } ?: meadow

    fun trackById(id: String): Scene = all.find { it.id == id } ?: meadow
}

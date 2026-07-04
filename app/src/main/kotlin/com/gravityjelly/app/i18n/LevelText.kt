package com.gravityjelly.app.i18n

import androidx.annotation.StringRes
import com.gravityjelly.app.R

/**
 * Tra tên hiển thị của một màn Campaign theo `id` → resource đa ngôn ngữ (`values(-en)/strings.xml`).
 *
 * `:core` là Kotlin/JVM thuần nên KHÔNG giữ text hiển thị; `Level.id` là khoá ổn định, lớp vỏ
 * `:app` map sang `R.string.level_<id>_name` rồi resolve bằng `stringResource`. Thêm màn mới =
 * thêm một nhánh ở đây + hai dòng resource (vi + en).
 */
@StringRes
fun levelNameRes(id: Int): Int = when (id) {
    1 -> R.string.level_1_name; 2 -> R.string.level_2_name; 3 -> R.string.level_3_name
    4 -> R.string.level_4_name; 5 -> R.string.level_5_name; 6 -> R.string.level_6_name
    7 -> R.string.level_7_name; 8 -> R.string.level_8_name; 9 -> R.string.level_9_name
    10 -> R.string.level_10_name; 11 -> R.string.level_11_name; 12 -> R.string.level_12_name
    13 -> R.string.level_13_name; 14 -> R.string.level_14_name; 15 -> R.string.level_15_name
    16 -> R.string.level_16_name; 17 -> R.string.level_17_name; 18 -> R.string.level_18_name
    19 -> R.string.level_19_name; 20 -> R.string.level_20_name; 21 -> R.string.level_21_name
    22 -> R.string.level_22_name; 23 -> R.string.level_23_name; 24 -> R.string.level_24_name
    25 -> R.string.level_25_name; 26 -> R.string.level_26_name; 27 -> R.string.level_27_name
    28 -> R.string.level_28_name; 29 -> R.string.level_29_name; 30 -> R.string.level_30_name
    else -> R.string.level_1_name
}

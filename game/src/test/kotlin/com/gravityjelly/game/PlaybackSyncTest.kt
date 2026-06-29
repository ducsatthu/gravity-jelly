package com.gravityjelly.game

import com.gravityjelly.core.CellType
import com.gravityjelly.core.Direction
import com.gravityjelly.core.EndlessEngine
import com.gravityjelly.core.GameEvent
import com.gravityjelly.core.Grid
import com.gravityjelly.core.JellyColor
import com.gravityjelly.core.Piece
import com.gravityjelly.core.freePlace
import com.gravityjelly.core.PlacementResult
import org.junit.Assert.fail
import org.junit.Test

/**
 * Bất biến PLAYBACK: sau khi animator chạy hết mọi pha của một nước (đặt mảnh / xoay),
 * [BoardAnimator.displayGrid] (thứ người chơi THẤY) PHẢI khớp grid truth của engine.
 *
 * Nếu lệch → người chơi thấy bàn "chưa rơi" sau flash, rồi nước kế displayGrid=null khiến
 * bàn nhảy về truth ("trọng lực rơi ngay khi thả block tiếp"). Test này bắt đúng ca đó.
 */
class PlaybackSyncTest {

    private fun ascii(grid: Grid): String {
        val sb = StringBuilder()
        for (y in 0 until Grid.SIZE) {
            for (x in 0 until Grid.SIZE) {
                val cell = grid.get(x, y)
                sb.append(
                    when {
                        cell == null -> '·'
                        cell.type == CellType.STONE -> '#'
                        cell.isRainbow -> 'R'
                        cell.isSuper -> 'S'
                        else -> when (cell.color) {
                            JellyColor.YELLOW -> 'Y'; JellyColor.MINT -> 'M'
                            JellyColor.PINK -> 'P'; JellyColor.BLUE -> 'B'; null -> '?'
                        }
                    },
                )
                sb.append(' ')
            }
            sb.append('\n')
        }
        return sb.toString()
    }

    /** So sánh hai grid theo (type,color,super,rainbow) từng ô. */
    private fun sameGrid(a: Grid, b: Grid): Boolean {
        for (y in 0 until Grid.SIZE) for (x in 0 until Grid.SIZE) {
            val ca = a.get(x, y); val cb = b.get(x, y)
            if (ca == null && cb == null) continue
            if (ca == null || cb == null) return false
            if (ca.type != cb.type || ca.color != cb.color ||
                ca.superLevel != cb.superLevel || ca.rainbow != cb.rainbow
            ) return false
        }
        return true
    }

    /** Bước đồng hồ sim đủ dài để mọi pha playback hoàn tất. */
    private fun drain(anim: BoardAnimator) {
        repeat(1200) { anim.step(GameClock.STEP_NANOS) }   // ~20s sim, thừa cho mọi cascade
    }

    @Test
    fun displayGrid_matches_engine_after_every_move() {
        var checked = 0
        for (seed in 0L until 400L) {
            val engine = EndlessEngine(seed = seed)
            val anim = BoardAnimator()
            var pre = engine.state().grid
            var preG = engine.state().gravity

            var turns = 0
            while (!engine.state().isGameOver && turns < 200) {
                val s = engine.state()
                // tìm một nước đặt hợp lệ (hard-drop), nếu không xoay
                var events: List<GameEvent> = emptyList()
                outer@ for (i in s.tray.indices) {
                    for (lat in 0 until Grid.SIZE) {
                        val ev = engine.placePiece(i, lat)
                        if (ev.isNotEmpty()) { events = ev; break@outer }
                    }
                }
                if (events.isEmpty()) {
                    if (s.rotationBudget <= 0) break
                    events = engine.rotateGravity(cw = true)
                    if (events.isEmpty()) break
                }

                val post = engine.state().grid
                val postG = engine.state().gravity
                anim.ingest(events, pre, preG, post, postG)
                drain(anim)

                val shown = anim.displayGrid
                if (shown != null && !sameGrid(shown, post)) {
                    fail(
                        buildString {
                            append("LỆCH playback tại seed=$seed turn=$turns\n")
                            append("events: ").append(events.joinToString { it::class.simpleName ?: "?" }).append('\n')
                            append("PRE (gravity=$preG):\n").append(ascii(pre))
                            append("displayGrid (người chơi THẤY):\n").append(ascii(shown))
                            append("engine truth (post, gravity=$postG):\n").append(ascii(post))
                        },
                    )
                }
                checked++
                pre = post
                preG = postG
                turns++
            }
        }
        println("PlaybackSyncTest: đã kiểm $checked nước, không lệch.")
    }

    /** Liệt kê mọi offset đặt-tự-do hợp lệ cho [piece]. */
    private fun freeSpots(grid: Grid, piece: Piece): List<Pair<Int, Int>> {
        val out = ArrayList<Pair<Int, Int>>()
        for (oy in 0..(Grid.SIZE - piece.shape.height))
            for (ox in 0..(Grid.SIZE - piece.shape.width))
                if (freePlace(grid, piece, ox, oy) is PlacementResult.Success) out.add(ox to oy)
        return out
    }

    @Test
    fun displayGrid_matches_engine_after_every_FREE_move() {
        var checked = 0
        for (seed in 0L until 600L) {
            val engine = EndlessEngine(seed = seed)
            val anim = BoardAnimator()
            var pre = engine.state().grid
            var preG = engine.state().gravity
            var rngState = seed * 0x9E3779B97F4A7C15uL.toLong() + 1

            fun nextRand(bound: Int): Int {
                rngState = rngState * 6364136223846793005L + 1442695040888963407L
                val v = (rngState ushr 33).toInt() and Int.MAX_VALUE
                return v % bound
            }

            var turns = 0
            while (!engine.state().isGameOver && turns < 220) {
                val s = engine.state()
                var events: List<GameEvent> = emptyList()
                // thử đặt-tự-do NGẪU NHIÊN (gồm cả chỗ treo lửng) trên các mảnh khay
                val order = s.tray.indices.shuffledBy { nextRand(it) }
                for (i in order) {
                    val spots = freeSpots(s.grid, s.tray[i])
                    if (spots.isEmpty()) continue
                    val (ox, oy) = spots[nextRand(spots.size)]
                    events = engine.placePieceAt(i, ox, oy)
                    if (events.isNotEmpty()) break
                }
                if (events.isEmpty()) {
                    if (s.rotationBudget <= 0) break
                    events = engine.rotateGravity(cw = nextRand(2) == 0)
                    if (events.isEmpty()) break
                }

                val post = engine.state().grid
                val postG = engine.state().gravity
                anim.ingest(events, pre, preG, post, postG)
                drain(anim)

                val shown = anim.displayGrid
                if (shown != null && !sameGrid(shown, post)) {
                    fail(
                        buildString {
                            append("LỆCH playback (đặt-tự-do) tại seed=$seed turn=$turns\n")
                            append("events: ").append(events.joinToString { it::class.simpleName ?: "?" }).append('\n')
                            append("PRE (gravity=$preG):\n").append(ascii(pre))
                            append("displayGrid (người chơi THẤY):\n").append(ascii(shown))
                            append("engine truth (post, gravity=$postG):\n").append(ascii(post))
                        },
                    )
                }
                checked++
                pre = post
                preG = postG
                turns++
            }
        }
        println("PlaybackSyncTest(FREE): đã kiểm $checked nước, không lệch.")
    }
}

/** Hoán vị deterministic theo nguồn rand truyền vào (Fisher–Yates). */
private fun IntRange.shuffledBy(rand: (Int) -> Int): List<Int> {
    val a = this.toMutableList()
    for (i in a.indices.reversed()) {
        val j = rand(i + 1)
        val t = a[i]; a[i] = a[j]; a[j] = t
    }
    return a
}

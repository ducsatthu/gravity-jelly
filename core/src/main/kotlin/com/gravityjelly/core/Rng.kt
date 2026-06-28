package com.gravityjelly.core

/**
 * PRNG seed được, deterministic — nền cho Daily seed và solver/sinh màn.
 * KHÔNG dùng java.util.Random toàn cục. Thuật toán SplitMix64: nhanh, ổn định,
 * cùng seed + cùng chuỗi gọi PHẢI cho cùng kết quả trên mọi nền tảng.
 *
 * Yêu cầu cứng (CLAUDE.md): mọi ngẫu nhiên đi qua đây.
 */
class Rng(seed: Long) {
    private var state: ULong = seed.toULong()

    private fun next(): ULong {
        state += 0x9E3779B97F4A7C15uL
        var z = state
        z = (z xor (z shr 30)) * 0xBF58476D1CE4E5B9uL
        z = (z xor (z shr 27)) * 0x94D049BB133111EBuL
        return z xor (z shr 31)
    }

    /** Số nguyên trong [0, bound). */
    fun nextInt(bound: Int): Int {
        require(bound > 0) { "bound phải > 0" }
        val r = (next() shr 33).toInt() // 31-bit dương
        return r % bound
    }

    fun nextLong(): Long = next().toLong()

    /** Double trong [0,1). */
    fun nextDouble(): Double = (next() shr 11).toLong() * (1.0 / (1L shl 53))

    /** Lấy ngẫu nhiên một phần tử (deterministic). */
    fun <T> pick(list: List<T>): T = list[nextInt(list.size)]
}

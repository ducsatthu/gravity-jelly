package com.gravityjelly.app

import android.content.pm.PackageManager
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.res.stringResource
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import com.gravityjelly.game.GjEase

/**
 * Màn Splash / Loading — logo PNG mới (home_logo) + thanh tiến trình jelly + version.
 *
 * Hai lớp splash phối hợp:
 *  1) Splash HỆ THỐNG (Theme.GravityJelly.Splash + installSplashScreen) hiện tức thì lúc
 *     cold start — nền kem + icon khối jelly, hết chớp trắng.
 *  2) Màn này (Compose) tiếp quản: hoàn thiện thương hiệu + "đang tải" trong lúc SDK/ads init
 *     ở luồng nền, rồi tự chuyển sang Home.
 */
@Composable
fun SplashScreen(
    onContinue: () -> Unit,
    modifier: Modifier = Modifier,
    reducedMotion: Boolean = false,
) {
    val context = LocalContext.current
    val version = remember {
        runCatching {
            context.packageManager.getPackageInfo(context.packageName, 0).versionName
        }.getOrNull() ?: "1.0.0"
    }

    // Tiến trình 0→1: tween ease-out (--ease-out). reduced-motion → gần như tức thời.
    val progress = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        progress.animateTo(
            targetValue = 1f,
            animationSpec = tween(if (reducedMotion) 200 else 1400, easing = GjEase.out),
        )
        // Giữ một nhịp ngắn ở 100% cho mắt kịp đọc rồi trao cho Home.
        kotlinx.coroutines.delay(if (reducedMotion) 0 else 220)
        onContinue()
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            // Nền radial kem ấm — splash-screen.jsx: at 50% 28%, #FFFDF7→bg→#F3E3CC.
            .drawBehind {
                drawRect(
                    brush = Brush.radialGradient(
                        colors = listOf(SplashTop, GjPalette.Bg, SplashEdge),
                        center = Offset(size.width / 2f, size.height * 0.28f),
                        radius = size.width * 1.05f,
                    ),
                )
            },
        contentAlignment = Alignment.Center,
    ) {
        // Hai blob mềm mờ phía sau (mint-shine trên-trái · pink-shine dưới-phải).
        Box(
            Modifier
                .align(Alignment.TopStart)
                .padding(top = 70.dp)
                .offset(x = (-30).dp)
                .size(120.dp)
                .blob(GjPalette.BlockMintShine, 0.5f),
        )
        Box(
            Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 120.dp)
                .offset(x = 24.dp)
                .size(90.dp)
                .blob(GjPalette.BlockPinkShine, 0.55f),
        )

        // ── Logo PNG mới (giống Home) + nhún nhẹ ───────────────────────────────
        SplashLogo(reducedMotion = reducedMotion)

        // ── Tiến trình (gần đáy) ──────────────────────────────────────────────────
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 64.dp)
                .padding(horizontal = GjSpace.xxxl) // space-3xl = 48
                .fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(GjSpace.md),
        ) {
            ProgressBar(progress.value)
            Text(
                text = stringResource(R.string.splash_loading, (progress.value * 100).toInt()),
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.04.em,
                ),
                color = GjPalette.TextMuted,
            )
        }

        // Version (đáy cùng).
        Text(
            text = "v$version",
            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
            color = GjPalette.TextMuted.copy(alpha = 0.7f),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 22.dp),
        )
    }
}

// ── Logo PNG (home_logo) + bob nhẹ — giống LogoMark trên Home ───────────────────

@Composable
private fun SplashLogo(reducedMotion: Boolean) {
    val bob = remember { Animatable(0f) }
    LaunchedEffect(reducedMotion) {
        if (reducedMotion) return@LaunchedEffect
        bob.animateTo(
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(4000, easing = GjEase.inOut),
                repeatMode = RepeatMode.Restart,
            ),
        )
    }
    val offsetY = if (reducedMotion) 0f else {
        -6f * kotlin.math.sin(bob.value * 2f * kotlin.math.PI.toFloat())
    }
    Image(
        painter = painterResource(R.drawable.home_logo),
        contentDescription = "Gravity Jelly",
        modifier = Modifier
            .width(250.dp)
            .graphicsLayer { translationY = offsetY.dp.toPx() },
        contentScale = ContentScale.FillWidth,
    )
}

// ── Thanh tiến trình jelly (track lõm + fill gradient mint→blue) ─────────────────

@Composable
private fun ProgressBar(progress: Float) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(14.dp)
            .clip(RoundedCornerShape(GjRadius.full))
            .drawBehind { drawRect(GjPalette.SurfaceSunken) }
            .padding(2.dp),
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(progress.coerceIn(0f, 1f))
                .clip(RoundedCornerShape(GjRadius.full))
                .drawBehind {
                    drawRect(
                        brush = Brush.horizontalGradient(
                            listOf(GjPalette.BlockMint, GjPalette.BlockBlue),
                        ),
                    )
                },
        )
    }
}

// ── helpers ─────────────────────────────────────────────────────────────────────

private val SplashTop = Color(0xFFFFFDF7)
private val SplashEdge = Color(0xFFF3E3CC)

/** Blob tròn mềm, mờ — nền trang trí splash (không chặn tương tác). */
private fun Modifier.blob(color: Color, alpha: Float): Modifier =
    this
        .clip(RoundedCornerShape(GjRadius.full))
        .drawBehind { drawRect(color.copy(alpha = alpha)) }

// ── Preview ─────────────────────────────────────────────────────────────────────

@Preview(name = "Splash", widthDp = 360, heightDp = 800)
@Composable
private fun SplashPreview() {
    GravityJellyTheme {
        SplashScreen(onContinue = {})
    }
}

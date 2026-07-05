package com.gravityjelly.app

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.games.PlayGamesManager
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.leaderboard.FilledStar
import com.gravityjelly.app.ui.leaderboard.LbEntry
import com.gravityjelly.app.ui.leaderboard.LbSource
import com.gravityjelly.app.ui.leaderboard.LbYou
import com.gravityjelly.app.ui.leaderboard.Leaf
import com.gravityjelly.app.ui.leaderboard.LbRow
import com.gravityjelly.app.ui.leaderboard.LeaderboardUiState
import com.gravityjelly.app.ui.leaderboard.Podium
import com.gravityjelly.app.ui.leaderboard.YouRow
import com.gravityjelly.app.ui.leaderboard.offlineState
import com.gravityjelly.app.ui.theme.GjPalette
import com.gravityjelly.app.ui.theme.GjRadius
import com.gravityjelly.app.ui.theme.GjSpace
import com.gravityjelly.app.ui.theme.GravityJellyTheme
import kotlinx.coroutines.launch

/**
 * Route Bảng xếp hạng: sở hữu việc tải dữ liệu (PGS online ↔ nội bộ offline) rồi render
 * [LeaderboardScreen]. Đăng nhập/tải PGS chỉ chạy khi [PlayGamesManager.configured] = true;
 * còn placeholder → luôn dùng bảng nội bộ (bot roster + best thật). Xem [PlayGamesManager].
 */
@Composable
fun LeaderboardRoute(
    games: PlayGamesManager,
    best: Int,
    playerName: String,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val context = LocalContext.current
    val activity = remember(context) { context.findActivity() }
    val scope = rememberCoroutineScope()
    val defaultName = stringResource(R.string.leaderboard_default_name)
    val localName = playerName.ifBlank { defaultName }

    var state by remember {
        mutableStateOf(
            LeaderboardUiState(LbSource.LOADING, emptyList(), emptyList(), null, games.configured, false),
        )
    }

    suspend fun refresh() {
        if (!games.configured || activity == null) {
            state = offlineState(best, localName, games.configured, false); return
        }
        games.initialize()
        val signedIn = games.isAuthenticated(activity)
        if (!signedIn) { state = offlineState(best, localName, true, false); return }
        val online = games.load(activity)
        state = if (online != null && online.entries.isNotEmpty()) {
            LeaderboardUiState(
                source = LbSource.ONLINE,
                top = online.entries.take(3),
                rest = online.entries.drop(3),
                you = online.you?.copy(name = online.you.name.ifBlank { localName })
                    ?: LbYou(0, localName, best),
                configured = true, signedIn = true,
            )
        } else offlineState(best, localName, true, true)
    }

    LaunchedEffect(best, playerName) { refresh() }

    LeaderboardScreen(
        state = state,
        onBack = onBack,
        onSignIn = { scope.launch { if (activity != null && games.signIn(activity)) refresh() } },
        modifier = modifier,
    )
}

/** Render thuần theo [state] (đã tách khỏi việc tải để test/preview được). */
@Composable
fun LeaderboardScreen(
    state: LeaderboardUiState,
    onBack: () -> Unit,
    onSignIn: () -> Unit,
    modifier: Modifier = Modifier,
) {
    GjScreenScaffold(modifier = modifier, applyGutter = false, contentAlignment = Alignment.TopStart) {
        Column(Modifier.fillMaxSize()) {
            Header(onBack)

            if (state.source == LbSource.LOADING) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(
                        stringResource(R.string.leaderboard_loading),
                        style = MaterialTheme.typography.bodyLarge, color = GjPalette.TextMuted,
                    )
                }
                return@Column
            }

            Spacer(Modifier.height(4.dp))
            BoardTag()
            Spacer(Modifier.height(6.dp))
            Text(
                stringResource(R.string.leaderboard_subtitle),
                modifier = Modifier.fillMaxWidth().padding(horizontal = GjSpace.lg),
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                color = GjPalette.TextMuted, textAlign = TextAlign.Center,
            )

            // gợi ý đăng nhập (chỉ khi PGS đã cấu hình nhưng chưa đăng nhập)
            if (state.configured && !state.signedIn) {
                SignInBanner(onSignIn)
            }

            val podiumReady = state.top.size == 3
            if (podiumReady) {
                Spacer(Modifier.height(6.dp))
                PodiumBlock(state.top)
            }

            // danh sách: nếu đủ bục → hạng 4..N; nếu không → dồn tất cả thành hàng từ hạng 1
            val rows = if (podiumReady) state.rest else state.top + state.rest
            val startRank = if (podiumReady) 4 else 1
            Column(
                Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState())
                    .padding(horizontal = GjSpace.lg, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                rows.forEachIndexed { i, e -> LbRow(rank = startRank + i, name = e.name, score = e.score) }
            }

            state.you?.let { you ->
                Box(Modifier.fillMaxWidth().padding(horizontal = GjSpace.lg, vertical = 6.dp)) {
                    YouRow(rank = you.rank, name = you.name, score = you.score) // onEdit = null: không đổi tên (dùng tên Play Games)
                }
            }
            Footer(global = state.source == LbSource.ONLINE)
        }
    }
}

@Composable
private fun Header(onBack: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().height(56.dp).padding(horizontal = GjSpace.md),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier.size(48.dp).clip(RoundedCornerShape(GjRadius.md)).background(GjPalette.Surface)
                .pointerInput(Unit) { detectTapGestures(onTap = { onBack() }) },
            contentAlignment = Alignment.Center,
        ) {
            GjIcon(GjIcons.Back, contentDescription = stringResource(R.string.leaderboard_back), tint = GjPalette.Text)
        }
        Text(
            stringResource(R.string.leaderboard_title),
            modifier = Modifier.weight(1f).padding(end = 48.dp),
            style = MaterialTheme.typography.headlineLarge, color = GjPalette.Text, textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun BoardTag() {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
        Box(
            Modifier.height(42.dp).clip(RoundedCornerShape(GjRadius.full))
                .background(Brush.verticalGradient(listOf(GjPalette.GravityShine, GjPalette.Gravity)))
                .padding(horizontal = 18.dp),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                stringResource(R.string.leaderboard_tag),
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold, fontSize = 16.sp),
                color = Color.White,
            )
        }
    }
}

@Composable
private fun SignInBanner(onSignIn: () -> Unit) {
    Box(Modifier.fillMaxWidth().padding(horizontal = GjSpace.lg, vertical = 8.dp)) {
        Row(
            Modifier.fillMaxWidth().clip(RoundedCornerShape(GjRadius.md))
                .background(Brush.verticalGradient(listOf(GjPalette.GravityShine, GjPalette.Gravity)))
                .pointerInput(Unit) { detectTapGestures(onTap = { onSignIn() }) }
                .padding(horizontal = GjSpace.md, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(GjSpace.sm),
        ) {
            GjIcon(GjIcons.Trophy, modifier = Modifier.size(18.dp), tint = Color.White)
            Text(
                stringResource(R.string.leaderboard_signin),
                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.ExtraBold),
                color = Color.White,
            )
        }
    }
}

@Composable
private fun PodiumBlock(top: List<LbEntry>) {
    Box(Modifier.fillMaxWidth().padding(horizontal = GjSpace.lg)) {
        // mây trôi ở vùng trời hai bên đỉnh bục (không bị bar che) — hiện rõ
        Cloud(Modifier.align(Alignment.TopStart).offset(x = (-2).dp, y = 58.dp).size(96.dp, 46.dp))
        Cloud(Modifier.align(Alignment.TopEnd).offset(x = 2.dp, y = 82.dp).size(74.dp, 40.dp))
        FilledStar(24.dp, Modifier.align(Alignment.TopStart).offset(x = 60.dp, y = 4.dp))
        FilledStar(26.dp, Modifier.align(Alignment.TopEnd).offset(x = (-60).dp, y = (-2).dp))
        Leaf(84.dp, flip = false, modifier = Modifier.align(Alignment.BottomStart).offset(x = (-30).dp, y = 8.dp))
        Leaf(84.dp, flip = true, modifier = Modifier.align(Alignment.BottomEnd).offset(x = 30.dp, y = 8.dp))

        Row(
            Modifier.fillMaxWidth().padding(top = 46.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.Bottom,
        ) {
            Podium(rank = 2, name = top[1].name, score = top[1].score, modifier = Modifier.weight(1f))
            Podium(rank = 1, name = top[0].name, score = top[0].score, modifier = Modifier.weight(1f))
            Podium(rank = 3, name = top[2].name, score = top[2].score, modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun Cloud(modifier: Modifier) {
    Canvas(modifier) {
        val w = size.width; val h = size.height
        val body = Color(0xFFCFE2F7) // xanh pastel rõ hơn #DCEBFB để nổi trên nền kem
        // đáy phẳng mềm
        drawRoundRect(body, topLeft = Offset(w * 0.08f, h * 0.5f), size = Size(w * 0.84f, h * 0.45f),
            cornerRadius = androidx.compose.ui.geometry.CornerRadius(h * 0.22f))
        // ba cụm bông tạo dáng mây
        drawCircle(body, radius = h * 0.4f, center = Offset(w * 0.28f, h * 0.58f))
        drawCircle(body, radius = h * 0.52f, center = Offset(w * 0.52f, h * 0.5f))
        drawCircle(body, radius = h * 0.38f, center = Offset(w * 0.74f, h * 0.6f))
        // highlight trắng phía trên
        drawCircle(Color.White.copy(alpha = 0.5f), radius = h * 0.2f, center = Offset(w * 0.44f, h * 0.4f))
    }
}

@Composable
private fun Footer(global: Boolean) {
    Row(
        Modifier.fillMaxWidth().padding(top = 2.dp, bottom = 10.dp),
        horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically,
    ) {
        GjIcon(GjIcons.Info, modifier = Modifier.size(15.dp), tint = GjPalette.TextMuted)
        Spacer(Modifier.size(6.dp))
        Text(
            stringResource(if (global) R.string.leaderboard_note_global else R.string.leaderboard_note),
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold), color = GjPalette.TextMuted,
        )
    }
}

/** Context → Activity (để lấy client PGS cần Activity). */
private fun Context.findActivity(): Activity? {
    var c: Context? = this
    while (c is ContextWrapper) { if (c is Activity) return c; c = c.baseContext }
    return null
}

@androidx.compose.ui.tooling.preview.Preview(name = "Leaderboard — 360×800", widthDp = 360, heightDp = 800)
@Composable
private fun LeaderboardPreview() {
    GravityJellyTheme {
        LeaderboardScreen(
            state = offlineState(best = 42360, playerName = "Bạn", configured = false, signedIn = false),
            onBack = {}, onSignIn = {},
        )
    }
}

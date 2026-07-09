package com.gravityjelly.app

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
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
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import com.gravityjelly.app.data.SettingsRepository
import com.gravityjelly.app.games.PlayGamesManager
import com.gravityjelly.app.ui.icons.GjIcon
import com.gravityjelly.app.ui.icons.GjIcons
import com.gravityjelly.app.ui.layout.GjScreenScaffold
import com.gravityjelly.app.ui.leaderboard.LbEntry
import com.gravityjelly.app.ui.leaderboard.LbSource
import com.gravityjelly.app.ui.leaderboard.LbYou
import com.gravityjelly.app.ui.leaderboard.LbRow
import com.gravityjelly.app.ui.leaderboard.LeaderboardUiState
import com.gravityjelly.app.ui.leaderboard.AutoResizeText
import com.gravityjelly.app.ui.leaderboard.OnlineLeaderboard
import com.gravityjelly.app.ui.leaderboard.YouRow
import com.gravityjelly.app.ui.leaderboard.formatScore
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
    repo: SettingsRepository,
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
        // Luôn có sẵn bản cache gần nhất để lùi về khi offline / chưa đăng nhập / tải lỗi.
        val cached = repo.loadLeaderboardCache()
        if (!games.configured || activity == null) {
            state = offlineState(cached, best, localName, games.configured, false); return
        }
        games.initialize()
        val signedIn = games.isAuthenticated(activity)
        if (!signedIn) { state = offlineState(cached, best, localName, true, false); return }
        // Đẩy best lên server TRƯỚC khi load — vá trường hợp lập best lúc chưa đăng nhập (submit
        // lúc đó no-op): giờ đã auth thì best mới thực sự lên bảng, load ngay dưới thấy được.
        games.submitScoreAwait(activity, best.toLong())
        val online = games.load(activity)
        if (online != null) {
            // Đã đăng nhập + tải OK → luôn ONLINE, KỂ CẢ top công khai còn rỗng (leaderboard mới,
            // điểm chưa lan truyền). Hạng cá nhân [online.you] vẫn hiện ngay khi PGS trả về — không
            // chờ top có người. Chỉ lưu cache khi có entry để không đè cache tốt bằng danh sách rỗng.
            if (online.entries.isNotEmpty()) repo.saveLeaderboardCache(online)
            // Điểm hiện tại: ưu tiên điểm server, nhưng không thấp hơn best cục bộ (vừa lập chưa kịp lan truyền).
            val myScore = maxOf(best, online.you?.score ?: 0)
            // Đồng bộ NGƯỢC: server giữ best cao hơn máy này (cài lại app, đổi máy, xoá dữ liệu) →
            // ghi lại vào DataStore. `updateBest` tự chặn ghi lùi (chỉ nhận điểm lớn hơn), nên gọi
            // vô hại; và vì chỉ gọi khi lớn hơn thật sự, vòng refresh kế tiếp sẽ đứng yên.
            if (myScore > best) repo.updateBest(myScore)
            // Hạng: CHỈ lấy hạng server. Trước đây chỗ này tự tính "số người điểm cao hơn + 1" khi
            // server trả rank=0 — sai: rank=0 KHÔNG phải "chưa lan truyền" mà là "không được xếp
            // hạng" (hồ sơ Play Games đang ẩn ⇒ bị loại khỏi COLLECTION_PUBLIC). Hậu quả: app báo
            // "bạn hạng 1" trong khi bảng công khai không hề có tên. Không rõ hạng → 0 → YouRow hiện "—".
            val youRank = online.you?.rank?.takeIf { it > 0 } ?: 0
            state = LeaderboardUiState(
                source = LbSource.ONLINE,
                top = online.entries.take(3),
                rest = online.entries.drop(3),
                you = LbYou(youRank, online.you?.name?.ifBlank { localName } ?: localName, myScore),
                configured = true, signedIn = true,
                // Server có điểm (you != null) mà không cho hạng ⇒ hồ sơ đang ẩn, mách nước cho người chơi.
                profileHidden = online.you != null && youRank == 0,
            )
        } else {
            // Đã đăng nhập nhưng tải lỗi/không mạng → hiện bản cache đã đồng bộ.
            state = offlineState(cached, best, localName, true, true)
        }
    }

    LaunchedEffect(best, playerName) { refresh() }

    LeaderboardScreen(
        state = state,
        onBack = onBack,
        onSignIn = { scope.launch { if (activity != null && games.signIn(activity)) refresh() } },
        modifier = modifier,
        onOpenPlayGames = { context.openPlayGames() },
    )
}

/** Mở app Play Games để người chơi bật hiển thị hồ sơ. Không cài / không mở được → bỏ qua im lặng. */
private fun Context.openPlayGames() {
    val intent = packageManager.getLaunchIntentForPackage("com.google.android.play.games")
        ?: return
    runCatching { startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) }
}

/** Render thuần theo [state] (đã tách khỏi việc tải để test/preview được). */
@Composable
fun LeaderboardScreen(
    state: LeaderboardUiState,
    onBack: () -> Unit,
    onSignIn: () -> Unit,
    modifier: Modifier = Modifier,
    onOpenPlayGames: () -> Unit = {},
) {
    GjScreenScaffold(modifier = modifier, applyGutter = false, contentAlignment = Alignment.TopStart) {
        Column(Modifier.fillMaxSize()) {
            if (state.source == LbSource.LOADING) {
                Header(onBack)
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(
                        stringResource(R.string.leaderboard_loading),
                        style = MaterialTheme.typography.bodyLarge, color = GjPalette.TextMuted,
                    )
                }
                return@Column
            }

            // Top-3 = tranh PNG "leaderboard_podium_bg" (bục kẹo vàng/bạc/đồng vẽ sẵn); tên + điểm
            // overlay vào 3 ô khung trống. Header phủ lên vùng trời của tranh (leaderboard-screen.jsx).
            val podiumReady = state.top.size == 3
            if (podiumReady) {
                ArtPodium(state.top, onBack)
            } else {
                Header(onBack)
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
            if (state.profileHidden) ProfileHiddenHint(onOpenPlayGames)
            Footer(state)
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
            // textShadow trắng nhẹ vì tiêu đề phủ lên vùng trời của tranh bục (leaderboard-screen.jsx)
            style = MaterialTheme.typography.headlineLarge.copy(
                shadow = Shadow(color = Color.White.copy(alpha = 0.7f), offset = Offset(0f, 1f), blurRadius = 0f),
            ),
            color = GjPalette.Text, textAlign = TextAlign.Center,
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

// ── bục Top-3 = tranh PNG dựng sẵn + tên/điểm overlay ────────────────────────────
// Nguồn: leaderboard-screen.jsx (bản mới) + 06-svg-assets/backgrounds/leaderboard-podium-bg.png
// (941×2091). Tranh vẽ đầy đủ bục vàng/bạc/đồng + huy hiệu 1/2/3; ta chỉ overlay tên + điểm
// vào 3 ô khung trống. Toạ độ là % của ẢNH nên bám mọi bề rộng màn hình.
// Vùng dành chỗ = tới đáy bục ở ảnh y=880 → aspectRatio 941/880 (spacer trong design).
@Composable
private fun ArtPodium(top: List<LbEntry>, onBack: () -> Unit) {
    BoxWithConstraints(Modifier.fillMaxWidth().aspectRatio(941f / 880f).clipToBounds()) {
        val w = maxWidth
        val imgH = w * (2091f / 941f) // chiều cao ảnh thật ở bề rộng này (phần dưới đáy bục bị cắt)
        Image(
            painter = painterResource(R.drawable.leaderboard_podium_bg),
            contentDescription = null,
            // Crop + TopCenter: ảnh phủ đủ bề rộng, neo mép trên, phần dưới đáy bục bị cắt (Box
            // aspectRatio 941/880). Không bóp dẹt; 1px-ảnh = w/941 nên toạ-độ-% khớp thẳng.
            modifier = Modifier.fillMaxSize(),
            alignment = Alignment.TopCenter,
            contentScale = ContentScale.Crop,
        )
        // 3 ô khung (left/top/width/height = % ảnh, khớp leaderboard-screen.jsx FrameSlot)
        FrameSlot(1, top[0].name, top[0].score, w * 0.356f, imgH * 0.135f, w * 0.292f, imgH * 0.155f)
        FrameSlot(2, top[1].name, top[1].score, w * 0.058f, imgH * 0.215f, w * 0.250f, imgH * 0.105f)
        FrameSlot(3, top[2].name, top[2].score, w * 0.707f, imgH * 0.230f, w * 0.228f, imgH * 0.100f)
        // header phủ lên vùng trời của tranh
        Box(Modifier.fillMaxWidth().align(Alignment.TopStart)) { Header(onBack) }
    }
}

// tên + điểm + nhãn "ĐIỂM" đặt giữa một ô khung trống của tranh (màu mực khớp tông khung).
@Composable
private fun FrameSlot(rank: Int, name: String, score: Int, x: Dp, y: Dp, w: Dp, h: Dp) {
    val ink = when (rank) {
        1 -> Color(0xFFA5731A) // vàng
        2 -> Color(0xFF5A65B6) // xanh tím
        else -> Color(0xFFC05F72) // hồng
    }
    val big = rank == 1
    Column(
        Modifier.offset(x = x, y = y).size(w, h).padding(horizontal = 3.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(if (big) 3.dp else 1.dp, Alignment.CenterVertically),
    ) {
        // Tên: TỰ THU NHỎ cỡ chữ cho vừa bề rộng khung (không cắt) — hạ dần tới sàn min rồi mới
        // ellipsis (chỉ với tên cực dài). Play Games tối đa ~20 ký tự → hầu hết hiện đủ.
        AutoResizeText(
            text = name, color = ink,
            baseStyle = MaterialTheme.typography.bodyLarge.copy(
                fontWeight = FontWeight.ExtraBold, textAlign = TextAlign.Center,
            ),
            maxFontSize = if (big) 16.sp else 13.sp,
            minFontSize = if (big) 9.sp else 8.sp,
            modifier = Modifier.fillMaxWidth(),
        )
        Text(
            formatScore(score), color = ink,
            style = MaterialTheme.typography.titleLarge.copy(
                fontWeight = FontWeight.ExtraBold,
                fontSize = if (big) 24.sp else 18.sp, lineHeight = if (big) 25.sp else 19.sp,
            ),
        )
        Text(
            stringResource(R.string.leaderboard_points), color = ink.copy(alpha = 0.75f),
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.ExtraBold,
                fontSize = if (big) 11.sp else 10.sp, letterSpacing = 0.06.em,
            ),
        )
    }
}

/**
 * Điểm đã lên server nhưng hồ sơ Play Games đang ẩn → người chơi không có hạng công khai.
 * Nói thẳng nguyên nhân + mở app Play Games để họ tự bật hiển thị hồ sơ.
 */
@Composable
private fun ProfileHiddenHint(onOpenPlayGames: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().padding(horizontal = GjSpace.lg, vertical = 2.dp)
            .clip(RoundedCornerShape(GjRadius.md))
            .pointerInput(Unit) { detectTapGestures(onTap = { onOpenPlayGames() }) }
            .padding(horizontal = GjSpace.sm, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
    ) {
        GjIcon(GjIcons.Info, modifier = Modifier.size(15.dp), tint = GjPalette.PrimaryEdge)
        Spacer(Modifier.size(6.dp))
        Text(
            stringResource(R.string.leaderboard_profile_hidden),
            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
            color = GjPalette.PrimaryEdge, textAlign = TextAlign.Center,
        )
    }
}

@Composable
private fun Footer(state: LeaderboardUiState) {
    val hasEntries = state.top.isNotEmpty() || state.rest.isNotEmpty()
    val noteRes = when {
        state.source == LbSource.ONLINE -> R.string.leaderboard_note_global   // đang trực tuyến
        hasEntries -> R.string.leaderboard_note                                // cache toàn cầu, đang offline
        else -> R.string.leaderboard_note_empty                                // chưa từng đồng bộ
    }
    Row(
        Modifier.fillMaxWidth().padding(top = 2.dp, bottom = 10.dp),
        horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically,
    ) {
        GjIcon(GjIcons.Info, modifier = Modifier.size(15.dp), tint = GjPalette.TextMuted)
        Spacer(Modifier.size(6.dp))
        Text(
            stringResource(noteRes),
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
    // Dữ liệu mẫu CHỈ để xem preview (không phải dữ liệu ship) — mô phỏng một bản cache PGS.
    val sample = OnlineLeaderboard(
        entries = listOf(
            LbEntry("Mai", 214980), LbEntry("Tú", 198450), LbEntry("Khoa", 187210),
            LbEntry("Linh", 176040), LbEntry("Bảo", 168920), LbEntry("Hà", 159300),
        ),
        you = LbYou(9, "Bạn", 42360),
    )
    GravityJellyTheme {
        LeaderboardScreen(
            state = offlineState(sample, best = 42360, playerName = "Bạn", configured = false, signedIn = false),
            onBack = {}, onSignIn = {},
        )
    }
}

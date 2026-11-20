import os
from pathlib import Path
from fasthtml.common import FastHTML, serve
from starlette.responses import FileResponse, Response

BASE_DIR = Path(__file__).resolve().parent
ALLOWED_ASSET_EXTS = {
    ".html",
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".svg",
    ".ico",
    ".mp4",
    ".webm",
}
EXCLUDED_FILES = {"clone_ads.js"}

# Use a direct top-level `app = ...` assignment (so Vercel's static AST entrypoint check
# detects `app`) and keep sessions disabled in memory so `.sesskey` is never written.
app = FastHTML(
    default_hdrs=False,
    sess_cls=None,
    secret_key=os.getenv("SESSION_SECRET") or os.urandom(32).hex(),
)
rt = app.route


def _resolve_public_asset(relative_path: str) -> Path | None:
    """Resolve a request path to an allowlisted static file inside BASE_DIR."""
    clean_path = relative_path.lstrip("/")
    if not clean_path:
        return None

    rel = Path(clean_path)
    if any(part.startswith(".") for part in rel.parts):
        return None

    candidate = (BASE_DIR / rel).resolve()
    if not candidate.is_relative_to(BASE_DIR):
        return None
    if candidate.relative_to(BASE_DIR).as_posix() in EXCLUDED_FILES:
        return None
    if candidate.suffix.lower() not in ALLOWED_ASSET_EXTS:
        return None
    if not candidate.is_file():
        return None
    return candidate


@rt("/")
def get_index():
    """Serve the ImpactFrames Ad Showcase landing page."""
    return FileResponse(BASE_DIR / "index.html")


@rt("/{file_path:path}")
def get_asset(file_path: str):
    """Serve allowlisted static assets (CSS, JS, images, videos, cloned ad HTML)."""
    asset = _resolve_public_asset(file_path)
    if asset is None:
        return Response(status_code=404)
    return FileResponse(asset)


if __name__ == "__main__":
    serve()

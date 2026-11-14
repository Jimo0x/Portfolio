"""Images de partage (Open Graph) en pixel art, 1200 x 630.

Chaque image est dessinée sur une petite toile de 300 x 158 pixels, puis agrandie
quatre fois sans lissage : chaque « pixel » devient un carré de 4 x 4, comme un écran
d'époque. Des lignes de balayage sont ajoutées après l'agrandissement.

Lancer : npm run og   (ou python3 scripts/og.py)
Sortie : public/og/*.png et public/icons/*.png
"""

import json
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
ICONS = ROOT / "public" / "icons"
FONTS = Path("/usr/share/fonts/truetype/dejavu")

W, H, S = 300, 158, 4  # toile logique et facteur d'agrandissement
BG = (5, 5, 5)
GRID = (26, 22, 22)
LINE = (66, 60, 60)
INK = (236, 231, 225)
MUTED = (128, 122, 117)
RED = (227, 18, 45)
DEEP = (92, 8, 20)

# ------------------------------------------------------------------ données du site
# On lit src/data.js avec node pour garder une seule source de vérité.
DATA = json.loads(subprocess.check_output(
    ["node", "--input-type=module", "-e",
     "import * as d from './src/data.js'; console.log(JSON.stringify({p: d.PROJECTS, k: d.KINDS, s: d.SERVICES}))"],
    cwd=ROOT, text=True))
PROJECTS, KINDS = DATA["p"], DATA["k"]

# ------------------------------------------------------------------ sprites 16 px
# . transparent   I encre   R rouge   M gris   D fond (pour découper)
SPRITES = {
    "cyber": """
....RRRRRRRR....
..RRRRRRRRRRRR..
.RR..........RR.
.R.....II.....R.
.R....I..I....R.
.R...I....I...R.
.R...I....I...R.
.R..IIIIIIII..R.
.R..IIIIIIII..R.
.R..IIIDDIII..R.
.RR.IIIDDIII.RR.
..R..IIIIII..R..
..RR........RR..
...RR......RR...
....RRR..RRR....
......RRRR......""",
    "web": """
IIIIIIIIIIIIIIII
IR.M.M.........I
IIIIIIIIIIIIIIII
I..............I
I.RRRRRRR......I
I..............I
I.MMMMMMMMMMM..I
I.MMMMMMMM.....I
I..............I
I.IIII..IIII...I
I.I..I..I..I...I
I.IIII..IIII...I
I..............I
IIIIIIIIIIIIIIII""",
    "jeu": """
...IIII....IIII...
..IIIIIIIIIIIIII..
.IIIIIIIIIIIIIIII.
IIIDIIIIIIIIIIRIII
IIDDDIIIIIIIIRIRII
IIIDIIIDDIDDIIRIII
IIIIIIIIIIIIIIIIII
IIIIIII....IIIIIII
.IIIII......IIIII.
..III........III..""",
    "mail": """
IIIIIIIIIIIIIIII
II............II
I.I..........I.I
I..I........I..I
I...I......I...I
I....I....I....I
I.....IRRI.....I
I......RR......I
I..............I
IIIIIIIIIIIIIIII""",
    "term": """
IIIIIIIIIIIIIIII
IRMM...........I
IIIIIIIIIIIIIIII
I..............I
I.R............I
I..R...........I
I...R..........I
I..R...........I
I.R...RRRRR....I
I..............I
IIIIIIIIIIIIIIII""",
}
COLORS = {"I": INK, "R": RED, "M": MUTED, "D": BG}


def sprite(d, name, x, y, scale, shadow=True):
    rows = [r for r in SPRITES[name].strip("\n").split("\n")]
    for pass_ in ("shadow", "main") if shadow else ("main",):
        for j, row in enumerate(rows):
            for i, ch in enumerate(row):
                if ch == ".":
                    continue
                if pass_ == "shadow":
                    if ch == "D":
                        continue
                    d.rectangle([x + i * scale + scale, y + j * scale + scale,
                                 x + i * scale + 2 * scale - 1, y + j * scale + 2 * scale - 1], fill=DEEP)
                else:
                    d.rectangle([x + i * scale, y + j * scale,
                                 x + i * scale + scale - 1, y + j * scale + scale - 1], fill=COLORS[ch])
    return len(rows[0]) * scale, len(rows) * scale


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


MONO = font("DejaVuSansMono.ttf", 9)
MONO_B = font("DejaVuSansMono-Bold.ttf", 9)
SMALL = font("DejaVuSansMono.ttf", 9)
BODY = font("DejaVuSans.ttf", 9)


def wrap(text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if f.getlength(t) <= width:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def base():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.fontmode = "1"  # pas d'anticrénelage : du vrai pixel
    # trame de points
    for y in range(4, H, 6):
        for x in range(4, W, 6):
            d.point((x, y), fill=GRID)
    # coins de visée
    for (x, y, sx, sy) in ((6, 6, 1, 1), (W - 7, 6, -1, 1), (6, H - 7, 1, -1), (W - 7, H - 7, -1, -1)):
        d.line([x, y, x + 7 * sx, y], fill=RED)
        d.line([x, y, x, y + 7 * sy], fill=RED)
    # en-tête : invite + adresse du site
    x = 16
    for part, col, f in ((">", RED, MONO_B), (" julio", INK, MONO), ("_", RED, MONO_B), ("dahou", INK, MONO)):
        d.text((x, 12), part, font=f, fill=col)
        x += f.getlength(part)
    url = "jimoox.vercel.app"
    d.text((W - 16 - SMALL.getlength(url), 12), url, font=SMALL, fill=MUTED)
    # ligne pointillée
    for xx in range(16, W - 16, 3):
        d.point((xx, 26), fill=LINE)
    return img, d


def dither_glow(d, cx, cy, radius):
    """Halo rouge en tramage : plus dense au centre, sans aucun dégradé lisse."""
    for y in range(max(28, cy - radius), min(H - 10, cy + radius)):
        for x in range(cx - radius, cx + radius):
            r = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5 / radius
            if r >= 1:
                continue
            bayer = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]][y % 4][x % 4] / 16
            if bayer < (1 - r) ** 2 * 0.55:
                d.point((x, y), fill=DEEP if bayer > 0.12 else (150, 12, 30))


def title_block(d, path, line1, line2, desc, width=196):
    """Chemin, titre sur deux lignes (la seconde sous une barre caviardée) et description."""
    d.text((16, 36), path, font=MONO, fill=RED)
    size = 17
    while size > 10:
        f = font("DejaVuSans-Bold.ttf", size)
        if f.getlength(line1) <= width and f.getlength(line2) + 6 <= width:
            break
        size -= 1
    y = 52
    d.text((16, y), line1, font=f, fill=INK)
    y += size + 5
    if line2:
        w = f.getlength(line2)
        d.rectangle([14, y - 1, 16 + w + 3, y + size + 2], fill=RED)
        d.text((17, y), line2, font=f, fill=(255, 255, 255))
        y += size + 9
    else:
        y += 4
    lines = wrap(desc, BODY, width)
    room = max(1, (H - 34 - y) // 12)  # jamais sur les étiquettes du bas
    if len(lines) > room:
        lines = lines[:room]
        while BODY.getlength(lines[-1] + "…") > width:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    for ln in lines:
        d.text((16, y), ln, font=BODY, fill=MUTED)
        y += 12
    return y


def chips(d, items, y=H - 29):
    x = 16
    for t in items:
        w = SMALL.getlength(t) + 8
        if x + w > 214:
            break
        d.rectangle([x, y, x + w, y + 13], outline=LINE)
        d.text((x + 4, y + 2), t, font=SMALL, fill=INK)
        x += w + 4


def network(d, cx, cy, rx, ry, labels=False):
    import math
    seed = [7]

    def rnd():
        seed[0] = (seed[0] * 16807) % 2147483647
        return seed[0] / 2147483647

    pts = []
    for i, p in enumerate(PROJECTS):
        a = -math.pi / 2 + i / len(PROJECTS) * math.pi * 2 + 0.25
        j = 0.85 + rnd() * 0.25
        pts.append((round(cx + math.cos(a) * rx * j), round(cy + math.sin(a) * ry * j), p))
    # hôtes de décor reliés à leurs voisins
    decor = [(round(cx - rx - 8 + rnd() * (2 * rx + 16)), round(cy - ry - 6 + rnd() * (2 * ry + 12))) for _ in range(14)]
    for (x, y) in decor:
        near = sorted(pts, key=lambda q: (q[0] - x) ** 2 + (q[1] - y) ** 2)[0]
        for k in range(0, 100, 2):  # pointillés
            t = k / 100
            if k % 6 < 2:
                d.point((round(x + (near[0] - x) * t), round(y + (near[1] - y) * t)), fill=LINE)
    for (x, y, p) in pts:
        d.line([cx, cy, x, y], fill=LINE)
    # paquets en transit
    for (x, y, p), t in zip(pts[::2], (0.35, 0.6, 0.5, 0.75)):
        px, py = round(cx + (x - cx) * t), round(cy + (y - cy) * t)
        d.rectangle([px - 1, py - 1, px, py], fill=RED)
    for (x, y) in decor:
        d.point((x, y), fill=MUTED)
    for (x, y, p) in pts:
        col = INK if p["kind"] == "web" else RED
        if p["kind"] == "jeu":
            d.rectangle([x - 3, y - 3, x + 3, y + 3], fill=BG, outline=col)
        else:
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=BG, outline=col)
        if labels:
            t = p["id"]
            lx = x + 6 if x >= cx else x - 6 - SMALL.getlength(t)
            d.text((lx, y - 4), t, font=SMALL, fill=INK)
    # centre
    d.rectangle([cx - 3, cy - 3, cx + 3, cy + 3], fill=RED)
    d.rectangle([cx - 6, cy - 6, cx + 6, cy + 6], outline=DEEP)
    d.text((cx - SMALL.getlength("julio") / 2, cy + 9), "julio", font=SMALL, fill=RED)


def finish(img, name):
    big = img.resize((W * S, H * S), Image.NEAREST).crop((0, 0, 1200, 630))
    # lignes de balayage : la dernière rangée de chaque pixel est assombrie
    px = big.load()
    for y in range(S - 1, 630, S):
        for x in range(1200):
            r, g, b = px[x, y]
            px[x, y] = (r * 3 // 4, g * 3 // 4, b * 3 // 4)
    OUT.mkdir(parents=True, exist_ok=True)
    big = big.quantize(colors=32, method=Image.Quantize.MEDIANCUT)
    big.save(OUT / f"{name}.png", optimize=True)
    print("og/" + name + ".png")


# ------------------------------------------------------------------ pages
def page(name, path, line1, line2, desc, tags, art):
    img, d = base()
    art(img, d)
    title_block(d, path, line1, line2, desc)
    chips(d, tags)
    finish(img, name)


def art_network(img, d):
    dither_glow(d, 254, 88, 46)
    network(d, 254, 86, 34, 40)


def art_sprite(name, scale=4):
    def draw(img, d):
        dither_glow(d, 254, 88, 46)
        rows = SPRITES[name].strip("\n").split("\n")
        w, h = len(rows[0]) * scale, len(rows) * scale
        sprite(d, name, 254 - w // 2, 86 - h // 2, scale)
    return draw


def art_grid(img, d):
    dither_glow(d, 254, 88, 48)
    icons = {"cyber": "cyber", "web": "web", "jeu": "jeu"}
    for i, p in enumerate(PROJECTS):
        col, row = i % 3, i // 3
        x, y = 224 + col * 24, 56 + row * 24
        sprite(d, icons[p["kind"]], x, y, 1, shadow=False)


n = len(PROJECTS)
count = lambda k: sum(1 for p in PROJECTS if p["kind"] == k)

page("accueil", "~/accueil", "Je casse des systèmes", "pour mieux les protéger.",
     "Spécialiste cybersécurité et développeur à Cotonou. Pentest, analyse SOC, C, Python, web.",
     ["pentest", "python", "c", "web", "remote"], art_network)
page("projets", "~/projets", "Ce que", "j'ai construit.",
     f"{n} projets : {count('cyber')} outils de cybersécurité, {count('web')} applications web et un jeu de hacking jouable.",
     ["cybersécurité", "web", "jeu vidéo"], art_grid)
page("services", "~/services", "Ce que je peux", "faire pour toi.",
     "Test d'intrusion, revue de sécurité du code, développement web sécurisé et outils sur mesure.",
     ["pentest", "audit", "dev web", "outils"], art_sprite("cyber"))
page("a-propos", "~/a-propos", "Derrière", "le terminal.",
     "Étudiant en cybersécurité à ESGIS Bénin et Epitech Bénin. Parcours, formation et compétences.",
     ["c", "python", "réseaux", "soc"], art_sprite("term"))
page("contact", "~/contact", "Établissons", "la connexion.",
     "Un audit, un projet, un stage : écris-moi, je réponds vite. Cotonou, ouvert au remote.",
     ["email", "github", "remote"], art_sprite("mail"))

for i, p in enumerate(PROJECTS):
    name = p["name"]
    # nom sur la première ligne, domaine caviardé sur la seconde
    page(f"projet-{p['id']}", f"~/projets/{p['id']}", name, KINDS[p["kind"]].lower(),
         p["tagline"], [s.lower() for s in p["stack"][:4]],
         art_sprite(p["kind"], 4 if p["kind"] != "jeu" else 3))


# ------------------------------------------------------------------ icônes
def icon(size, name):
    g = 16
    img = Image.new("RGB", (g, g), BG)
    d = ImageDraw.Draw(img)
    # chevron > et soulignement rouge, comme la favicon SVG
    for k in range(4):
        d.point((4 + k, 5 + k), fill=INK); d.point((4 + k, 11 - k), fill=INK)
        d.point((5 + k, 5 + k), fill=INK); d.point((5 + k, 11 - k), fill=INK)
    d.rectangle([8, 10, 12, 11], fill=RED)
    ICONS.mkdir(parents=True, exist_ok=True)
    img.resize((size, size), Image.NEAREST).save(ICONS / name, optimize=True)
    print("icons/" + name)


icon(32, "favicon-32.png")
icon(180, "apple-touch-icon.png")

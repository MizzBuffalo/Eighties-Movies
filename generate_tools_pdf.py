#!/usr/bin/env python3
"""Generate TOOLS_AND_CAPABILITIES.pdf using Playwright HTML-to-PDF."""

import subprocess, sys

HTML_CONTENT = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: letter; margin: 0.75in; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    color: #1a1a2e;
    line-height: 1.55;
  }
  h1 {
    font-size: 22pt;
    color: #0f0f23;
    border-bottom: 3px solid #e8527a;
    padding-bottom: 8px;
    margin-bottom: 6px;
  }
  .subtitle { font-size: 10pt; color: #666; margin-bottom: 24px; }
  h2 {
    font-size: 14pt;
    color: #e8527a;
    margin: 22px 0 8px;
    padding: 4px 10px;
    background: #fdf0f4;
    border-left: 4px solid #e8527a;
  }
  h3 { font-size: 11pt; color: #333; margin: 12px 0 4px; }
  p, li { margin-bottom: 4px; }
  ul { padding-left: 20px; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 14px;
    font-size: 9.5pt;
  }
  th {
    background: #1a1a2e;
    color: #fff;
    padding: 6px 8px;
    text-align: left;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td { padding: 5px 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top; }
  tr:nth-child(even) td { background: #f9f9fb; }
  .badge {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 10px;
    font-size: 8pt;
    font-weight: bold;
  }
  .installed { background: #d4edda; color: #155724; }
  .missing { background: #f8d7da; color: #721c24; }
  .available { background: #fff3cd; color: #856404; }
  .best { background: #d4edda; color: #155724; border: 1px solid #28a745; }
  .rec-box {
    background: #f0f7ff;
    border: 2px solid #2980b9;
    border-radius: 8px;
    padding: 14px 18px;
    margin: 12px 0;
  }
  .rec-box h3 { color: #2980b9; margin: 0 0 6px; }
  .warn-box {
    background: #fff8f0;
    border: 2px solid #e67e22;
    border-radius: 8px;
    padding: 14px 18px;
    margin: 12px 0;
  }
  .warn-box h3 { color: #e67e22; margin: 0 0 6px; }
  .pagebreak { page-break-before: always; }
  code { background: #f0f0f0; padding: 1px 4px; border-radius: 3px; font-size: 9pt; }
</style>
</head>
<body>

<h1>Tools &amp; Capabilities Reference</h1>
<p class="subtitle">Amy's 80s Movie Vault &mdash; Environment Audit &bull; Generated 2026-03-14</p>

<!-- ============================================================ -->
<h2>1. Installed Plugins &amp; Skills</h2>

<p>Claude Code skills are prompt-driven capabilities activated via slash commands or automatic triggers. The following are currently registered in this session:</p>

<table>
<tr><th>Skill</th><th>Trigger</th><th>What It Does</th><th>Project Relevance</th></tr>
<tr>
  <td><strong>keybindings-help</strong></td>
  <td>User asks to rebind keys</td>
  <td>Customizes Claude Code keyboard shortcuts and <code>keybindings.json</code></td>
  <td>Low &mdash; workflow convenience only</td>
</tr>
<tr>
  <td><strong>simplify</strong></td>
  <td>Manual invocation</td>
  <td>Reviews changed code for quality, reuse, and efficiency; auto-fixes issues</td>
  <td><strong>High</strong> &mdash; use after building HTML/CSS/JS designs to clean up</td>
</tr>
<tr>
  <td><strong>loop</strong></td>
  <td><code>/loop 5m /foo</code></td>
  <td>Runs a prompt or slash command on a recurring interval</td>
  <td>Low &mdash; useful for polling deploys</td>
</tr>
<tr>
  <td><strong>claude-api</strong></td>
  <td>Code imports <code>anthropic</code> SDK</td>
  <td>Guides building apps with the Claude API / Anthropic SDK</td>
  <td>Medium &mdash; if AI features are added to the vault</td>
</tr>
<tr>
  <td><strong>session-start-hook</strong></td>
  <td>User asks about startup hooks</td>
  <td>Creates SessionStart hooks for Claude Code web sessions</td>
  <td>Medium &mdash; CI/test automation setup</td>
</tr>
</table>

<p><strong>Not installed:</strong> There are no custom plugins like <em>canvas-design</em>, <em>frontend-design</em>, or <em>theme-factory</em> in this environment. These do not exist as standard Claude Code skills &mdash; they would need to be custom-built or sourced from third-party MCP servers.</p>

<!-- ============================================================ -->
<h2>2. Installed Tools &amp; Libraries</h2>

<h3>Runtime Versions</h3>
<table>
<tr><th>Runtime</th><th>Version</th><th>Location</th></tr>
<tr><td>Node.js</td><td>v22.x</td><td>/opt/node22</td></tr>
<tr><td>Python</td><td>3.12.x</td><td>System</td></tr>
<tr><td>npm</td><td>10.9.4</td><td>Global</td></tr>
<tr><td>pnpm</td><td>10.29.3</td><td>Global</td></tr>
<tr><td>yarn</td><td>1.22.22</td><td>Global</td></tr>
</table>

<h3>Global npm Packages</h3>
<table>
<tr><th>Package</th><th>Version</th><th>Best At</th></tr>
<tr><td>playwright</td><td>1.56.1</td><td><span class="badge installed">INSTALLED</span> Browser automation, screenshots, PDF generation via headless Chromium</td></tr>
<tr><td>typescript</td><td>5.9.3</td><td>Type-safe JS development</td></tr>
<tr><td>eslint</td><td>10.0.0</td><td>JS/TS linting</td></tr>
<tr><td>prettier</td><td>3.8.1</td><td>Code formatting</td></tr>
<tr><td>http-server</td><td>14.1.1</td><td>Quick static file serving for previews</td></tr>
<tr><td>serve</td><td>14.2.5</td><td>Production-grade static server</td></tr>
<tr><td>ts-node</td><td>10.9.2</td><td>Run TypeScript directly</td></tr>
<tr><td>nodemon</td><td>3.1.11</td><td>Auto-restart on file changes</td></tr>
</table>

<h3>Python Packages (PDF-relevant)</h3>
<table>
<tr><th>Package</th><th>Version</th><th>Status</th><th>Best At</th></tr>
<tr><td>playwright (Python)</td><td>1.58.0</td><td><span class="badge installed">INSTALLED</span></td><td>HTML &rarr; PDF via headless Chromium with full CSS support</td></tr>
<tr><td>fpdf2</td><td>2.8.7</td><td><span class="badge installed">INSTALLED</span></td><td>Direct PDF creation &mdash; precise coordinate control, no browser needed</td></tr>
<tr><td>Pillow</td><td>12.1.1</td><td><span class="badge installed">INSTALLED</span></td><td>Image manipulation, resizing, compositing</td></tr>
<tr><td>fonttools</td><td>4.62.1</td><td><span class="badge installed">INSTALLED</span></td><td>Font inspection and manipulation</td></tr>
<tr><td>Jinja2</td><td>3.1.6</td><td><span class="badge installed">INSTALLED</span></td><td>HTML templating for dynamic card generation</td></tr>
<tr><td>PyYAML</td><td>6.0.1</td><td><span class="badge installed">INSTALLED</span></td><td>Config/data files</td></tr>
</table>

<h3>Browsers (Playwright-managed)</h3>
<table>
<tr><th>Browser</th><th>Status</th><th>Path</th></tr>
<tr><td>Chromium 1194</td><td><span class="badge installed">CACHED</span></td><td>/root/.cache/ms-playwright/chromium-1194/</td></tr>
<tr><td>Chromium Headless Shell</td><td><span class="badge installed">CACHED</span></td><td>/root/.cache/ms-playwright/chromium_headless_shell-1194/</td></tr>
<tr><td>ffmpeg</td><td><span class="badge installed">CACHED</span></td><td>/root/.cache/ms-playwright/ffmpeg-1011/</td></tr>
</table>

<div class="pagebreak"></div>

<!-- ============================================================ -->
<h2>3. MCP Servers</h2>

<h3>Currently Connected</h3>
<table>
<tr><th>Server</th><th>Tools Provided</th><th>Status</th></tr>
<tr>
  <td><strong>puppeteer</strong></td>
  <td>puppeteer_navigate, puppeteer_screenshot, puppeteer_click, puppeteer_fill, puppeteer_select, puppeteer_hover, puppeteer_evaluate</td>
  <td><span class="badge installed">CONNECTED</span> &mdash; but browser caching issues observed; Playwright Python is more reliable in this env</td>
</tr>
</table>

<h3>Recommended MCP Servers to Add</h3>
<table>
<tr><th>Server</th><th>What It Would Enable</th><th>Priority</th></tr>
<tr><td><strong>@anthropic/mcp-filesystem</strong></td><td>Structured file operations, bulk read/write</td><td>Low</td></tr>
<tr><td><strong>@anthropic/mcp-github</strong></td><td>Rich GitHub integration (PRs, issues, actions)</td><td>Medium</td></tr>
<tr><td><strong>Custom PDF-preview server</strong></td><td>Real-time PDF rendering &amp; visual QA in conversation</td><td>High</td></tr>
<tr><td><strong>TMDB API server</strong></td><td>Movie poster URLs, metadata, ratings for the vault</td><td>High</td></tr>
<tr><td><strong>Figma MCP server</strong></td><td>Import design tokens, export frames as assets</td><td>Medium</td></tr>
</table>

<!-- ============================================================ -->
<h2>4. Available APIs &amp; External Services</h2>

<table>
<tr><th>Service</th><th>Use Case</th><th>Access</th></tr>
<tr><td><strong>TMDB (The Movie Database)</strong></td><td>Movie posters, metadata, plot summaries, ratings</td><td>Free API key required &mdash; <code>api.themoviedb.org/3</code></td></tr>
<tr><td><strong>OMDb API</strong></td><td>IMDb data, poster URLs, ratings</td><td>Free tier available</td></tr>
<tr><td><strong>Google Fonts API</strong></td><td>Web fonts (already used in designs)</td><td><span class="badge installed">IN USE</span></td></tr>
<tr><td><strong>GitHub Pages</strong></td><td>Free static hosting for the vault</td><td>Via <code>gh-pages</code> branch</td></tr>
<tr><td><strong>Cloudflare Pages</strong></td><td>Fast edge-deployed static hosting</td><td>Free tier available</td></tr>
</table>

<!-- ============================================================ -->
<h2>5. PDF Generation Methodologies Compared</h2>

<p>For our use case: <strong>7&times;5 inch landscape cards</strong> with colored boxes, custom fonts, and image placeholders.</p>

<table>
<tr><th>Method</th><th>Approach</th><th>CSS Support</th><th>Precision</th><th>Complexity</th><th>Print Quality</th><th>Verdict</th></tr>
<tr>
  <td><strong>HTML + Playwright</strong></td>
  <td>Render HTML in headless Chrome, export PDF</td>
  <td>Full (Flexbox, Grid, gradients, shadows, web fonts)</td>
  <td>High &mdash; Chrome rendering engine</td>
  <td>Low &mdash; design in HTML/CSS, one-line PDF export</td>
  <td>Excellent &mdash; 300dpi capable</td>
  <td><span class="badge best">BEST FIT</span></td>
</tr>
<tr>
  <td><strong>HTML + WeasyPrint</strong></td>
  <td>Python lib converts HTML/CSS directly to PDF</td>
  <td>Good (CSS 2.1 + some CSS 3; no Flexbox/Grid)</td>
  <td>High</td>
  <td>Low</td>
  <td>Excellent</td>
  <td><span class="badge missing">NOT INSTALLED</span></td>
</tr>
<tr>
  <td><strong>fpdf2</strong></td>
  <td>Direct PDF construction in Python &mdash; coordinate-based</td>
  <td>None &mdash; manual positioning</td>
  <td>Exact &mdash; sub-point precision</td>
  <td>Medium &mdash; must calculate every position</td>
  <td>Excellent</td>
  <td><span class="badge available">GOOD BACKUP</span></td>
</tr>
<tr>
  <td><strong>Typst</strong></td>
  <td>Modern typesetting language (Rust-based)</td>
  <td>Own markup &mdash; not CSS</td>
  <td>Exact</td>
  <td>Medium &mdash; new syntax to learn</td>
  <td>Excellent</td>
  <td><span class="badge missing">NOT INSTALLED</span></td>
</tr>
<tr>
  <td><strong>LaTeX</strong></td>
  <td>Academic typesetting &mdash; TikZ for graphics</td>
  <td>None</td>
  <td>Exact</td>
  <td>High &mdash; verbose, steep learning curve</td>
  <td>Excellent</td>
  <td><span class="badge missing">NOT INSTALLED</span></td>
</tr>
<tr>
  <td><strong>reportlab</strong></td>
  <td>Python PDF lib &mdash; canvas-based drawing</td>
  <td>None</td>
  <td>Exact</td>
  <td>Medium-High</td>
  <td>Excellent</td>
  <td><span class="badge missing">NOT INSTALLED</span></td>
</tr>
</table>

<div class="pagebreak"></div>

<!-- ============================================================ -->
<h2>6. Recommendations &mdash; Best Stack for Print-Ready Cards</h2>

<div class="rec-box">
<h3>PRIMARY: HTML + Playwright (Python)</h3>
<ul>
  <li><strong>Why:</strong> Full CSS3 support means you design cards with the same HTML/CSS skills used for the website. Flexbox, Grid, gradients, web fonts, and box shadows all work perfectly.</li>
  <li><strong>How:</strong> Build each card as an HTML template (Jinja2) &rarr; render in headless Chromium &rarr; <code>page.pdf()</code> with exact 7&times;5in dimensions.</li>
  <li><strong>Fonts:</strong> Use <code>@font-face</code> with locally downloaded .ttf/.woff2 files for guaranteed print fidelity.</li>
  <li><strong>Images:</strong> Pillow for pre-processing; embed as base64 data URIs or local file paths.</li>
  <li><strong>No overflow:</strong> Use CSS <code>overflow: hidden</code>, <code>text-overflow: ellipsis</code>, and <code>clamp()</code> for font sizing.</li>
  <li><strong>Status:</strong> <span class="badge installed">READY NOW</span> &mdash; Playwright + Chromium + Jinja2 + Pillow all installed.</li>
</ul>
</div>

<div class="rec-box">
<h3>BACKUP: fpdf2 (Direct PDF)</h3>
<ul>
  <li><strong>Why:</strong> Zero browser dependency. Sub-point coordinate precision. Tiny output files.</li>
  <li><strong>When to use:</strong> If Playwright has rendering quirks, or for batch-generating hundreds of cards where browser overhead is too slow.</li>
  <li><strong>Trade-off:</strong> No CSS &mdash; every box, line, and text block must be manually positioned with x/y coordinates.</li>
  <li><strong>Status:</strong> <span class="badge installed">READY NOW</span></li>
</ul>
</div>

<h3>Recommended Workflow</h3>
<ol>
  <li>Design card layout in HTML/CSS (one-off, iterate visually)</li>
  <li>Templatize with Jinja2 for dynamic content (movie titles, verses, categories)</li>
  <li>Render to PDF via Playwright with <code>page.pdf(width='7in', height='5in')</code></li>
  <li>Validate: check text fits, fonts render, colors match</li>
  <li>Batch generate: loop over data, produce one PDF per card or combined multi-page PDF</li>
</ol>

<!-- ============================================================ -->
<h2>7. What's Missing &mdash; Install Recommendations</h2>

<div class="warn-box">
<h3>High Priority Installs</h3>
<table>
<tr><th>Tool</th><th>Install Command</th><th>Why</th></tr>
<tr>
  <td><strong>WeasyPrint</strong></td>
  <td><code>pip install weasyprint</code></td>
  <td>Lighter-weight HTML-to-PDF without needing a browser. Great for CI pipelines. Supports CSS Paged Media (@page rules) natively.</td>
</tr>
<tr>
  <td><strong>reportlab</strong></td>
  <td><code>pip install reportlab</code></td>
  <td>Industry-standard Python PDF library. Better text-flow control than fpdf2, supports paragraph reflow and advanced typography.</td>
</tr>
<tr>
  <td><strong>cairosvg</strong></td>
  <td><code>pip install cairosvg</code></td>
  <td>Convert SVG graphics to PDF/PNG. Useful for vector icons and decorative elements on cards.</td>
</tr>
</table>
</div>

<div class="warn-box">
<h3>Medium Priority</h3>
<table>
<tr><th>Tool</th><th>Install Command</th><th>Why</th></tr>
<tr>
  <td><strong>Typst</strong></td>
  <td><code>curl -fsSL https://typst.community/typst-install/install.sh | sh</code></td>
  <td>Modern typesetting with beautiful defaults. Excellent for text-heavy cards. Very fast compilation.</td>
</tr>
<tr>
  <td><strong>Ghostscript</strong></td>
  <td><code>apt install ghostscript</code></td>
  <td>PDF optimization, merging, compression. Reduces file sizes for print shops.</td>
</tr>
<tr>
  <td><strong>ImageMagick</strong></td>
  <td><code>apt install imagemagick</code></td>
  <td>Batch image processing, format conversion, compositing.</td>
</tr>
</table>
</div>

<div class="warn-box">
<h3>Nice to Have</h3>
<table>
<tr><th>Tool</th><th>Why</th></tr>
<tr><td><strong>TMDB API key</strong></td><td>Replace CSS gradient placeholders with real movie poster images</td></tr>
<tr><td><strong>Custom font files</strong></td><td>Download Russo One, Audiowide, Monoton as .ttf for guaranteed offline/print rendering</td></tr>
<tr><td><strong>Figma MCP server</strong></td><td>Import design comps directly into code</td></tr>
<tr><td><strong>canvas-design / theme-factory skills</strong></td><td>These don't exist yet &mdash; but could be built as custom Claude Code skills for rapid design iteration</td></tr>
</table>
</div>

<hr style="margin: 24px 0; border: none; border-top: 2px solid #e8527a;">
<p style="text-align: center; font-size: 9pt; color: #888;">Amy's 80s Movie Vault &bull; Tools &amp; Capabilities Audit &bull; Page generated by Claude Code</p>

</body>
</html>"""

def main():
    from playwright.sync_api import sync_playwright

    html_path = "/tmp/tools_cap.html"
    pdf_path = "/home/user/Eighties-Movies/TOOLS_AND_CAPABILITIES.pdf"

    with open(html_path, "w") as f:
        f.write(HTML_CONTENT)

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome",
            args=["--no-sandbox", "--disable-setuid-sandbox"],
        )
        page = browser.new_page()
        page.goto(f"file://{html_path}", wait_until="networkidle")
        page.pdf(
            path=pdf_path,
            format="Letter",
            margin={"top": "0.5in", "bottom": "0.5in", "left": "0.6in", "right": "0.6in"},
            print_background=True,
        )
        browser.close()

    print(f"PDF saved to {pdf_path}")

if __name__ == "__main__":
    main()

import os
import sys
import json
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Ensure src is in python path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from alyosha_gate import evaluate_discrete_gate, DiscreteInput
from alyosha_gate.errors import AlyoshaGateError

DOCS_DIR = Path(__file__).parent / "docs"

HTML_PAGE = """<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alyosha Gate Explorer & Validator</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-950 text-slate-100 h-full flex flex-col font-sans">
    <!-- Header -->
    <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
                AG
            </div>
            <div>
                <h1 class="text-lg font-bold tracking-tight">Alyosha Gate Explorer</h1>
                <p class="text-xs text-slate-400">AG-ECP-001 Deterministic Candidate Filtering System</p>
            </div>
        </div>
        <div class="flex items-center space-x-4 text-sm">
            <a href="https://github.com/a50kv109/Alyosha-gate" target="_blank" class="text-slate-300 hover:text-white flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition">
                <i class="fab fa-github"></i><span>GitHub Repository</span>
            </a>
            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-medium">v0.1.0-alpha.1</span>
        </div>
    </header>

    <!-- Main Workspace -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-72 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col space-y-2 overflow-y-auto">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Navigation</div>
            <button onclick="switchTab('simulator')" id="btn-simulator" class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white flex items-center space-x-3 shadow-md shadow-indigo-600/20">
                <i class="fas fa-sliders-h w-5"></i><span>Gate Simulator</span>
            </button>
            <button onclick="switchTab('docs')" id="btn-docs" class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-300 hover:bg-slate-800/60 flex items-center space-x-3">
                <i class="fas fa-book-open w-5"></i><span>Documentation</span>
            </button>
            <button onclick="switchTab('overview')" id="btn-overview" class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-300 hover:bg-slate-800/60 flex items-center space-x-3">
                <i class="fas fa-info-circle w-5"></i><span>Project Overview</span>
            </button>
        </aside>

        <!-- Content Area -->
        <main class="flex-1 overflow-y-auto p-8 bg-slate-950">
            <!-- Simulator Tab -->
            <div id="tab-simulator" class="max-w-4xl mx-auto space-y-6">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h2 class="text-xl font-bold mb-2 flex items-center space-x-2">
                        <i class="fas fa-microchip text-indigo-400"></i>
                        <span>Discrete Gate Evaluator</span>
                    </h2>
                    <p class="text-sm text-slate-400 mb-6">
                        Test candidate integer sequences against AG-ECP-001 preliminary verification logic. PASS denotes passing filter checks; it is not a theorem proof.
                    </p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-xs font-semibold uppercase text-slate-400 mb-2">Base Numbers (comma separated)</label>
                            <input type="text" id="input-numbers" value="4, 8, 12" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-sm">
                            <p class="text-xs text-slate-500 mt-1">Positive integers only (e.g. 4, 8, 12)</p>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase text-slate-400 mb-2">Exponents (comma separated)</label>
                            <input type="text" id="input-exponents" value="3, 3, 3" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-sm">
                            <p class="text-xs text-slate-500 mt-1">Exponents corresponding to each base</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label class="block text-xs font-semibold uppercase text-slate-400 mb-2">DMOD Threshold</label>
                            <input type="number" id="input-threshold" value="1.0" step="0.1" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold uppercase text-slate-400 mb-2">Mode</label>
                            <select id="input-mode" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm">
                                <option value="rectified_discrete">rectified_discrete</option>
                                <option value="source_faithful">source_faithful (raises error)</option>
                            </select>
                        </div>
                        <div class="flex items-center pt-6">
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="input-exponent-limit" checked class="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500">
                                <span class="text-sm font-medium text-slate-300">Check Exponent Limit (&le; 2)</span>
                            </label>
                        </div>
                    </div>

                    <button onclick="runEvaluation()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2">
                        <i class="fas fa-play"></i><span>Evaluate Candidate</span>
                    </button>
                </div>

                <!-- Result Box -->
                <div id="result-box" class="hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Evaluation Result</h3>
                    <div id="result-content" class="space-y-4"></div>
                </div>
            </div>

            <!-- Documentation Tab -->
            <div id="tab-docs" class="hidden max-w-4xl mx-auto space-y-6">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h2 class="text-xl font-bold mb-4 flex items-center space-x-2">
                        <i class="fas fa-book text-indigo-400"></i>
                        <span>Project Documentation</span>
                    </h2>
                    <div id="docs-list" class="flex flex-wrap gap-2 mb-6"></div>
                    <div id="doc-viewer" class="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap text-slate-300">
                        Select a document above to view its contents.
                    </div>
                </div>
            </div>

            <!-- Overview Tab -->
            <div id="tab-overview" class="hidden max-w-4xl mx-auto space-y-6">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <h2 class="text-xl font-bold flex items-center space-x-2">
                        <i class="fas fa-shield-alt text-indigo-400"></i>
                        <span>Alyosha Gate / AG-ECP-001</span>
                    </h2>
                    <p class="text-slate-300 leading-relaxed">
                        Alyosha Gate is an experimental Python filter for preliminary candidate sequence filtering related to Beal's Conjecture. It performs deterministic preliminary checks; it is not a prover or decision maker.
                    </p>
                    <div class="border-t border-slate-800 pt-4 space-y-2 text-sm text-slate-400">
                        <p><strong>License:</strong> MIT License (Copyright (c) 2026 Арцыбашев Андрей Алексеевич)</p>
                        <p><strong>Integration Warning:</strong> Before integration, verify the filter on your own data and in the target environment, run project tests, and independently verify results important for your application. PASS denotes passing filter checks; it is not a proof or theorem validation.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script>
        function switchTab(tabName) {
            ['simulator', 'docs', 'overview'].forEach(t => {
                document.getElementById('tab-' + t).classList.add('hidden');
                document.getElementById('btn-' + t).className = "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition text-slate-300 hover:bg-slate-800/60 flex items-center space-x-3";
            });
            document.getElementById('tab-' + tabName).classList.remove('hidden');
            document.getElementById('btn-' + tabName).className = "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white flex items-center space-x-3 shadow-md shadow-indigo-600/20";

            if (tabName === 'docs') loadDocsList();
        }

        async function runEvaluation() {
            const numbers = document.getElementById('input-numbers').value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            const exponents = document.getElementById('input-exponents').value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            const threshold = parseFloat(document.getElementById('input-threshold').value);
            const mode = document.getElementById('input-mode').value;
            const check_exponent_limit = document.getElementById('input-exponent-limit').checked;

            try {
                const res = await fetch('/api/evaluate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({numbers, exponents, threshold, mode, check_exponent_limit})
                });
                const data = await res.json();
                
                const box = document.getElementById('result-box');
                const content = document.getElementById('result-content');
                box.classList.remove('hidden');

                if (data.status === 'success') {
                    const isPass = data.decision === 'PASS';
                    const badgeColor = isPass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30';
                    content.innerHTML = `
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-slate-400">Decision:</span>
                            <span class="px-3 py-1 rounded-full border text-sm font-bold ${badgeColor}">${data.decision}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div><span class="text-slate-500">GCD:</span> ${JSON.stringify(data.gcd)}</div>
                            <div><span class="text-slate-500">DMOD:</span> ${data.dmod !== null ? data.dmod : 'N/A'}</div>
                        </div>
                        ${data.error_message ? `<div class="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">Error: ${data.error_message}</div>` : ''}
                        <div>
                            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diagnostics</span>
                            <pre class="mt-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 overflow-x-auto">${JSON.stringify(data.diagnostics, null, 2)}</pre>
                        </div>
                    `;
                } else {
                    content.innerHTML = `
                        <div class="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-sm">
                            <strong>${data.error_type}:</strong> ${data.message}
                        </div>
                    `;
                }
            } catch (err) {
                alert('Request failed: ' + err);
            }
        }

        async function loadDocsList() {
            const res = await fetch('/api/docs-list');
            const files = await res.json();
            const container = document.getElementById('docs-list');
            container.innerHTML = '';
            files.forEach(file => {
                const btn = document.createElement('button');
                btn.className = "px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700";
                btn.textContent = file;
                btn.onclick = () => loadDocContent(file);
                container.appendChild(btn);
            });
            if (files.length > 0) loadDocContent(files[0]);
        }

        async function loadDocContent(filename) {
            const res = await fetch('/api/doc/' + filename);
            const data = await res.json();
            document.getElementById('doc-viewer').textContent = data.content;
        }
    </script>
</body>
</html>
"""

class ServerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == "/" or path == "":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_PAGE.encode("utf-8"))
        elif path == "/api/docs-list":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            files = sorted([f.name for f in DOCS_DIR.glob("*.md")]) if DOCS_DIR.exists() else []
            self.wfile.write(json.dumps(files).encode("utf-8"))
        elif path.startswith("/api/doc/"):
            filename = path[len("/api/doc/"):]
            doc_path = DOCS_DIR / filename
            if doc_path.resolve().is_relative_to(DOCS_DIR.resolve()) and doc_path.exists():
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                content = doc_path.read_text(encoding="utf-8")
                self.wfile.write(json.dumps({"content": content}).encode("utf-8"))
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path == "/api/evaluate":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            try:
                req = json.loads(body.decode("utf-8"))
                numbers = req.get("numbers", [])
                exponents = req.get("exponents", [])
                threshold = float(req.get("threshold", 1.0))
                mode = req.get("mode", "rectified_discrete")
                check_exponent_limit = req.get("check_exponent_limit", True)

                inp = DiscreteInput(
                    numbers=numbers,
                    exponents=exponents,
                    threshold=threshold,
                    check_exponent_limit=check_exponent_limit
                )
                result = evaluate_discrete_gate(inp, mode=mode)
                response_data = {
                    "status": "success",
                    "decision": result.decision.value,
                    "dmod": result.dmod,
                    "gcd": result.gcd,
                    "error_message": result.error_message,
                    "diagnostics": result.diagnostics
                }
            except AlyoshaGateError as e:
                response_data = {
                    "status": "error",
                    "error_type": type(e).__name__,
                    "message": str(e)
                }
            except Exception as e:
                response_data = {
                    "status": "error",
                    "error_type": "InternalError",
                    "message": str(e)
                }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not found")

    def log_message(self, format, *args):
        pass

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    server = HTTPServer(("0.0.0.0", port), ServerHandler)
    print(f"Alyosha Gate Explorer server running on port {port}")
    server.serve_forever()

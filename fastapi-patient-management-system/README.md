</head><body>
<div align="center">
<h1>🏥 PatientCare — Patient Management System</h1>
<p><strong>A FastAPI REST service with a responsive web dashboard that manages patient records and computes BMI and health verdicts automatically.</strong></p>
<p><img src="https://img.shields.io/badge/Python-3.10%2B-3B8F7B?style=for-the-badge&amp;logo=python&amp;logoColor=white" alt="Python">
<img src="https://img.shields.io/badge/FastAPI-0.161-3B8F7B?style=for-the-badge&amp;logo=fastapi&amp;logoColor=white" alt="FastAPI">
<img src="https://img.shields.io/badge/Pydantic-v2-3B8F7B?style=for-the-badge" alt="Pydantic">
<img src="https://img.shields.io/badge/HTML%20%7C%20CSS%20%7C%20JS-0F1F16?style=for-the-badge&amp;logoColor=A7F432" alt="Frontend"></p>
</div>
<hr>
<h2>🎯 Project Overview</h2>
<p>PatientCare is a patient management system built around a validated REST API. It lets you <strong>create, view, edit, delete and sort</strong> patient records, and it derives <strong>BMI</strong> and a <strong>health verdict</strong> from each patient's height and weight, so those values can never go out of sync.</p>
<p>The same FastAPI app also serves a landing page and an interactive dashboard, so one command runs the whole product.</p>
<hr>
<h2>📌 Key Features</h2>
<ul>
<li>✅ Full CRUD for patient records with unique IDs</li>
<li>⚖️ BMI and verdict as Pydantic <strong>computed fields</strong></li>
<li>🛡️ Strict validation (types, length limits, value ranges)</li>
<li>🔃 Sorting by height, weight or BMI (ascending or descending)</li>
<li>📊 Dashboard with live stats, verdict distribution bar, search, filter and CSV export</li>
<li>🌗 Light and dark themes, fully responsive</li>
<li>💾 Demo mode: the dashboard still works without the server, using sample data</li>
<li>📖 Auto-generated API docs at <code>/docs</code> and <code>/redoc</code></li>
<li>🐳 Dockerfile included</li>
</ul>
<hr>
<h2>📂 Project Structure</h2>
<pre><code>patient-management-website/
├── main.py                  # App entry point, /health, static site mount
├── patients.json            # JSON data store
├── requirements.txt         # Pinned dependencies
├── Dockerfile               # Container image
├── models/
│   └── patient.py           # Patient / PatientUpdate schemas + BMI logic
├── routers/
│   └── patient.py           # CRUD + sort endpoints
├── dependencies/
│   └── patient.py           # Shared dependencies
├── utils/
│   └── database.py          # JSON load/save helpers
└── website/
    ├── index.html           # Landing page
    ├── dashboard.html       # Patient dashboard
    ├── css/style.css        # Styles and themes
    └── js/                  # common.js, landing.js, dashboard.js
</code></pre>
<hr>
<h2>⚙️ Technologies Used</h2>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>Layer</th>
<th>Technology</th>
</tr>
</thead>
<tbody>
<tr>
<td>🐍 Backend</td>
<td>Python, FastAPI, Uvicorn</td>
</tr>
<tr>
<td>✔️ Validation</td>
<td>Pydantic v2</td>
</tr>
<tr>
<td>🗄️ Storage</td>
<td>JSON file</td>
</tr>
<tr>
<td>🎨 Frontend</td>
<td>HTML5, CSS3, vanilla JavaScript</td>
</tr>
<tr>
<td>🐳 Packaging</td>
<td>Docker</td>
</tr>
</tbody>
</table>
</div>
<hr>
<h2>🔍 Methodology / Workflow</h2>
<pre><code> Browser (HTML / CSS / JS)
        │  fetch()
        ▼
 ┌──────────────────────────────┐
 │  FastAPI  (main.py)          │
 │   ├─ /site     website       │
 │   ├─ /health   status check  │
 │   └─ routers/patient.py ─────┼──► models/patient.py  (validate + BMI)
 └──────────────┬───────────────┘
                ▼
       utils/database.py ──► patients.json
</code></pre>
<ol>
<li>The client sends JSON to an endpoint.</li>
<li>Pydantic validates the payload (<code>422</code> on failure).</li>
<li>BMI and verdict are computed from height and weight.</li>
<li>The record is written to <code>patients.json</code> and a response is returned.</li>
<li>The dashboard probes <code>/health</code> on load: if the API answers it works live, otherwise it falls back to demo mode.</li>
</ol>
<h3>🧮 BMI logic</h3>
<pre><code class="language-python">bmi = round(weight / (height ** 2), 2)
</code></pre>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>BMI</th>
<th>Verdict</th>
</tr>
</thead>
<tbody>
<tr>
<td>below 18.5</td>
<td>Underweight</td>
</tr>
<tr>
<td>18.5 to 24.9</td>
<td>Normal</td>
</tr>
<tr>
<td>25 to 29.9</td>
<td>Overweight</td>
</tr>
<tr>
<td>30 and above</td>
<td>Obese</td>
</tr>
</tbody>
</table>
</div>
<h3>🔌 API Endpoints</h3>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Success</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>GET</code></td>
<td><code>/health</code></td>
<td>Service health check</td>
<td><code>200</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/view</code></td>
<td>All patients, keyed by ID</td>
<td><code>200</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/sort?sort_by=bmi&amp;order=desc</code></td>
<td>Sorted list (<code>height</code>, <code>weight</code>, <code>bmi</code>)</td>
<td><code>200</code></td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/patient/{patient_id}</code></td>
<td>Single patient</td>
<td><code>200</code></td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/create</code></td>
<td>Create a patient</td>
<td><code>201</code></td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/edit/{patient_id}</code></td>
<td>Partial update</td>
<td><code>200</code></td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/delete/{patient_id}</code></td>
<td>Delete a patient</td>
<td><code>200</code></td>
</tr>
</tbody>
</table>
</div>
<p>Errors: <code>400</code> invalid sort field/order or duplicate ID · <code>404</code> not found · <code>422</code> validation error.</p>
<h3>🧾 Data model</h3>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>Field</th>
<th>Type</th>
<th>Rules</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>id</code></td>
<td>string</td>
<td>required, unique</td>
</tr>
<tr>
<td><code>name</code></td>
<td>string</td>
<td>required, max 25 chars</td>
</tr>
<tr>
<td><code>city</code></td>
<td>string</td>
<td>required, max 25 chars</td>
</tr>
<tr>
<td><code>age</code></td>
<td>int</td>
<td>greater than 0, less than 120</td>
</tr>
<tr>
<td><code>gender</code></td>
<td>enum</td>
<td><code>male</code>, <code>female</code>, <code>others</code></td>
</tr>
<tr>
<td><code>height</code></td>
<td>float</td>
<td>metres, greater than 0</td>
</tr>
<tr>
<td><code>weight</code></td>
<td>float</td>
<td>kilograms, greater than 0</td>
</tr>
<tr>
<td><code>bmi</code></td>
<td>float</td>
<td>computed</td>
</tr>
<tr>
<td><code>verdict</code></td>
<td>string</td>
<td>computed</td>
</tr>
</tbody>
</table>
</div>
<hr>
<h2>🚀 Getting Started</h2>
<pre><code class="language-bash"># 1. Clone and enter the project
git clone &lt;your-repository-url&gt;
cd patient-management-website

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the server
uvicorn main:app --reload
</code></pre>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>URL</th>
<th>What you get</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>http://127.0.0.1:8000/</code></td>
<td>Redirects to the website</td>
</tr>
<tr>
<td><code>http://127.0.0.1:8000/site/</code></td>
<td>Landing page</td>
</tr>
<tr>
<td><code>http://127.0.0.1:8000/site/dashboard.html</code></td>
<td>Dashboard</td>
</tr>
<tr>
<td><code>http://127.0.0.1:8000/docs</code></td>
<td>Swagger UI</td>
</tr>
</tbody>
</table>
</div>
<h3>🐳 Docker</h3>
<pre><code class="language-bash">docker build -t patientcare .
docker run -p 8000:8000 -v &#34;$(pwd)/patients.json:/app/patients.json&#34; patientcare
</code></pre>
<h3>🧪 Example request</h3>
<pre><code class="language-bash">curl -X POST http://127.0.0.1:8000/create \
  -H &#34;Content-Type: application/json&#34; \
  -d &#39;{&#34;id&#34;:&#34;P008&#34;,&#34;name&#34;:&#34;Aarav Shah&#34;,&#34;city&#34;:&#34;Delhi&#34;,&#34;age&#34;:31,&#34;gender&#34;:&#34;male&#34;,&#34;height&#34;:1.78,&#34;weight&#34;:74}&#39;
</code></pre>
<hr>
<h2>📊 Results &amp; Behavior</h2>
<p>This is an application rather than an ML project, so results are shown as the behavior on the bundled sample data (7 patients in <code>patients.json</code>):</p>
<div class="md-table" role="group" aria-label="Table" tabindex="0"><table>
<thead>
<tr>
<th>ID</th>
<th>Name</th>
<th>BMI</th>
<th>Verdict</th>
</tr>
</thead>
<tbody>
<tr>
<td>P001</td>
<td>Ananya Verma</td>
<td>33.06</td>
<td>Obese</td>
</tr>
<tr>
<td>P002</td>
<td>Ravi Mehta</td>
<td>27.76</td>
<td>Overweight</td>
</tr>
<tr>
<td>P003</td>
<td>Sneha Kulkarni</td>
<td>17.58</td>
<td>Underweight</td>
</tr>
<tr>
<td>P004</td>
<td>Arjun Verma</td>
<td>27.78</td>
<td>Overweight</td>
</tr>
<tr>
<td>P005</td>
<td>Neha Sinha</td>
<td>31.22</td>
<td>Obese</td>
</tr>
<tr>
<td>P006</td>
<td>Himanshu</td>
<td>16.90</td>
<td>Underweight</td>
</tr>
<tr>
<td>P007</td>
<td>Saumya</td>
<td>20.28</td>
<td>Normal</td>
</tr>
</tbody>
</table>
</div>
<p><strong>Dashboard summary:</strong> 7 patients · average BMI <strong>24.9</strong> · 2 Underweight · 1 Normal · 2 Overweight · 2 Obese.</p>
<blockquote>
<p>⚠️ In the original <code>patients.json</code>, P004 was stored with the verdict &quot;Normal&quot; although its BMI of 27.78 is Overweight. The dashboard recalculates verdicts from height and weight, so it shows the correct value.</p>
</blockquote>
<hr>
<h2>💡 Key Learnings</h2>
<ul>
<li>🧠 Computed fields keep derived data (BMI, verdict) consistent without storing it by hand.</li>
<li>🛡️ Pydantic models give validation and API documentation from a single definition.</li>
<li>🔌 A single FastAPI app can serve both the API and a static frontend.</li>
<li>📂 Resolving file paths from the project location avoids &quot;works on my machine&quot; errors.</li>
<li>🧩 A graceful demo-mode fallback makes the frontend usable even when the backend is offline.</li>
</ul>
<hr>
<h2>🚀 Future Improvements</h2>
<ul>
<li><input disabled="" type="checkbox"> 🔐 Authentication and role-based access</li>
<li><input disabled="" type="checkbox"> 📄 Pagination and filtering on the API</li>
<li><input disabled="" type="checkbox"> 🧪 Automated tests and CI</li>
<li><input disabled="" type="checkbox"> 🧾 Audit log for record changes</li>
<li><input disabled="" type="checkbox"> 📈 BMI trend charts per patient</li>
</ul>
<hr>
<div align="center">
<p>⭐ If you found this repository helpful, consider giving it a star!</p>
<p>📚 Always learning, always building.</p>
<p><strong>Made with ❤️ by Arpit Kushwaha</strong></p>
<p>Thanks for visiting!</p>
</div>

</body></html>

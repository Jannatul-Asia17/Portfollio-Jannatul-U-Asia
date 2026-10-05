# Jannatul U. Asia · Data Analyst Portfolio

A data-themed personal portfolio for Data Analyst, Business Analyst and Data Engineer roles.
It is pure HTML, CSS and vanilla JavaScript with no build step and no frameworks, so it runs on GitHub Pages as-is.

**What's on the site**

- **Hero**: a mini "dashboard" card with KPI tiles and a chart, so visitors see your data skills straight away
- **About**: your bio, plus a "who am I" card written as a SQL query
- **Toolkit**: skills grouped by area with honest levels (Learning / Familiar / Proficient), and your workflow pipeline
- **Projects**: filterable case-study cards (Problem → Approach → Result) with a mini chart on each
- **Live analytics demo**: an interactive dashboard (filters, KPIs, line and bar charts, tooltips, table view) whose insight sentence is generated from the data
- **Journey**: a timeline of experience and education, plus certifications
- **Contact**: email, socials and a message form
- Light and dark mode, mobile-friendly, keyboard accessible

## 1. Put your own information in

**Everything is in one file: [`assets/js/data.js`](assets/js/data.js).** Open it and replace every
`[placeholder in square brackets]` with your real details: email, LinkedIn, Kaggle, degree, university,
internship, certifications and the **Result** line of each project.

- **CV**: add your PDF to `assets/` and set `resumeUrl: "assets/Your_CV.pdf"`. A *Download CV* button then appears.
- **Photo** (optional): add `assets/img/profile.jpg` and set `photo: "assets/img/profile.jpg"`.
- **Projects**: change the `links.code` / `links.demo` URLs to your actual repos and dashboards.
  Add or remove project objects freely. `category` must be `analytics`, `bi`, `engineering` or `ml`.
- **Stats**: keep the numbers in `stats` truthful, because interviewers ask about them.

> Recruiters click through. Every project card should link to a real GitHub repo with a clear
> README (business question, dataset, method, findings, screenshots).

## 2. Publish on GitHub Pages

You have two options.

### Option A (recommended): `https://jannatul-asia17.github.io`
1. On GitHub, rename this repository to **`jannatul-asia17.github.io`**
   (*Settings → General → Repository name*).
2. Go to *Settings → Pages* and set **Source: Deploy from a branch**, **Branch: `main` / root**.
3. Wait 1–2 minutes, then open `https://jannatul-asia17.github.io`.

### Option B: keep the current repo name
Do step 2 above. The site will be at
`https://jannatul-asia17.github.io/Portfollio-Jannatul-U-Asia/`.

## 3. Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Starter projects you can build

The sample project cards describe a balanced, recruiter-friendly set. Build them with these free datasets:

| Card | Dataset | Tools |
|---|---|---|
| Retail Sales Dashboard | [Sample Superstore](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final) | Power BI, DAX |
| Customer Churn | [Telco Customer Churn](https://www.kaggle.com/datasets/blastchar/telco-customer-churn) | Python, scikit-learn |
| E-commerce SQL | [Olist Brazilian E-commerce](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce) | PostgreSQL |
| ETL Pipeline | [Open-Meteo API](https://open-meteo.com/) (free, no key) | Python, Airflow, Docker |
| A/B Test | [A/B testing dataset](https://www.kaggle.com/datasets/zhangluyuan/ab-testing) | Python, SciPy |
| HR Attrition | [IBM HR Attrition](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset) | Tableau |

## File structure

```
index.html            page layout
assets/css/style.css  design (colours, layout, light/dark theme)
assets/js/data.js     ← ALL your content lives here
assets/js/charts.js   tiny SVG chart library (line, bar, mini charts)
assets/js/main.js     renders content, live demo, interactions
.nojekyll             tells GitHub Pages to serve files as-is
```

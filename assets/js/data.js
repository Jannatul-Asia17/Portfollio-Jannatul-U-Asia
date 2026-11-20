/* ==========================================================================
   PORTFOLIO CONTENT — edit this file to update the whole website.
   Everything you see on the page (text, projects, skills, links) comes
   from here, so you never have to touch the HTML/CSS/JS.

   Anything written in [square brackets] is a placeholder: replace it
   with your real information before sharing the site with recruiters.
   ========================================================================== */

const PORTFOLIO = {
  profile: {
    name: "Jannatul U. Asia",
    initials: "JA",
    // Rotating titles shown in the hero headline
    roles: ["Data Analyst", "Business Analyst", "Data Engineer", "Aspiring Data Scientist"],
    tagline:
      "I turn messy, raw data into clean pipelines, clear dashboards and decisions people can act on.",
    location: "[Your City, Country]",
    availability: "Open to entry-level Data Analyst, BI & Data Engineering roles",
    email: "[your.email@example.com]",
    // Put your CV in assets/ (e.g. assets/Jannatul_U_Asia_Resume.pdf) and set the path here.
    // Leave empty ("") to hide the "Download CV" button.
    resumeUrl: "",
    photo: "", // optional, e.g. "assets/img/profile.jpg" — initials are shown when empty
  },

  socials: [
    { label: "GitHub", url: "https://github.com/jannatul-asia17", icon: "github" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/[your-linkedin]", icon: "linkedin" },
    { label: "Kaggle", url: "https://www.kaggle.com/[your-kaggle]", icon: "kaggle" },
    { label: "Tableau Public", url: "https://public.tableau.com/app/profile/[your-profile]", icon: "chart" },
  ],

  about: {
    paragraphs: [
      "I'm a recent graduate who fell in love with data the moment a messy spreadsheet turned into a story. I enjoy the whole journey: asking the right business question, cleaning and modelling the data with SQL and Python, and presenting the answer in a dashboard a manager can read in thirty seconds.",
      "My long-term goal is to grow into a Data Scientist. Right now I'm looking for a role as a Data Analyst, Business Analyst or Data Engineer where I can learn from a strong team, own real data problems and ship work that moves business metrics.",
    ],
    // Small "at a glance" facts next to your bio
    facts: [
      { label: "Degree", value: "[B.Sc. in Your Major]" },
      { label: "University", value: "[Your University]" },
      { label: "Graduated", value: "[2025]" },
      { label: "Focus", value: "Analytics · BI · Data Pipelines" },
    ],
  },

  // Headline numbers in the hero. Keep them honest — recruiters do check.
  stats: [
    { value: 6, suffix: "", label: "End-to-end projects" },
    { value: 10, suffix: "+", label: "Datasets cleaned & analysed" },
    { value: 4, suffix: "", label: "Dashboards published" },
    { value: 3, suffix: "", label: "Certifications" },
  ],

  skills: [
    {
      group: "Analysis & Programming",
      icon: "code",
      items: [
        { name: "SQL", level: "Proficient", note: "Joins, CTEs, window functions, query tuning" },
        { name: "Python", level: "Proficient", note: "pandas, NumPy, Matplotlib, Seaborn" },
        { name: "R", level: "Familiar", note: "tidyverse, ggplot2" },
        { name: "Statistics", level: "Proficient", note: "Hypothesis testing, A/B tests, regression" },
      ],
    },
    {
      group: "BI & Visualization",
      icon: "chart",
      items: [
        { name: "Power BI", level: "Proficient", note: "DAX, data modelling, drill-throughs" },
        { name: "Tableau", level: "Proficient", note: "LODs, parameters, story points" },
        { name: "Excel", level: "Proficient", note: "Power Query, pivots, XLOOKUP" },
        { name: "Looker Studio", level: "Familiar", note: "Connected GA4 & Sheets reports" },
      ],
    },
    {
      group: "Data Engineering",
      icon: "pipe",
      items: [
        { name: "ETL / ELT", level: "Proficient", note: "Extract, validate, load, schedule" },
        { name: "PostgreSQL / MySQL", level: "Proficient", note: "Schema design, indexing" },
        { name: "Apache Airflow", level: "Familiar", note: "DAGs, scheduling, retries" },
        { name: "dbt · Spark · BigQuery", level: "Learning", note: "Models, tests, big-data basics" },
      ],
    },
    {
      group: "Data Science & Tools",
      icon: "brain",
      items: [
        { name: "scikit-learn", level: "Familiar", note: "Classification, clustering, pipelines" },
        { name: "Git & GitHub", level: "Proficient", note: "Branches, PRs, versioned analysis" },
        { name: "Jupyter", level: "Proficient", note: "Reproducible notebooks" },
        { name: "Docker", level: "Learning", note: "Containerised pipelines" },
      ],
    },
  ],

  // Business skills recruiters for BA roles look for
  softSkills: [
    "Requirement gathering",
    "KPI definition",
    "Data storytelling",
    "Stakeholder communication",
    "Problem framing",
    "Documentation",
  ],

  /* PROJECTS ---------------------------------------------------------------
     category must be one of: "analytics", "bi", "engineering", "ml"
     viz: a tiny chart shown on the card. type = "line" | "bars"
     Replace the links with your real GitHub repos / dashboards.
     The project list below is a strong starter set for an entry-level
     data portfolio — see README.md for the public datasets to build them. */
  projects: [
    {
      title: "Retail Sales Performance Dashboard",
      category: "bi",
      summary:
        "Interactive Power BI dashboard tracking revenue, profit margin and returns across regions, categories and time for a US superstore.",
      problem: "Managers had no single view of which regions and product lines were losing margin.",
      approach:
        "Cleaned 11k order lines in Power Query, built a star schema (fact + 4 dimensions + DAX date table) and wrote 60 DAX measures: time intelligence, TREATAS virtual relationships, a discount what-if parameter, dynamic Top N, Pareto and new vs returning customers. Every measure is checked against an independent Python answer key.",
      result:
        "Discounts above 20% were loss-making (-25.8% margin above 30%); capping them at 20% is worth up to +3.2% profit. Central region discounts the most and was the only region below target.",
      tools: ["Power BI", "DAX", "Power Query", "Data modelling"],
      links: { code: "https://github.com/jannatul-asia17/Portfollio-Jannatul-U-Asia/tree/main/projects/retail-sales-dax", demo: "" },
      viz: { type: "line", data: [42, 45, 44, 51, 49, 56, 61, 58, 64, 70, 76, 83] },
      featured: true,
    },
    {
      title: "Customer Churn Analysis & Prediction",
      category: "ml",
      summary:
        "End-to-end Python analysis of a telecom customer base to find why customers leave and who is likely to leave next.",
      problem: "The business wanted to know which customers to target with retention offers.",
      approach:
        "EDA with pandas & Seaborn, chi-square tests on contract and payment type, then a logistic-regression and random-forest model with class balancing and SHAP-style feature importance.",
      result: "[Your key finding, e.g. 'Month-to-month contracts churn at ~3x the rate of 1-year contracts.']",
      tools: ["Python", "pandas", "scikit-learn", "Seaborn"],
      links: { code: "https://github.com/jannatul-asia17", demo: "" },
      viz: { type: "bars", data: [43, 11, 3] , labels: ["Monthly", "1-yr", "2-yr"] },
      featured: true,
    },
    {
      title: "E-commerce Analytics with Advanced SQL",
      category: "analytics",
      summary:
        "Answered 15 real business questions on a 100k-order marketplace database using CTEs, window functions and cohort queries.",
      problem: "Understand delivery delays, repeat purchase rate and seller performance.",
      approach:
        "Modelled 8 related tables in PostgreSQL, wrote cohort-retention, RFM segmentation and running-total queries, and documented every query with its business question.",
      result: "[Your key finding, e.g. 'Late deliveries cut average review score from 4.3 to 2.6.']",
      tools: ["PostgreSQL", "SQL", "Window functions", "RFM"],
      links: { code: "https://github.com/jannatul-asia17", demo: "" },
      viz: { type: "line", data: [100, 62, 48, 41, 37, 34, 32, 31, 30, 29, 29, 28] },
      featured: true,
    },
    {
      title: "Automated Weather & Air-Quality ETL Pipeline",
      category: "engineering",
      summary:
        "A daily batch pipeline that pulls data from a public API, validates it and loads it into a PostgreSQL warehouse ready for reporting.",
      problem: "Raw API data was inconsistent and had to be collected by hand.",
      approach:
        "Python extract scripts, schema & null checks, incremental loads into Postgres, orchestrated with an Apache Airflow DAG running in Docker, with logging and retries.",
      result: "[Your result, e.g. 'Runs daily with zero manual work; 1 year of history loaded.']",
      tools: ["Python", "Airflow", "PostgreSQL", "Docker"],
      links: { code: "https://github.com/jannatul-asia17", demo: "" },
      viz: { type: "bars", data: [24, 24, 23, 24, 24, 24, 24], labels: ["M", "T", "W", "T", "F", "S", "S"] },
      featured: false,
    },
    {
      title: "A/B Test: Landing Page Conversion",
      category: "analytics",
      summary:
        "Statistical evaluation of a website experiment to decide whether a new landing page should be rolled out.",
      problem: "Product team needed a data-backed go / no-go decision.",
      approach:
        "Sanity-checked sample ratio, computed conversion lift with confidence intervals, ran a two-proportion z-test and checked power, then wrote a one-page recommendation.",
      result: "[Your result, e.g. 'Lift was not statistically significant — recommended extending the test.']",
      tools: ["Python", "SciPy", "Statistics", "Excel"],
      links: { code: "https://github.com/jannatul-asia17", demo: "" },
      viz: { type: "bars", data: [12.0, 12.4], labels: ["Control", "Variant"] },
      featured: false,
    },
    {
      title: "HR Attrition Insights in Tableau",
      category: "bi",
      summary:
        "A Tableau story that explores employee attrition by department, tenure, overtime and satisfaction for an HR leadership team.",
      problem: "HR wanted to see where and why employees were leaving.",
      approach:
        "Built calculated fields and LOD expressions, designed a 3-page story with filters and highlight actions, published to Tableau Public.",
      result: "[Your key finding, e.g. 'Employees working overtime were 3x more likely to leave.']",
      tools: ["Tableau", "LOD", "Excel", "Storytelling"],
      links: { code: "", demo: "https://public.tableau.com/" },
      viz: { type: "line", data: [18, 16, 17, 15, 14, 15, 13, 12, 12, 11, 10, 10] },
      featured: false,
    },
  ],

  /* JOURNEY — education, internships, volunteering, certifications.
     type: "education" | "work" | "cert" */
  journey: [
    {
      type: "work",
      title: "[Data Analyst Intern]",
      org: "[Company Name]",
      period: "[Month 2025 – Month 2025]",
      points: [
        "[Automated a weekly Excel report with Python, saving ~4 hours per week.]",
        "[Built a Power BI dashboard used by the sales team to track targets.]",
      ],
    },
    {
      type: "education",
      title: "[B.Sc. in Your Major]",
      org: "[Your University]",
      period: "[2021 – 2025]",
      points: [
        "[CGPA: x.xx / 4.00]",
        "Relevant courses: Database Systems, Statistics & Probability, Machine Learning, Data Structures",
        "[Thesis / final-year project title, if data-related]",
      ],
    },
    {
      type: "cert",
      title: "Google Data Analytics Professional Certificate",
      org: "Google · Coursera",
      period: "[Year]",
      points: [],
      url: "",
    },
    {
      type: "cert",
      title: "Microsoft Power BI Data Analyst (PL-300)",
      org: "Microsoft",
      period: "[Year]",
      points: [],
      url: "",
    },
    {
      type: "cert",
      title: "SQL (Advanced) Certificate",
      org: "HackerRank",
      period: "[Year]",
      points: [],
      url: "",
    },
  ],
};

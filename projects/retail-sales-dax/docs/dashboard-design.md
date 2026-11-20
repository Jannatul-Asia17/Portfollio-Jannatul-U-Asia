# Dashboard design

Five report pages, each answering one business question. Every visual uses
explicit measures from `_Measures`, never a raw column dragged onto it.

**Global slicers** (synced across pages with *View → Sync slicers*): `'Date'[Year]`,
`DimGeography[Region]`, `DimProduct[Category]`, `DimCustomer[Segment]`.

**Theme**: one accent colour for "actual", grey for "comparison" (PY / target),
green/red only for good/bad (driven by `[YoY Color]` and `[Target Status Color]`).

---

## Page 1 · Executive overview: *"How is the business doing?"*

| Visual | Fields |
|---|---|
| Text box / card (new card visual) | `[Headline Insight]` |
| 5 KPI cards | `[Total Sales]`, `[Total Profit]`, `[Profit Margin %]`, `[Orders]`, `[Avg Order Value]`. Reference label = `[Sales YoY %]` coloured by `[YoY Color]` |
| Line chart | X `'Date'[Year Month]`; Y `[Total Sales]`, `[Sales PY]`, `[Sales Rolling 3M]`; title from `[Title Sales Trend]` |
| Clustered bar | Y `DimGeography[Region]`; X `[Total Sales]`; tooltip `[Profit Margin %]`, `[Return Rate %]` |
| Donut (or 100% bar) | Legend `DimProduct[Category]`; values `[Total Sales]` |

## Page 2 · Profitability & discounts: *"Where are we losing margin?"*

| Visual | Fields |
|---|---|
| Column chart | X `FactSales[Discount Band]`; Y `[Total Sales]` (columns) + `[Profit Margin %]` (line, secondary axis) |
| Matrix (heatmap) | Rows `DimProduct[Category]` → `[SubCategory]`; columns `DimGeography[Region]`; values `[Profit Margin %]` with background colour scale |
| Cards | `[Deep-Discount Sales %]`, `[Profit at Deep Discount]`, `[Loss-making Orders]` |
| What-if panel | Slicer on `'Discount Cap'[Discount Cap]` (single select); cards `[Simulated Profit]`, `[Profit Uplift from Cap]` |
| Scatter | Details `DimProduct[SubCategory]`; X `[Discount %]`; Y `[Profit Margin %]`; size `[Total Sales]` |

## Page 3 · Customers: *"Are we growing the customer base?"*

| Visual | Fields |
|---|---|
| Stacked column | X `'Date'[Year Quarter]`; Y `[New Customers]`, `[Returning Customers]` |
| Cards | `[Customers]`, `[Repeat Customer Rate %]`, `[Sales per Customer]` |
| Bar | Y `DimCustomer[Segment]`; X `[Total Sales]`; tooltip `[Avg Order Value]` |

## Page 4 · Products: *"What sells?"*

| Visual | Fields |
|---|---|
| Slicer | `'Top N'[Top N]` (single select, default 10) |
| Table | `DimProduct[ProductName]`, `[Product Sales Rank]`, `[Top N Sales]`, `[Profit Margin %]`, `[% of Total Sales]`. Filter the visual on `[Top N Sales]` *is not blank* |
| Pareto chart (line & clustered column) | X `DimProduct[ProductName]` sorted by sales; columns `[Total Sales]`; line `[Cumulative Sales %]` with a constant line at 80% |
| Card | `[Products for 80% of Sales]` |

**Drill-through**: add `DimProduct[SubCategory]` to this page's drill-through well,
so right-clicking a sub-category on page 2 opens its products here.

## Page 5 · Targets: *"Are we hitting plan?"*

| Visual | Fields |
|---|---|
| Matrix | Rows `DimGeography[Region]`; columns `'Date'[Year Quarter]`; values `[Total Sales]`, `[Sales Target]`, `[% of Target]` (font colour = `[Target Status Color]`) |
| Bullet-style bar | Y `DimGeography[Region]`; X `[% of Target]` with constant line at 100% |
| Line | X `'Date'[Year Month]`; Y `[Sales YTD]`, `[Sales PYTD]` |

> Keep `[Sales Target]` off visuals at day, city or product level. The target
> grain is Month × Region × Category (see the note in `dax/05_targets_and_report_ui.dax`).

## Tooltip page

A small page (Page information → Allow use as tooltip, canvas 320×240) with
`[Total Sales]`, `[Sales YoY %]`, `[Profit Margin %]` and a mini line of
`[Total Sales]` by month. Assign it to the region bar and the margin matrix.

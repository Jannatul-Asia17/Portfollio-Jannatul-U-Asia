"""
Generate the sample "US superstore" dataset used by this Power BI / DAX project.

The data is synthetic but realistic: 3 years of orders (2023-2025) with growth,
seasonality, discount-driven losses, returns and monthly sales targets. A few
real-world data-quality problems are injected on purpose (duplicate rows,
untrimmed names, inconsistent casing) so the Power Query step has real work to do.

Run:  python scripts/generate_data.py      (writes CSVs into ./data)
"""
from __future__ import annotations

import csv
import math
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 21
OUT = Path(__file__).resolve().parents[1] / "data"
START, END = date(2023, 1, 1), date(2025, 12, 31)

rng = random.Random(SEED)

# ---------------------------------------------------------------- geography
GEOGRAPHY = {
    "West": [("Los Angeles", "California"), ("San Francisco", "California"), ("Seattle", "Washington"),
             ("Portland", "Oregon"), ("Denver", "Colorado"), ("Phoenix", "Arizona")],
    "East": [("New York City", "New York"), ("Philadelphia", "Pennsylvania"), ("Boston", "Massachusetts"),
             ("Columbus", "Ohio"), ("Newark", "New Jersey")],
    "Central": [("Chicago", "Illinois"), ("Houston", "Texas"), ("Dallas", "Texas"),
                ("Detroit", "Michigan"), ("Minneapolis", "Minnesota")],
    "South": [("Atlanta", "Georgia"), ("Miami", "Florida"), ("Nashville", "Tennessee"),
              ("Charlotte", "North Carolina"), ("New Orleans", "Louisiana")],
}
REGION_WEIGHT = {"West": 0.32, "East": 0.29, "Central": 0.23, "South": 0.16}
# Central runs aggressive promotions -> more (and deeper) discounts.
REGION_DISCOUNT_BIAS = {"West": 0.0, "East": 0.0, "Central": 0.12, "South": 0.04}
# West has the highest return rate.
REGION_RETURN_RATE = {"West": 0.12, "East": 0.07, "Central": 0.08, "South": 0.06}

# ---------------------------------------------------------------- products
# (category, sub-category, price range, cost ratio of list price, name stems)
CATALOG = [
    ("Furniture", "Chairs", (90, 650), 0.72, ["Ergo Task Chair", "Mesh Office Chair", "Executive Leather Chair", "Stacking Chair"]),
    ("Furniture", "Tables", (180, 1200), 0.80, ["Conference Table", "Adjustable Standing Desk", "Round Meeting Table"]),
    ("Furniture", "Bookcases", (80, 520), 0.75, ["5-Shelf Bookcase", "Corner Bookcase", "Barrister Bookcase"]),
    ("Furniture", "Furnishings", (8, 120), 0.55, ["Desk Lamp", "Wall Clock", "Frame Set", "Desk Organizer"]),
    ("Office Supplies", "Binders", (4, 60), 0.50, ["Ring Binder", "Presentation Binder", "Heavy-Duty Binder"]),
    ("Office Supplies", "Paper", (6, 45), 0.52, ["Copy Paper Ream", "Cardstock Pack", "Notebook Set"]),
    ("Office Supplies", "Storage", (15, 300), 0.66, ["File Cabinet", "Storage Box Set", "Rolling Cart"]),
    ("Office Supplies", "Art", (3, 40), 0.50, ["Marker Set", "Colored Pencils", "Sketch Pad"]),
    ("Office Supplies", "Appliances", (25, 400), 0.64, ["Desk Fan", "Paper Shredder", "Mini Fridge"]),
    ("Technology", "Phones", (60, 900), 0.70, ["Smartphone", "Conference Phone", "Cordless Phone"]),
    ("Technology", "Accessories", (10, 180), 0.55, ["Wireless Mouse", "Keyboard", "USB Hub", "Headset"]),
    ("Technology", "Machines", (150, 1500), 0.74, ["Laser Printer", "3D Printer", "Copier"]),
    ("Technology", "Copiers", (300, 1800), 0.62, ["Multifunction Copier", "High-Speed Copier"]),
]
BRANDS = ["Apex", "Northwind", "Contoso", "Fabrikam", "Lumen", "Vertex", "Orbit"]

SEGMENTS = [("Consumer", 0.52), ("Corporate", 0.30), ("Home Office", 0.18)]
SHIP_MODES = [("Standard Class", 0.60, (4, 7)), ("Second Class", 0.20, (2, 4)),
              ("First Class", 0.15, (1, 3)), ("Same Day", 0.05, (0, 0))]
FIRST = ["Aisha", "Ben", "Carla", "Dev", "Elena", "Farid", "Grace", "Hiro", "Ines", "Jamal", "Kira", "Leo",
         "Maya", "Nabil", "Olivia", "Priya", "Quinn", "Rafael", "Sara", "Tariq", "Uma", "Victor", "Wen", "Yusuf", "Zoe"]
LAST = ["Ahmed", "Brown", "Chen", "Diaz", "Evans", "Fischer", "Garcia", "Hassan", "Ito", "Johnson", "Khan",
        "Lopez", "Miller", "Nguyen", "Okafor", "Patel", "Rossi", "Smith", "Tanaka", "Walker", "Young"]

# Month seasonality and yearly growth
SEASON = {1: 0.80, 2: 0.70, 3: 1.00, 4: 0.90, 5: 0.95, 6: 0.95, 7: 0.90, 8: 0.95,
          9: 1.25, 10: 1.00, 11: 1.40, 12: 1.45}
YEAR_GROWTH = {2023: 1.00, 2024: 1.13, 2025: 1.31}
BASE_ORDERS_PER_DAY = 4.0


def weighted(choices):
    r, acc = rng.random(), 0.0
    for item, w in choices:
        acc += w
        if r <= acc:
            return item
    return choices[-1][0]


def poisson(lam):
    """Knuth's Poisson sampler (the stdlib random module has none)."""
    limit, k, p = math.exp(-lam), 0, 1.0
    while True:
        p *= rng.random()
        if p <= limit:
            return k
        k += 1


def make_products():
    rows, pid = [], 1
    for cat, sub, (lo, hi), cost_ratio, stems in CATALOG:
        for stem in stems:
            for brand in rng.sample(BRANDS, 3):
                price = round(rng.uniform(lo, hi), 2)
                rows.append({
                    "ProductID": f"P-{pid:04d}",
                    "ProductName": f"{brand} {stem}",
                    "SubCategory": sub,
                    "Category": cat,
                    "ListPrice": price,
                    "UnitCost": round(price * cost_ratio * rng.uniform(0.95, 1.05), 2),
                })
                pid += 1
    return rows


def make_geography():
    rows, gid = [], 1
    for region, cities in GEOGRAPHY.items():
        for city, state in cities:
            rows.append({"GeographyKey": gid, "City": city, "State": state, "Region": region, "Country": "United States"})
            gid += 1
    return rows


def make_customers(n=900):
    rows = []
    for i in range(1, n + 1):
        name = f"{rng.choice(FIRST)} {rng.choice(LAST)}"
        if rng.random() < 0.04:  # data-quality issue: stray whitespace
            name = f"  {name} "
        rows.append({"CustomerID": f"C-{i:05d}", "CustomerName": name, "Segment": weighted(SEGMENTS)})
    return rows


def pick_discount(category, region):
    base = {"Furniture": 0.35, "Office Supplies": 0.25, "Technology": 0.20}[category]
    p = min(base + REGION_DISCOUNT_BIAS[region], 0.9)
    if rng.random() > p:
        return 0.0
    deep = category == "Furniture" or region == "Central"
    levels = [0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50] if deep else [0.05, 0.10, 0.15, 0.20, 0.30]
    weights = [0.18, 0.22, 0.15, 0.20, 0.12, 0.08, 0.05] if deep else [0.25, 0.30, 0.20, 0.18, 0.07]
    return rng.choices(levels, weights)[0]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    products, geography, customers = make_products(), make_geography(), make_customers()
    geo_by_region = {r: [g for g in geography if g["Region"] == r] for r in GEOGRAPHY}
    cust_home = {c["CustomerID"]: weighted(list(REGION_WEIGHT.items())) for c in customers}
    # Customers "join" gradually, so New Customers is meaningful over time
    # (the first 60 are existing customers, so there is always someone to sell to)
    cust_start = {c["CustomerID"]: START if i < 60 else START + timedelta(days=int(rng.betavariate(1.1, 2.2) * 1000))
                  for i, c in enumerate(customers)}

    # Cheap items are bought far more often than expensive ones
    product_weights = [1 / p["ListPrice"] ** 0.6 for p in products]

    sales, returns, order_no = [], [], 1
    d = START
    while d <= END:
        n_orders = poisson(BASE_ORDERS_PER_DAY * SEASON[d.month] * YEAR_GROWTH[d.year])
        eligible = [c for c in customers if cust_start[c["CustomerID"]] <= d]
        for _ in range(n_orders):
            cust = rng.choice(eligible)
            region = cust_home[cust["CustomerID"]]
            geo = rng.choice(geo_by_region[region])
            mode, _, (dmin, dmax) = weighted([((m, w, r), w) for m, w, r in SHIP_MODES])
            ship = d + timedelta(days=rng.randint(dmin, dmax))
            order_id = f"US-{d.year}-{order_no:06d}"
            order_no += 1
            if rng.random() < 0.03:  # data-quality issue: inconsistent casing
                mode = mode.lower()
            for _ in range(rng.choices([1, 2, 3, 4, 5], [0.42, 0.28, 0.15, 0.10, 0.05])[0]):
                p = rng.choices(products, product_weights)[0]
                qty = rng.choices([1, 2, 3, 4, 5, 6, 7], [0.25, 0.25, 0.18, 0.13, 0.09, 0.06, 0.04])[0]
                disc = pick_discount(p["Category"], region)
                gross = round(p["ListPrice"] * qty, 2)
                sale = round(gross * (1 - disc), 2)
                cost = round(p["UnitCost"] * qty, 2)
                sales.append({
                    "OrderID": order_id, "OrderDate": d.isoformat(), "ShipDate": ship.isoformat(),
                    "ShipMode": mode, "CustomerID": cust["CustomerID"], "GeographyKey": geo["GeographyKey"],
                    "ProductID": p["ProductID"], "Quantity": qty, "GrossSales": gross, "Discount": disc,
                    "Sales": sale, "Cost": cost, "Profit": round(sale - cost, 2),
                })
            if rng.random() < REGION_RETURN_RATE[region]:
                returns.append({"OrderID": order_id, "Returned": "Yes"})
        d += timedelta(days=1)

    # data-quality issue: ~0.5% exact duplicate lines (a double-loaded extract)
    dupes = rng.sample(sales, k=len(sales) // 200)
    sales.extend(dupes)
    rng.shuffle(sales)

    # Monthly targets per Region x Category: prior-year actual * stretch, rounded
    actual = {}
    seen = set()
    geo_region = {g["GeographyKey"]: g["Region"] for g in geography}
    prod_cat = {p["ProductID"]: p["Category"] for p in products}
    for s in sales:
        key = tuple(s.values())
        if key in seen:
            continue
        seen.add(key)
        y, m = int(s["OrderDate"][:4]), int(s["OrderDate"][5:7])
        k = (y, m, geo_region[s["GeographyKey"]], prod_cat[s["ProductID"]])
        actual[k] = actual.get(k, 0) + s["Sales"]
    targets = []
    for (y, m, region, cat), v in sorted(actual.items()):
        if y == 2023:
            continue
        py = actual.get((y - 1, m, region, cat), v)
        stretch = rng.uniform(1.08, 1.20)
        targets.append({"MonthStart": date(y, m, 1).isoformat(), "Region": region, "Category": cat,
                        "SalesTarget": round(py * stretch, -2)})

    def write(name, rows):
        with open(OUT / name, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
        print(f"{name:<20} {len(rows):>7,} rows")

    write("fact_sales.csv", sales)
    write("dim_product.csv", products)
    write("dim_customer.csv", customers)
    write("dim_geography.csv", geography)
    write("returns.csv", returns)
    write("targets.csv", targets)


if __name__ == "__main__":
    main()

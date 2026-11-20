// ============================================================================
// FactSales: one row per order line (grain = OrderID x ProductID)
// Cleaning steps are listed in Applied Steps so a reviewer can audit them.
// ============================================================================
let
    Source = fnGetCsv("fact_sales.csv"),

    // Always type with an explicit culture so decimals parse the same on every PC
    Typed = Table.TransformColumnTypes(
        Source,
        {
            {"OrderID", type text}, {"OrderDate", type date}, {"ShipDate", type date},
            {"ShipMode", type text}, {"CustomerID", type text}, {"GeographyKey", Int64.Type},
            {"ProductID", type text}, {"Quantity", Int64.Type}, {"GrossSales", Currency.Type},
            {"Discount", type number}, {"Sales", Currency.Type}, {"Cost", Currency.Type},
            {"Profit", Currency.Type}
        },
        "en-US"
    ),

    // 1. Part of the extract was loaded twice: remove exact duplicate rows
    RemovedDuplicates = Table.Distinct(Typed),

    // 2. Ship mode arrives in mixed case ("standard class"): trim + Proper Case
    CleanShipMode = Table.TransformColumns(
        RemovedDuplicates,
        {{"ShipMode", each Text.Proper(Text.Trim(_)), type text}}
    ),

    // 3. Guard rails: keep only valid lines (none fail today, but future loads might)
    ValidRows = Table.SelectRows(
        CleanShipMode,
        each [Quantity] > 0 and [Sales] >= 0 and [ShipDate] >= [OrderDate]
    )
in
    ValidRows

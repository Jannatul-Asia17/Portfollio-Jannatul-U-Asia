// Targets: monthly sales target per Region x Category (2024-2025).
// Its grain (month / region / category) is coarser than FactSales, so it is
// NOT related to the model. The [Sales Target] measure maps it with TREATAS.
let
    Source = fnGetCsv("targets.csv"),
    Typed = Table.TransformColumnTypes(
        Source,
        {
            {"MonthStart", type date}, {"Region", type text},
            {"Category", type text}, {"SalesTarget", Currency.Type}
        },
        "en-US"
    )
in
    Typed

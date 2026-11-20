// DimCustomer: one row per customer
let
    Source = fnGetCsv("dim_customer.csv"),
    Typed = Table.TransformColumnTypes(
        Source,
        {{"CustomerID", type text}, {"CustomerName", type text}, {"Segment", type text}},
        "en-US"
    ),
    // Some names carry leading/trailing spaces, which break slicers and lookups
    TrimmedNames = Table.TransformColumns(Typed, {{"CustomerName", Text.Trim, type text}})
in
    TrimmedNames

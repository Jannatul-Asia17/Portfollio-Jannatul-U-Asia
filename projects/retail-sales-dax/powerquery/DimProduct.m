// DimProduct: one row per product (Category > SubCategory > ProductName hierarchy)
let
    Source = fnGetCsv("dim_product.csv"),
    Typed = Table.TransformColumnTypes(
        Source,
        {
            {"ProductID", type text}, {"ProductName", type text}, {"SubCategory", type text},
            {"Category", type text}, {"ListPrice", Currency.Type}, {"UnitCost", Currency.Type}
        },
        "en-US"
    )
in
    Typed

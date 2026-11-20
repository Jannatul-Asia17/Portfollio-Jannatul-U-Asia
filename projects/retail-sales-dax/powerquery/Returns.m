// Returns: list of returned orders. Deliberately NOT related to FactSales.
// The DAX measures connect it virtually with TREATAS (see dax/01_base_measures.dax).
let
    Source = fnGetCsv("returns.csv"),
    Typed = Table.TransformColumnTypes(Source, {{"OrderID", type text}, {"Returned", type text}}, "en-US"),
    OneRowPerOrder = Table.Distinct(Typed, {"OrderID"})
in
    OneRowPerOrder

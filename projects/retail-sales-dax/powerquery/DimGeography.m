// DimGeography: one row per city (Region > State > City hierarchy)
let
    Source = fnGetCsv("dim_geography.csv"),
    Typed = Table.TransformColumnTypes(
        Source,
        {
            {"GeographyKey", Int64.Type}, {"City", type text}, {"State", type text},
            {"Region", type text}, {"Country", type text}
        },
        "en-US"
    ),
    // Lets map visuals geocode unambiguously ("Portland, Oregon" vs "Portland, Maine")
    AddedCityState = Table.AddColumn(Typed, "City State", each [City] & ", " & [State], type text)
in
    AddedCityState

using System.Collections.Generic;


namespace btmc.src.alu
{
    using TypeEntry = KeyValuePair<Utils.TypeEnum, string>;

    public class Converter
    {
        public class TypeDict : List<TypeEntry> { };

        public static readonly TypeDict Type = new()
        {
            new(Utils.TypeEnum.DecimalNumber, "Decimal Number"),
            new(Utils.TypeEnum.SignedBTMC, "Signed BTMC"),
            new(Utils.TypeEnum.UnsignedBTMC, "Unsigned BTMC"),
            new(Utils.TypeEnum.Heptavintimal, "Heptavintimal")
        };
    }
};


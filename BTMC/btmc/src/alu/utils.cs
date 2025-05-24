using System;
using System.Collections.Generic;


namespace btmc.src.alu
{

    public class Utils
    {
        public enum TypeEnum
        {
            DecimalNumber,
            SignedBTMC,
            UnsignedBTMC,
            Heptavintimal
        }

        public struct TypePatternEntry
        {
            public Int16? length;
            public string regex;
            public string allowedChars;
        };

        public class TypePatternDict : Dictionary<TypeEnum, TypePatternEntry> { };


        // Patterns
        private static readonly TypePatternEntry _BALTERN_PATTERN = new()
        {
            length = Dict.REGISTRY_SIZE,
            regex = String.Format(@"^[{0}]+$", Dict.BALTERN_CHARS),
            allowedChars = String.Format(@"^[{0}]$", Dict.BALTERN_CHARS)
        };

        /// <summary>0908
        /// Dictionary: input type - pattern regex, value length and allowed chars for input types
        /// </summary>
        public static readonly TypePatternDict TypePattern = new()
        {
            { TypeEnum.SignedBTMC, _BALTERN_PATTERN },
            { TypeEnum.UnsignedBTMC, _BALTERN_PATTERN },
            { TypeEnum.DecimalNumber, new() { length = null, regex = @"^-?[0-9]+$", allowedChars = @"^[\-0-9]$" } },
            {
                TypeEnum.Heptavintimal,
                new() { length = Dict.HEPT_REGISTRY_SIZE, regex = String.Format(@"(?i)^[{0}]+$", Dict.HEPT_CHARS), allowedChars = String.Format(@"(?i)^[{0}]$", Dict.HEPT_CHARS) }
            },
        };
        // end of Patterns
    }
};


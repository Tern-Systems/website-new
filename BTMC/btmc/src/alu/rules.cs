using System;

namespace btmc.src.alu
{

    public class Dict
    {
        public static readonly Int16 BASE = 3;
        public static readonly Int16 REGISTRY_SIZE = 27;
        public static readonly Int16 HEPT_REGISTRY_SIZE = (Int16)(REGISTRY_SIZE / BASE);

        public static readonly string BALTERN_CHARS = @"+-0";
        public static readonly string HEPT_CHARS = @"0123456789abcdefghkmnprtvxz";
    }
};

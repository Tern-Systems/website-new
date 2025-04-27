using System;
using System.Collections.Generic;
using System.Linq;

namespace btmc.src.alu
{
    using OperationEntry = KeyValuePair<ALU.Operation, string>;

    public class ALU
    {
        public class OperationDict : List<Operation> { };

        public enum Operation : Int16
        {
            ADD,
            ADDIO,
            ADDO,
            AHIPC,
            AND,
            ANDI,
            DIV,
            MUL,
            MULO,
            NANDI,
            NEG,
            NORI,
            NOT,
            NSLL,
            NSLLI,
            NSRL,
            NSRLI,
            NXORI,
            OR,
            ORI,
            PANDI,
            PORI,
            PSLLI,
            PSRLI,
            PXORI,
            REM,
            SC,
            SCI,
            SCUI,
            SLL,
            SLLI,
            SRL,
            SRLI,
            SUB,
            SUBO,
            XOR,
            XORI,
            UADD,
            UADDI,
            UADDIO,
            UADDO,
            UDIV,
            UMUL,
            UMULO,
            UNEG,
            UREM,
            USUB,
            USUBO,
        };

        public static readonly List<OperationEntry> Operations = Enum.GetNames(typeof(Operation))
                   .Select(name => new OperationEntry(Enum.Parse<Operation>(name), name))
                   .ToList();
    }
};

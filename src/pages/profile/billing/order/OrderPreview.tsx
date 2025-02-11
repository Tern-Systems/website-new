import React, { FC, ReactElement } from "react";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import Image from "next/image";

import { Invoice } from "@/app/types/billing";

import { ScrollEnd } from "@/app/ui/misc";
import { Button } from "@/app/ui/form";

import SVG_TERN_LOGO from "/public/images/insignia-logo.png";
import SVG_DOCUMENT from "/public/images/document.svg";

const BTN_CN =
  "flex-grow px-[min(4.5dvw,1rem)] w-full max-w-[21rem] rounded-full py-[min(4.5dvw,1rem)]";

interface Props {
  invoice: Invoice | null;
  card: string;
  invoiceDate: string;
  VisibilityToggle: ReactElement;
  className?: string;
  toPDFReceipt: () => void;
}

const OrderPreview: FC<Props> = (props: Props) => {
  const {
    toPDFReceipt,
    invoice,
    className,
    VisibilityToggle,
    card,
    invoiceDate,
  } = props;
  const { toPDF, targetRef } = usePDF({
    filename: "invoice.pdf",
    method: "open",
    page: { margin: Margin.LARGE },
    resolution: Resolution.NORMAL,
  });

  return (
    <div className={`relative shadow-2xl ${className}`}>
      <div
        className={
          "min-w-[min(100%,53rem)] px-[min(5.3dvw,6.6rem)] place-self-center"
        }
      >
        <div ref={targetRef}>
          <h2
            className={`mb-[min(10.7dvw,5.25rem)] font-bold text-heading-l flex gap-[0.92rem] text-nowrap items-center`}
          >
            <Image
              src={SVG_TERN_LOGO}
              alt={"tern-logo"}
              className={"w-[2.48rem] h-auto sm:hidden"}
            />
            Tern Systems, LLC
          </h2>
          <div className={"text-center font-bold mb-[min(8dvw,1.5rem)]"}>
            <Image
              src={SVG_DOCUMENT}
              alt={"document"}
              className={"w-[min(24.7dvw,5.4rem)] h-auto place-self-center"}
            />
            <span className={"block text-heading-s my-s"}>
              Invoice {invoice?.status ?? "--"}
            </span>
            <span className={"block text-[3rem]"}>
              ${invoice?.subtotalUSD.toFixed(2) ?? "--"}
            </span>
          </div>

          <div
            className={`grid text-[min(4.8dvw,var(--fz-content-))] gap-y-[min(5.3dvw,1.9rem)] grid-cols-[minmax(0,1fr),minmax(0,max-content)]`}
          >
            <span>Status</span>
            <span className={"text-right capitalize"}>
              {invoice?.status ?? "--"}
            </span>
            <span>Order (invoice) number</span>
            <span className={"text-right"}>{invoice?.id ?? "--"}</span>
            <span>Payment date</span>
            <span className={"text-right"}>{invoiceDate}</span>
            <span>Payment methods</span>
            <span className={`capitalize text-right`}>{card}</span>
          </div>
        </div>

        <div
          className={`text-heading-s font-bold mt-xl flex gap-x-[0.75rem] justify-center items-center
                                    sm:flex-col sm:gap-y-[4dvw]`}
        >
          <Button
            icon={"download"}
            className={`[&_path]:fill-gray border-s border-gray ${BTN_CN}`}
            onClick={() => toPDF({})}
          >
            Download Invoice
          </Button>
          <Button
            icon={"download"}
            className={`[&_path]:fill-primary bg-gray text-primary ${BTN_CN}`}
            onClick={() => toPDFReceipt()}
          >
            Download Receipt
          </Button>
        </div>

        {VisibilityToggle}
      </div>
      <ScrollEnd />
    </div>
  );
};

export { OrderPreview };

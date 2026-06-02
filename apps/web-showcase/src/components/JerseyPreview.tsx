import Layer from "./Layer";

interface Props {
  bodyColor: string;
  sleeveColor: string;
  collarColor: string;
  stripeColor: string;
}

export default function JerseyPreview({
  bodyColor,
  sleeveColor,
  collarColor,
  stripeColor,
}: Props) {
  return (
    <div className="relative w-[650px] h-[650px]">

      <Layer
        src="/products/tshirt/01---Body.png"
        color={bodyColor}
      />

      <Layer
        src="/products/tshirt/02---Body-Stripe-.png"
        color={stripeColor}
      />

      <Layer
        src="/products/tshirt/05---Left-Set-Sleeve.png"
        color={sleeveColor}
      />

      <Layer
        src="/products/tshirt/04---Right-Set-Sleeve.png"
        color={sleeveColor}
      />

      <Layer
        src="/products/tshirt/06---Round-Neck.png"
        color={collarColor}
      />

      <img
        src="/products/tshirt/03---Number-Panel.png"
        className="absolute inset-0 w-full h-full"
      />

      <img
        src="/products/tshirt/07---Zapkam.png"
        className="absolute inset-0 w-full h-full"
      />

      <img
        src="/products/tshirt/08---ZK.png"
        className="absolute inset-0 w-full h-full"
      />

    </div>
  );
}
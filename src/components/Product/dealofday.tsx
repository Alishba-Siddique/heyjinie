// components/DealOfDay.tsx

interface DealOfDayProps {
  productImage: string;
  productName: string;
  backgroundColor?: string; // Optional prop for background color
}

export default function DealOfDay({
  productImage,
  productName,
  backgroundColor,
}: DealOfDayProps) {
  return (
    <div>
      <br /> <br />
      <div className="at-pagesectiontitle ">
        <h2>Deal of the Day</h2>
      </div>
      <div
        className="at-dealoftheday w-full h-auto p-4 flex items-center justify-around"
        // style={{
        //   background:
        //     'linear-gradient(180deg, #88C1FD 0%, #3B6EA6 50%, #88C0FC 100%)',
        //   borderRadius: '12px',
        // }}
        style={{
          background: `linear-gradient(180deg, ${backgroundColor} 0%, ${backgroundColor}  50%, ${backgroundColor}  100%)`,
          borderRadius: '12px',
        }}
      >
        <div className="flex flex-col gap-y-12 ml-24">
          <h4 className="text-white font-black text-5xl mt-2 ">
            {productName}
          </h4>
          <p className="text-white text-2xl">Just in time for the Holidays</p>
        </div>
        <figure>
          <img
            className="at-dealtitleimg"
            src={productImage}
            alt={productName}
          />
        </figure>
      </div>
    </div>
  );
}

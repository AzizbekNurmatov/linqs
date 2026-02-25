function Highlighter({ children, colorClass = 'bg-lime-300' }) {
  return (
    <span className={`${colorClass} px-1 text-black`}>
      {children}
    </span>
  );
}

function GiantReceipt() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const line = (label, value, extraClasses = '') => (
    <div className={`flex items-baseline justify-between w-full ${extraClasses}`}>
      <span className="tracking-tight">{label}</span>
      <span className="flex-1 border-b border-dotted border-black mx-2" />
      <span className="tracking-tight text-right">{value}</span>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto font-mono uppercase text-black">
      <div className="relative bg-[#f8f8f4] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 pb-10">
        {/* Header */}
        <div className="text-center mb-4 space-y-1">
          <div className="text-xs tracking-[0.2em]">
            *** <Highlighter>LINQS</Highlighter> SECURE TRANSACTION ***
          </div>
          <div className="text-[10px] tracking-[0.2em]">
            Date: {formattedDate}
          </div>
          <div className="text-[10px] tracking-[0.2em]">
            Loc: Charleston, SC
          </div>
        </div>

        <div className="border-b-2 border-dashed border-black mb-4" />

        {/* Items */}
        <div className="space-y-2 text-xs relative">
          {line(
            <>
              1x <Highlighter colorClass="bg-lime-300">Underground Vinyl Mkt</Highlighter>
            </>,
            <span className="font-bold tracking-tight">FREE</span>
          )}
          {line(
            <>
              1x <Highlighter colorClass="bg-yellow-300">C You At The Cistern!</Highlighter>
            </>,
            'FREE'
          )}
          {line(
            <>
              1x <Highlighter colorClass="bg-pink-400">Global Game Jam</Highlighter>
            </>,
            'FREE'
          )}

          {/* Hand-drawn circle around first FREE */}
          <div className="pointer-events-none absolute right-0 top-0 translate-x-5 translate-y-1">
            <div className="w-20 h-9 border-[3px] border-lime-400 rounded-[55%_45%_60%_40%/50%_60%_40%_50%] -rotate-12" />
          </div>
        </div>

        <div className="border-b-2 border-dashed border-black my-4" />

        {/* Totals */}
        <div className="space-y-2 text-xs">
          {line('Subtotal', '3 Plans')}
          {line('Fomo Tax', '$0.00')}
          <div className="mt-2">
            {line(
              'Total',
              <Highlighter>One Hell Of A Night</Highlighter>,
              'text-sm md:text-base font-bold'
            )}
          </div>
        </div>

        {/* Torn bottom effect */}
        <div className="absolute left-0 right-0 -bottom-2 h-4 border-b-8 border-dashed border-black" />
      </div>

      {/* Barcode + Footer */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-end h-10 bg-transparent px-2 border-y border-black">
          <div className="bg-black w-[2px] h-8 mx-[1px]" />
          <div className="bg-black w-1 h-10 mx-[1px]" />
          <div className="bg-black w-[3px] h-7 mx-[1px]" />
          <div className="bg-black w-[2px] h-9 mx-[1px]" />
          <div className="bg-black w-0.5 h-6 mx-[1px]" />
          <div className="bg-black w-[3px] h-10 mx-[2px]" />
          <div className="bg-black w-[1px] h-7 mx-[1px]" />
          <div className="bg-black w-[2px] h-9 mx-[1px]" />
          <div className="bg-black w-1 h-6 mx-[1px]" />
          <div className="bg-black w-[3px] h-10 mx-[1px]" />
          <div className="bg-black w-[1px] h-8 mx-[1px]" />
          <div className="bg-black w-[2px] h-9 mx-[1px]" />
          <div className="bg-black w-0.5 h-7 mx-[1px]" />
          <div className="bg-black w-[3px] h-10 mx-[2px]" />
          <div className="bg-black w-[1px] h-8 mx-[1px]" />
          <div className="bg-black w-[2px] h-9 mx-[1px]" />
        </div>
        <div className="text-[10px] tracking-[0.2em] text-center mt-1">
          Thank You For Touching Grass.
        </div>
      </div>
    </div>
  );
}

export default GiantReceipt;


import imgRectangle9 from "figma:asset/419f8e2ca2119256a91efcaca73ebfd464481ea4.png";

export default function Group() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[753px] left-0 rounded-[25px] top-0 w-[435px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[25px] size-full" src={imgRectangle9.src} />
      </div>
      <div className="absolute h-[753px] left-0 rounded-[25px] top-0 w-[435px]" style={{ backgroundImage: "linear-gradient(178.943deg, rgba(0, 0, 0, 0) 17.414%, rgba(0, 0, 0, 0.43) 68.062%, rgb(0, 0, 0) 131.38%)" }} />
      <p className="absolute font-['Poppins:SemiBold',sans-serif] leading-[35px] left-[25px] not-italic text-[#e5e5e5] text-[25px] top-[567px] w-[110px] whitespace-pre-wrap">Apply</p>
      <p className="absolute font-['Poppins:Regular',sans-serif] h-[88px] leading-[30px] left-[calc(50%-192.5px)] not-italic text-[20px] text-[rgba(229,229,229,0.75)] top-[612px] w-[324px] whitespace-pre-wrap">Add a small drop of Mr. Kitchen Charcoal Dishwash Gel onto a wet sponge.</p>
    </div>
  );
}
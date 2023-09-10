import prisma from "@/prisma/prisma";
import Cabinet from "@/components/Cabinet";

export default async function Home() {
  const cabinetsWithBatteries = await prisma.cabinet.findMany({
    include: {
      batteries: true,
    },
  });

  return (
    <div className="p-5 text-sm">
      <div className="text-lg font-semibold mb-2">Cabinets</div>
      <div className="grid grid-cols-3 gap-2">
        {cabinetsWithBatteries.map((x, i) => (
          <Cabinet data={x} key={i} />
        ))}
      </div>
      <div className="text-lg font-semibold my-2">Rentals</div>
      <div>

      </div>
    </div>
  );
}

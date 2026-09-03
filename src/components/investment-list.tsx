import Link from "next/link";
import { investments } from "@/content/investments";

export default function InvestmentList() {
  return (
    <ul className="space-y-5">
      {investments.map((investment) => (
        <li key={investment.name}>
          <div className="flex flex-col md:flex-row md:items-baseline">
            <Link
              href={investment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-medium text-blue-600 hover:text-blue-800"
            >
              {investment.name}
            </Link>
            {investment.badge && (
              <span className="self-start md:self-auto mt-1 md:mt-0 md:ml-2 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 whitespace-nowrap">
                {investment.badge}
              </span>
            )}
            <div className="hidden md:block h-[1px] border-t border-dashed border-gray-300 flex-1 mx-2"></div>
            <span className="text-lg text-gray-700">
              {investment.description}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

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

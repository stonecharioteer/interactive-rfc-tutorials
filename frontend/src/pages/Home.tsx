import { Link } from "react-router-dom";
import { rfcs, rfcEras } from "../data/rfcs";
import { CheckCircle2, FileText, Clock, Award } from "lucide-react";
import RfcBadge from "../components/RfcBadge";

export default function Home() {
  const completedRfcs = JSON.parse(
    localStorage.getItem("rfc-progress") || "[]",
  );

  const getEraRfcs = (era: string) => rfcs.filter((rfc) => rfc.era === era);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          Learn the RFCs That Built the Internet
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Interactive tutorials for understanding the key protocols and
          standards that power our connected world. Progress through the eras of
          internet development, from TCP/IP to modern web standards.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <Award className="h-8 w-8 text-rfc-blue mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">21 Key RFCs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Carefully selected protocols that shaped the internet
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-rfc-green mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">Self-Paced</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn at your own speed with progress tracking
            </p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-rfc-amber mx-auto" />
            <h3 className="mt-2 font-semibold dark:text-white">
              Mobile Friendly
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Study on any device, anywhere
            </p>
          </div>
        </div>
      </div>

      {/* RFC Timeline by Era */}
      {Object.entries(rfcEras).map(([eraKey, era]) => {
        const eraRfcs = getEraRfcs(eraKey);
        if (eraRfcs.length === 0) return null;

        return (
          <div key={eraKey} className="space-y-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-white ${era.color}`}
              >
                <h2 className="text-2xl font-bold">{era.name}</h2>
                <span className="ml-3 text-sm opacity-90">{era.period}</span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {era.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eraRfcs.map((rfc) => {
                const isCompleted = completedRfcs.includes(rfc.number);

                return (
                  <Link
                    key={rfc.number}
                    to={`/rfc/${rfc.number}`}
                    className="rfc-card hover:scale-105 transform transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        )}
                        <RfcBadge
                          number={rfc.number}
                          size="sm"
                          variant="minimal"
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {rfc.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {rfc.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {rfc.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Progress
        </h2>
        <div className="flex items-center justify-center space-x-8">
          <div>
            <div className="text-3xl font-bold text-rfc-blue">
              {completedRfcs.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Completed
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-400 dark:text-gray-400">
              {rfcs.length - completedRfcs.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Remaining
            </div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-rfc-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedRfcs.length / rfcs.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

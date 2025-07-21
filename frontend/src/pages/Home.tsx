import { Link } from "react-router-dom";
import { rfcs, rfcEras } from "../data/rfcs";
import { CheckCircle2, Circle, Clock, Award } from "lucide-react";

export default function Home() {
  const completedRfcs = JSON.parse(
    localStorage.getItem("rfc-progress") || "[]",
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getEraRfcs = (era: string) => rfcs.filter((rfc) => rfc.era === era);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Learn the RFCs That Built the Internet
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
          Interactive tutorials for understanding the key protocols and
          standards that power our connected world. Progress through the eras of
          internet development, from TCP/IP to modern web standards.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <Award className="h-8 w-8 text-rfc-blue mx-auto" />
            <h3 className="mt-2 font-semibold">21 Key RFCs</h3>
            <p className="text-sm text-gray-600">
              Carefully selected protocols that shaped the internet
            </p>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-rfc-green mx-auto" />
            <h3 className="mt-2 font-semibold">Self-Paced</h3>
            <p className="text-sm text-gray-600">
              Learn at your own speed with progress tracking
            </p>
          </div>
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 text-rfc-amber mx-auto" />
            <h3 className="mt-2 font-semibold">Mobile Friendly</h3>
            <p className="text-sm text-gray-600">
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
              <p className="mt-2 text-gray-600">{era.description}</p>
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
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-500">
                          RFC {rfc.number}
                        </span>
                      </div>
                      <span
                        className={`rfc-era-badge ${getPriorityColor(
                          rfc.priority,
                        )}`}
                      >
                        {rfc.priority}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {rfc.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {rfc.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{rfc.year}</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {rfc.estimatedTime}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Progress Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Progress</h2>
        <div className="flex items-center justify-center space-x-8">
          <div>
            <div className="text-3xl font-bold text-rfc-blue">
              {completedRfcs.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-400">
              {rfcs.length - completedRfcs.length}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-rfc-blue h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedRfcs.length / rfcs.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

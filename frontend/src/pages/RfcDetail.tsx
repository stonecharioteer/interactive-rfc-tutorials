import { useParams, Link } from "react-router-dom";
import { rfcs } from "../data/rfcs";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  ExternalLink,
} from "lucide-react";
import RfcBadge from "../components/RfcBadge";
import RFC1 from "./rfcs/RFC1";
import RFC675 from "./rfcs/RFC675";
import RFC791 from "./rfcs/RFC791";
import RFC793 from "./rfcs/RFC793";
import RFC821 from "./rfcs/RFC821";
import RFC959 from "./rfcs/RFC959";
import RFC1034 from "./rfcs/RFC1034";
import RFC1035 from "./rfcs/RFC1035";
import RFC1390 from "./rfcs/RFC1390";

// Map RFC numbers to their components
const rfcComponents: Record<number, React.ComponentType> = {
  1: RFC1,
  675: RFC675,
  791: RFC791,
  793: RFC793,
  821: RFC821,
  959: RFC959,
  1034: RFC1034,
  1035: RFC1035,
  1390: RFC1390,
};

export default function RfcDetail() {
  const { number } = useParams<{ number: string }>();
  const rfcNumber = parseInt(number || "0");
  const rfc = rfcs.find((r) => r.number === rfcNumber);
  const RfcComponent = rfcComponents[rfcNumber];

  if (!rfc || !RfcComponent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          RFC Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The RFC you're looking for doesn't exist or hasn't been implemented
          yet.
        </p>
        <Link
          to="/"
          className="bg-rfc-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const completedRfcs = JSON.parse(
    localStorage.getItem("rfc-progress") || "[]",
  );
  const isCompleted = completedRfcs.includes(rfcNumber);

  const toggleComplete = () => {
    const completed = JSON.parse(localStorage.getItem("rfc-progress") || "[]");
    let updated;

    if (isCompleted) {
      updated = completed.filter((n: number) => n !== rfcNumber);
    } else {
      updated = [...completed, rfcNumber];
    }

    localStorage.setItem("rfc-progress", JSON.stringify(updated));
    window.location.reload(); // Simple refresh to update state
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-rfc-blue hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Timeline
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <RfcBadge number={rfc.number} size="md" variant="badge" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {rfc.title}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {rfc.rfcUrl && (
                <a
                  href={rfc.rfcUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Read RFC Text</span>
                </a>
              )}

              <button
                onClick={toggleComplete}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isCompleted
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/40"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {rfc.description}
          </p>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Published {rfc.year}</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Learning Objectives
            </h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
              {rfc.learningObjectives.map((objective, index) => (
                <li key={index} className="text-sm">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RFC Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <RfcComponent />
      </div>
    </div>
  );
}

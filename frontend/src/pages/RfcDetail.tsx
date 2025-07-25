import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { rfcs } from "../data/rfcs";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  ExternalLink,
} from "lucide-react";
import RfcBadge from "../components/RfcBadge";
import TagBadge from "../components/TagBadge";
import { visitHistoryUtils } from "../utils/visitHistory";
import RFC1 from "./rfcs/RFC1";
import RFC675 from "./rfcs/RFC675";
import RFC791 from "./rfcs/RFC791";
import RFC793 from "./rfcs/RFC793";
import RFC821 from "./rfcs/RFC821";
import RFC959 from "./rfcs/RFC959";
import RFC1034 from "./rfcs/RFC1034";
import RFC1035 from "./rfcs/RFC1035";
import RFC1390 from "./rfcs/RFC1390";
import RFC1945 from "./rfcs/RFC1945";
import RFC2068 from "./rfcs/RFC2068";
import RFC2401 from "./rfcs/RFC2401";
import RFC2460 from "./rfcs/RFC2460";
import RFC2547 from "./rfcs/RFC2547";
import RFC2684 from "./rfcs/RFC2684";
import RFC5389 from "./rfcs/RFC5389";
import RFC7748 from "./rfcs/RFC7748";
import RFC8439 from "./rfcs/RFC8439";
import RFC8445 from "./rfcs/RFC8445";
import RFC4301 from "./rfcs/RFC4301";
import RFC4303 from "./rfcs/RFC4303";
import RFC8656 from "./rfcs/RFC8656";
import RFC4787 from "./rfcs/RFC4787";
import RFC4364 from "./rfcs/RFC4364";
import RFC7540 from "./rfcs/RFC7540";
import RFC9110 from "./rfcs/RFC9110";
import RFC9111 from "./rfcs/RFC9111";
import RFC9112 from "./rfcs/RFC9112";
import RFC9113 from "./rfcs/RFC9113";
import RFC9114 from "./rfcs/RFC9114";

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
  1945: RFC1945,
  2068: RFC2068,
  2401: RFC2401,
  2460: RFC2460,
  2547: RFC2547,
  2684: RFC2684,
  5389: RFC5389,
  7748: RFC7748,
  8439: RFC8439,
  8445: RFC8445,
  4301: RFC4301,
  4303: RFC4303,
  8656: RFC8656,
  4787: RFC4787,
  4364: RFC4364,
  7540: RFC7540,
  9110: RFC9110,
  9111: RFC9111,
  9112: RFC9112,
  9113: RFC9113,
  9114: RFC9114,
};

export default function RfcDetail() {
  const { number } = useParams<{ number: string }>();
  const rfcNumber = parseInt(number || "0");
  const rfc = rfcs.find((r) => r.number === rfcNumber);
  const RfcComponent = rfcComponents[rfcNumber];

  // Scroll to top and record visit when component mounts or RFC changes
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Record the visit if RFC exists and component is loaded
    if (rfc && RfcComponent) {
      visitHistoryUtils.recordVisit(rfcNumber);
    }
  }, [rfcNumber, rfc, RfcComponent]);

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

          {rfc.tags && rfc.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {rfc.tags.map((tagId) => (
                  <TagBadge 
                    key={tagId} 
                    tagId={tagId} 
                    size="md" 
                    showTooltip={true}
                  />
                ))}
              </div>
            </div>
          )}

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

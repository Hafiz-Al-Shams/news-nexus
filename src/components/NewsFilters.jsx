"use client";

export default function NewsFilters({
  currentLocation,
  currentTime,
  currentTopic,
  onLocationChange,
  onTimeChange,
  onTopicChange,
}) {
  const locations = [
    { value: "world", label: "🌍 World", icon: "🌍" },
    { value: "asia", label: "🌏 Asia", icon: "🌏" },
    { value: "europe", label: "🇪🇺 Europe", icon: "🇪🇺" },
    { value: "america", label: "🌎 America", icon: "🌎" },
  ];

  const times = [
    { value: "1h", label: "Last Hour" },
    { value: "6h", label: "Last 6 Hours" },
    { value: "12h", label: "Last 12 Hours" },
    { value: "24h", label: "Last 24 Hours" },
  ];

  const topics = [
    { value: "general", label: "📰 All Topics" },
    { value: "science", label: "🔬 Science" },
    { value: "technology", label: "💻 Technology" },
    { value: "business", label: "💼 Business" },
    { value: "sports", label: "⚽ Sports" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "health", label: "🏥 Health" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter News</h2>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {locations.map((loc) => (
            <button
              key={loc.value}
              onClick={() => onLocationChange(loc.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentLocation === loc.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Range
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {times.map((t) => (
            <button
              key={t.value}
              onClick={() => onTimeChange(t.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTime === t.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {topics.map((topic) => (
            <button
              key={topic.value}
              onClick={() => onTopicChange(topic.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTopic === topic.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
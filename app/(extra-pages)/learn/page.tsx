"use client";

const videos = [
  {
    id: "dEGogMh9Tzs",
    title: "NEW SERIES: Chess Steps!",
  },
  {
    id: "ScY7qXkmTwA",
    title: "CHESS STEPS #2 (600-1000)",
  },
  {
    id: "ghJRGPXsjfk",
    title: "CHESS STEPS #3 (1000-1400)",
  },
  {
    id: "MfP8odZAu5o",
    title: "CHESS STEPS #4 (1400-1600)",
  },
  {
    id: "wdtv_z9BEcQ",
    title: "Win At Chess #21 (1200-2000 ELO)",
  },
];

export default function Learn() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Learn Chess</h1>
      <p className="text-gray-600 mb-6">
        Boost your skills with these curated videos:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="w-full object-cover"
            />
            <div className="p-3">
              <h2 className="font-semibold text-lg">{video.title}</h2>
              <p className="text-sm text-blue-600">Watch on YouTube</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

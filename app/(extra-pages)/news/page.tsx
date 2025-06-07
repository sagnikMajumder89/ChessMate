"use client";

const mockNews = [
  {
    title: "Grandmaster Showdown Ends in a Draw",
    subtitle: "Top players clash in thrilling finale",
    content:
      "The final round of the World Chess Championship concluded with a tense draw after a 6-hour battle. Both players showed incredible strategy and resilience.",
    picture:
      "https://dtnext-prod-new.s3.ap-south-1.amazonaws.com/h-upload/2025/05/20/750x450_864789-carlsen.jpg",
  },
  {
    title: "AI Beats Human in Blitz Match",
    subtitle: "Tech vs. Talent",
    content:
      "In a stunning turn of events, a custom AI bot defeated a top-rated blitz player 3-2 in a friendly online match. The future of chess just got faster.",
    picture:
      "https://i0.wp.com/crafter.ai/wp-content/uploads/2021/01/intelligenza_artificiale_negli_scacchi_garry-kasparov-deep-blue-ibm-1.jpg?resize=700%2C394&ssl=1",
  },
  {
    title: "New Rules Proposed for Rapid Chess",
    subtitle: "Shorter clocks, faster decisions",
    content:
      "FIDE has proposed new rule changes for rapid chess formats, potentially reducing clock times to add more thrill and unpredictability to the game.",
    picture:
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80",
  },
];

export default function News() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chess News</h1>
      <div className="flex flex-col gap-6">
        {mockNews.map((news, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-4 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <img
              src={news.picture}
              alt={news.title}
              className="w-full md:w-60 h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold">{news.title}</h2>
                <h3 className="text-gray-500 text-sm mb-2">{news.subtitle}</h3>
                <p className="text-gray-700 text-sm">{news.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

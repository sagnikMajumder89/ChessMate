"use client";

const chessChannels = [
  {
    name: "GothamChess",
    description:
      "Levy Rozman brings chess content for all levels with humor and strategy.",
    url: "https://www.youtube.com/@GothamChess",
    thumbnail:
      "https://yt3.googleusercontent.com/ytc/AIdro_lJ4RQwl-WnWQ_3AgLxvPrLkVdfLHPCRKMxUtLJnjUkhkg=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "ChessBase India",
    description:
      "India's biggest chess channel, covering players, events, and tutorials.",
    url: "https://www.youtube.com/@ChessBaseIndiachannel",
    thumbnail:
      "https://yt3.googleusercontent.com/pnnpYas2rBs_QNa3008tPHwwqJ8L2dtww75n4CVLlsuyX7CJC4vTrPMbVssf_Jh3k0C30CjjEh0=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Hikaru Nakamura",
    description:
      "Grandmaster Hikaru shares high-level play, banter, and deep analysis.",
    url: "https://www.youtube.com/@GMHikaru",
    thumbnail:
      "https://yt3.googleusercontent.com/GBQB7uZvLvAOuzFArzoAiJsas5HW7dcsExeqERP_ORGwx7vSWyjTdbC97qMWzePvfiyufsNyods=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "ChessNetwork",
    description: "Educational chess videos and commentary from Jerry.",
    url: "https://www.youtube.com/@ChessNetwork",
    thumbnail:
      "https://yt3.googleusercontent.com/ytc/AIdro_kpXOCsH1r2ozc5BhHE8jyaUvko4XY98OAdzS-MuETTpyQ=s160-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "agadmator’s Chess Channel",
    description:
      "Antonio analyzes historical and modern games with clarity and charm.",
    url: "https://www.youtube.com/@agadmator",
    thumbnail:
      "https://yt3.googleusercontent.com/ytc/AIdro_nu8s0QqnZsbo5bqcCxd7IkKfyacCgItwcLgLyUpPfCR1w=s160-c-k-c0x00ffffff-no-rj",
  },
];

export default function Watch() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Watch Chess Content</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chessChannels.map((channel, index) => (
          <a
            key={index}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center p-4 border rounded-xl shadow-sm hover:shadow-md transition hover:bg-secondary"
          >
            <img
              src={channel.thumbnail}
              alt={channel.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{channel.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

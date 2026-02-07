import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - PlaylistCoPilot",
  description: "Tips and guides for playlist management across streaming platforms",
}

// This would typically come from a CMS or MDX files
const posts = [
  {
    slug: "how-to-transfer-playlists",
    title: "How to Transfer Playlists Between Platforms",
    excerpt: "A complete guide to moving your music library from one service to another without losing your favorite tracks.",
    date: "2024-01-15",
    category: "Guides",
  },
  {
    slug: "youtube-vs-youtube-music",
    title: "YouTube vs YouTube Music: What's the Difference?",
    excerpt: "Understanding how playlists work across Google's video and music platforms.",
    date: "2024-01-10",
    category: "Tips",
  },
  {
    slug: "why-spotify-deezer-delay",
    title: "Why Spotify and Deezer Are Taking Time",
    excerpt: "An honest look at the challenges of building apps for major music platforms.",
    date: "2024-01-05",
    category: "News",
  },
]

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">PlaylistCoPilot Blog</h1>
        <p className="text-xl text-gray-600">
          Tips, guides, and updates for playlist management
        </p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
              <span>•</span>
              <time>{new Date(post.date).toLocaleDateString()}</time>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

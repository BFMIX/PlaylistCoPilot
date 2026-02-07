import { Metadata } from "next"
import { notFound } from "next/navigation"

interface Props {
  params: { slug: string }
}

// This would typically fetch from MDX files or CMS
const posts: Record<string, { title: string; content: string; date: string }> = {
  "how-to-transfer-playlists": {
    title: "How to Transfer Playlists Between Platforms",
    date: "2024-01-15",
    content: `
# How to Transfer Playlists Between Platforms

Moving your music library from one streaming service to another can be frustrating. Here's how to do it efficiently.

## The Manual Way

1. Export your playlist as CSV or text
2. Match tracks on the new platform
3. Recreate the playlist manually

## The Better Way

Use PlaylistCoPilot to automate the process. Simply:
- Connect your source platform
- Select the playlist
- Preview the matches
- Sync to your destination

## Supported Platforms

Currently, we support YouTube fully, with Spotify and Deezer coming soon.
    `,
  },
  "youtube-vs-youtube-music": {
    title: "YouTube vs YouTube Music",
    date: "2024-01-10",
    content: `
# YouTube vs YouTube Music: What's the Difference?

Many users are confused about the relationship between YouTube and YouTube Music playlists.

## The Connection

YouTube Music doesn't have a separate public API. Instead, it uses YouTube's infrastructure:
- Playlists you create on YouTube appear in YouTube Music
- Music videos on YouTube are treated as songs in YouTube Music

## What This Means

When you sync to "YouTube", your playlists automatically appear in YouTube Music if you have the app.
    `,
  },
  "why-spotify-deezer-delay": {
    title: "Why Spotify and Deezer Are Taking Time",
    date: "2024-01-05",
    content: `
# Why Spotify and Deezer Are Taking Time

We've been asked why Spotify and Deezer support isn't available yet. Here's the honest answer.

## The Approval Process

Both platforms require app approval before we can access their APIs:
- Spotify has temporarily paused new app approvals
- Deezer has a backlog of developer applications

## Our Approach

Rather than using unofficial methods (which could break or violate terms), we're waiting for proper approval. This ensures a reliable, long-term solution.
    `,
  },
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts[params.slug]
  if (!post) return { title: "Not Found" }
  
  return {
    title: `${post.title} - PlaylistCoPilot Blog`,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = posts[params.slug]
  
  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <article className="prose prose-lg max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <time className="text-gray-500">{new Date(post.date).toLocaleDateString()}</time>
        </header>
        <div className="whitespace-pre-wrap">{post.content}</div>
      </article>
      
      <div className="mt-12 pt-8 border-t">
        <a href="/blog" className="text-blue-600 hover:underline">← Back to blog</a>
      </div>
    </div>
  )
}

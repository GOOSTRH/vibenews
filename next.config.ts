/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Global tech sites
      { protocol: 'https', hostname: '**.techcrunch.com' },
      { protocol: 'https', hostname: '**.technologyreview.com' },
      { protocol: 'https', hostname: '**.wired.com' },
      { protocol: 'https', hostname: '**.arstechnica.net' },
      { protocol: 'https', hostname: '**.theverge.com' },
      { protocol: 'https', hostname: 'cdn.vox-cdn.com' },
      { protocol: 'https', hostname: 'platform.theverge.com' },
    
      // Korean news sources
      { protocol: 'https', hostname: '**.koreatimes.co.kr' },
      { protocol: 'https', hostname: '**.koreaherald.com' },
      { protocol: 'https', hostname: '**.zdnet.co.kr' },
      { protocol: 'https', hostname: '**.aitimes.kr' },
    
      // Japanese news sources
      { protocol: 'https', hostname: '**.japantimes.co.jp' },
      { protocol: 'https', hostname: '**.nikkei.com' },
      { protocol: 'https', hostname: '**.japantoday.com' },
      { protocol: 'https', hostname: '**.kyodonews.net' },
    
      // Chinese news sources
      { protocol: 'https', hostname: '**.technode.com' },
      { protocol: 'https', hostname: '**.technode.global' },
      { protocol: 'https', hostname: '**.scmp.com' },
      { protocol: 'https', hostname: 'cdn.i-scmp.com' },
    
      // WordPress and common CDNs
      { protocol: 'https', hostname: '**.wp.com' },
      { protocol: 'https', hostname: '**.wordpress.com' },
      { protocol: 'https', hostname: 's.w.org' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'i1.wp.com' },
      { protocol: 'https', hostname: 'i2.wp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'cdn.techinasia.com' },
    
      // Image hosting and CDNs
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.medium.com' },
      { protocol: 'https', hostname: '**.substack.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    
      // BBC News
      { protocol: 'https', hostname: '**.bbci.co.uk' },

      //edu
      { protocol: 'https', hostname: 'news.mit.edu' },

      // fuck it, permit all of them
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Enable experimental features for better RSS feed handling
  experimental: {
    largePageDataBytes: 128 * 100000, // Increase page data size limit
  },
}

module.exports = nextConfig

import axios from 'axios';

export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  author?: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
}

export interface TwitterApiResponse {
  data: Tweet[];
  includes?: {
    users: Array<{
      id: string;
      name: string;
      username: string;
      profile_image_url?: string;
    }>;
  };
  meta: {
    result_count: number;
    next_token?: string;
  };
}

class TwitterAPI {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN!;
    if (!this.bearerToken) {
      throw new Error('Twitter Bearer Token is required');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Search for tweets containing $raidcoin
   */
  async searchTweets(options: {
    query?: string;
    maxResults?: number;
    nextToken?: string;
    sinceId?: string;
  } = {}): Promise<TwitterApiResponse> {
    const {
      query = '$raidcoin OR #raidcoin OR @xraidcoin',
      maxResults = 100,
      nextToken,
      sinceId
    } = options;

    const params = new URLSearchParams({
      query,
      max_results: maxResults.toString(),
      'tweet.fields': 'id,text,author_id,created_at,public_metrics,context_annotations,entities',
      'user.fields': 'id,name,username,profile_image_url,verified',
      'expansions': 'author_id',
    });

    if (nextToken) params.append('next_token', nextToken);
    if (sinceId) params.append('since_id', sinceId);

    try {
      const response = await axios.get(
        `${this.baseUrl}/tweets/search/recent?${params}`,
        { headers: this.getHeaders() }
      );

      // Combine tweet data with author information
      const tweets = response.data.data || [];
      const users = response.data.includes?.users || [];
      
      const enrichedTweets = tweets.map((tweet: Tweet) => ({
        ...tweet,
        author: users.find((user: any) => user.id === tweet.author_id)
      }));

      return {
        data: enrichedTweets,
        includes: response.data.includes,
        meta: response.data.meta
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter API Error:', error.response?.data);
        throw new Error(`Twitter API Error: ${error.response?.status} - ${error.response?.data?.title || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get user information by username
   */
  async getUserByUsername(username: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/by/username/${username}?user.fields=id,name,username,profile_image_url,verified,public_metrics`,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter API Error:', error.response?.data);
        throw new Error(`Twitter API Error: ${error.response?.status} - ${error.response?.data?.title || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get tweet by ID with full details
   */
  async getTweetById(tweetId: string): Promise<Tweet> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tweets/${tweetId}?tweet.fields=id,text,author_id,created_at,public_metrics&user.fields=id,name,username,profile_image_url&expansions=author_id`,
        { headers: this.getHeaders() }
      );

      const tweet = response.data.data;
      const author = response.data.includes?.users?.[0];

      return {
        ...tweet,
        author
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter API Error:', error.response?.data);
        throw new Error(`Twitter API Error: ${error.response?.status} - ${error.response?.data?.title || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Calculate engagement score for a tweet
   */
  calculateEngagementScore(metrics: Tweet['public_metrics']): number {
    const {
      like_count,
      retweet_count,
      reply_count,
      quote_count
    } = metrics;

    // Weighted engagement score
    // Retweets and quotes are worth more as they increase reach
    const score = (
      (like_count * 1) +
      (retweet_count * 3) +
      (reply_count * 2) +
      (quote_count * 3)
    );

    return Math.max(score, 1); // Minimum 1 point for posting
  }
}

export const twitterApi = new TwitterAPI();
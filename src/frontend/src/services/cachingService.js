// src/services/cachingService.js
import NodeCache from 'node-cache';
import { uploadToIPFS } from '../utils/ipfsClient'; // Placeholder for IPFS uploader
import { getCDNUrl } from '../utils/cdnHelper';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Retrieves a cached asset URL if it exists.
 * @param {string} key - The cache key.
 * @returns {Promise<string|null>} The cached URL or null.
 */
export async function getCachedAsset(key) {
  return cache.get(key);
}

/**
 * Caches an asset by uploading to IPFS/CDN and storing the URL.
 * @param {Buffer} assetBuffer - The asset data buffer.
 * @param {string} key - The cache key.
 * @param {number} ttl - Time to live in seconds.
 * @returns {Promise<string>} The final CDN URL.
 */
export async function cacheAsset(assetBuffer, key, ttl) {
  try {
    const ipfsHash = await uploadToIPFS(assetBuffer);
    const cdnUrl = getCDNUrl(ipfsHash);
    cache.set(key, cdnUrl, ttl);
    console.log(`Asset cached successfully for key: ${key}`);
    return cdnUrl;
  } catch (error) {
    console.error('Error caching asset:', error);
    throw new Error('Failed to cache asset.');
  }
}

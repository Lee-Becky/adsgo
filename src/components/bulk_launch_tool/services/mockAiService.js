// Mock AI Service for generating creative assets
// This is a simplified version that doesn't depend on Gemini API

/**
 * Generate an AI creative image URL
 * @param {string} prompt - The prompt for AI generation
 * @returns {Promise<string>} URL of the generated image
 */
export async function generateAIGCCreative(prompt) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a placeholder image URL based on the prompt
  // Using picsum.photos for placeholder images
  const seed = encodeURIComponent(prompt.substring(0, 20));
  return `https://picsum.photos/seed/${seed}/800/1200`;
}

/**
 * Mock service for analyzing product pages
 * @param {string} productUrl - The URL of the product page
 * @returns {Promise<Object>} Analysis report
 */
export async function analyzeProductPage(productUrl) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    summary: 'Product analysis completed successfully',
    recommendedAudience: '25-45 year olds interested in quality products',
    competitors: ['Competitor A', 'Competitor B', 'Competitor C']
  };
}

/**
 * Mock service for batch generating creatives
 * @param {Array} products - Array of products to generate creatives for
 * @param {number} countPerProduct - Number of creatives per product
 * @returns {Promise<Object>} Mapping of product IDs to creative arrays
 */
export async function batchGenerateCreatives(products, countPerProduct = 3) {
  const results = {};
  
  for (const product of products) {
    const creatives = [];
    for (let i = 0; i < countPerProduct; i++) {
      const url = await generateAIGCCreative(`${product.name} creative ${i}`);
      creatives.push({
        id: `ai-${product.id}-${Date.now()}-${i}`,
        url: url,
        productId: product.id
      });
    }
    results[product.id] = creatives;
  }
  
  return results;
}
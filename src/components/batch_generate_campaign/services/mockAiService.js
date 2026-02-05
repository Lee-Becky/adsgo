
/**
 * Mock AI Service for Batch Campaign Generation
 * Replaces Gemini AI calls with equivalent simulated logic.
 */

export async function generateCampaignPlan(
  product,
  creatives,
  audiences,
  adSetCount,
  adsPerSet
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const adSets = audiences.slice(0, adSetCount).map((audienceType, index) => {
    const ads = Array.from({ length: adsPerSet }).map((_, adIndex) => {
      const creative = creatives[adIndex % creatives.length];
      return {
        headline: `${product.name} - ${index === 0 ? 'Best Seller' : 'New Arrival'}`,
        body: `Experience the excellence of ${product.name}. Perfect for your lifestyle. Shop now and save!`,
        creativeId: creative?.id || `mock-creative-${adIndex}`
      };
    });

    return {
      name: `AdSet - ${audienceType} - ${index + 1}`,
      audience: `Targeting ${audienceType} based on product affinity for ${product.name}.`,
      ads: ads
    };
  });

  return {
    campaignName: `AI-Batch-${product.name.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`,
    adSets: adSets
  };
}

/**
 * Mock AIGC Creative generation
 * Uses picsum.photos for random professional-looking placeholders
 */
export async function generateAIGCCreative(prompt) {
  // Simulate generation time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a random picsum image based on the prompt hash or random seed
  const seed = Math.random().toString(36).substring(7);
  return `https://picsum.photos/seed/${seed}/800/1200`;
}

/**
 * Mock product analysis report
 */
export async function analyzeProduct(productUrl) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    summary: "High-potential product with strong visual appeal. Landing page is well-optimized for conversion.",
    recommendedAudience: "Primary: 25-45 Women interested in fashion and lifestyle. Secondary: Gift seekers.",
    competitors: ["Competitor A", "Competitor B", "Competitor C"]
  };
}

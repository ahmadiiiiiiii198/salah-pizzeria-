#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const LOVABLE_UPLOADS_DIR = path.join(PUBLIC_DIR, 'lovable-uploads');

// Configuration for different image types
const OPTIMIZATION_CONFIG = {
  // Large images (backgrounds, hero images)
  large: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    webpQuality: 80,
  },
  // Medium images (product images, gallery)
  medium: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 85,
    webpQuality: 80,
  },
  // Small images (thumbnails, icons)
  small: {
    maxWidth: 400,
    maxHeight: 300,
    quality: 90,
    webpQuality: 85,
  },
  // Logos (preserve quality)
  logo: {
    maxWidth: 500,
    maxHeight: 500,
    quality: 95,
    webpQuality: 90,
  }
};

// Determine image category based on filename and size
function getImageCategory(filename, stats) {
  const name = filename.toLowerCase();
  const sizeKB = stats.size / 1024;
  
  if (name.includes('logo') || name.includes('icon')) {
    return 'logo';
  }
  
  if (name.includes('background') || name.includes('hero') || sizeKB > 1000) {
    return 'large';
  }
  
  if (sizeKB > 200) {
    return 'medium';
  }
  
  return 'small';
}

// Optimize a single image
async function optimizeImage(inputPath, outputPath, config) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`📸 Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);

    // Resize if needed
    let pipeline = image;
    if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
      pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Generate optimized versions
    const baseName = path.parse(outputPath).name;
    const outputDir = path.dirname(outputPath);
    const tempPath = path.join(outputDir, `${baseName}_temp.${path.parse(outputPath).ext.slice(1)}`);

    // Original format optimized (to temp file first)
    if (metadata.format === 'png') {
      await pipeline
        .png({ quality: config.quality, compressionLevel: 9 })
        .toFile(tempPath);
    } else if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      await pipeline
        .jpeg({ quality: config.quality, progressive: true })
        .toFile(tempPath);
    }

    // Replace original with optimized version
    await fs.rename(tempPath, outputPath);
    
    // WebP version
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    await pipeline
      .webp({ quality: config.webpQuality })
      .toFile(webpPath);
    
    // AVIF version for modern browsers (smaller file size)
    const avifPath = path.join(outputDir, `${baseName}.avif`);
    try {
      await pipeline
        .avif({ quality: config.webpQuality - 10 })
        .toFile(avifPath);
    } catch (error) {
      console.warn(`⚠️ Could not generate AVIF for ${baseName}: ${error.message}`);
    }
    
    // Get file sizes
    const originalStats = await fs.stat(inputPath);
    const optimizedStats = await fs.stat(outputPath);
    const webpStats = await fs.stat(webpPath);
    
    const originalKB = Math.round(originalStats.size / 1024);
    const optimizedKB = Math.round(optimizedStats.size / 1024);
    const webpKB = Math.round(webpStats.size / 1024);
    const savings = Math.round(((originalStats.size - optimizedStats.size) / originalStats.size) * 100);
    
    console.log(`  ✅ Original: ${originalKB}KB → Optimized: ${optimizedKB}KB → WebP: ${webpKB}KB (${savings}% savings)`);
    
    return {
      original: originalKB,
      optimized: optimizedKB,
      webp: webpKB,
      savings
    };
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

// Process all images in a directory
async function processDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log(`📁 No images found in ${dirPath}`);
      return;
    }
    
    console.log(`\n📁 Processing ${imageFiles.length} images in ${dirPath}:`);
    
    let totalOriginal = 0;
    let totalOptimized = 0;
    let totalWebp = 0;
    
    for (const file of imageFiles) {
      const inputPath = path.join(dirPath, file);
      const stats = await fs.stat(inputPath);
      const category = getImageCategory(file, stats);
      const config = OPTIMIZATION_CONFIG[category];
      
      console.log(`\n🔧 Category: ${category.toUpperCase()}`);
      
      const result = await optimizeImage(inputPath, inputPath, config);
      
      if (result) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        totalWebp += result.webp;
      }
    }
    
    const totalSavings = Math.round(((totalOriginal - totalOptimized) / totalOriginal) * 100);
    console.log(`\n📊 Directory Summary:`);
    console.log(`   Total Original: ${totalOriginal}KB`);
    console.log(`   Total Optimized: ${totalOptimized}KB`);
    console.log(`   Total WebP: ${totalWebp}KB`);
    console.log(`   Total Savings: ${totalSavings}%`);
    
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization...\n');

  try {
    console.log(`📁 Public directory: ${PUBLIC_DIR}`);
    console.log(`📁 Lovable uploads directory: ${LOVABLE_UPLOADS_DIR}`);

    // Check if directories exist
    const publicExists = await fs.access(PUBLIC_DIR).then(() => true).catch(() => false);
    const uploadsExists = await fs.access(LOVABLE_UPLOADS_DIR).then(() => true).catch(() => false);

    console.log(`📁 Public directory exists: ${publicExists}`);
    console.log(`📁 Uploads directory exists: ${uploadsExists}`);

    if (publicExists) {
      // Process public directory
      await processDirectory(PUBLIC_DIR);
    }

    if (uploadsExists) {
      // Process lovable-uploads directory
      await processDirectory(LOVABLE_UPLOADS_DIR);
    }

    console.log('\n✅ Image optimization complete!');
    console.log('\n💡 Tips:');
    console.log('   - Use WebP images for modern browsers');
    console.log('   - Consider using AVIF for even better compression');
    console.log('   - Implement responsive images with srcset');
    console.log('   - Use lazy loading for images below the fold');
  } catch (error) {
    console.error('❌ Error in main function:', error);
  }
}

// Run if called directly
if (process.argv[1] && process.argv[1].endsWith('optimize-images.js')) {
  main().catch(console.error);
}

export { optimizeImage, processDirectory };

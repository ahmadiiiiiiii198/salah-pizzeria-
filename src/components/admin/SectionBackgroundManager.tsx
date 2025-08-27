import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Trash2, Eye, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SectionConfig {
  key: string;
  name: string;
  description: string;
  currentImage?: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: 'heroContent',
    name: 'Hero Section',
    description: 'Main banner/hero section background'
  },
  {
    key: 'weOfferContent',
    name: 'We Offer Section',
    description: 'Services and offerings section background'
  },
  {
    key: 'productsContent',
    name: 'Products Section',
    description: 'Menu/products listing section background'
  },
  {
    key: 'galleryContent',
    name: 'Gallery Section',
    description: 'Image gallery section background'
  },
  {
    key: 'chiSiamoContent',
    name: 'About Section',
    description: 'About us (Chi Siamo) section background'
  },
  {
    key: 'contactContent',
    name: 'Contact Section',
    description: 'Contact information section background'
  },
  {
    key: 'youtubeSectionContent',
    name: 'YouTube Section',
    description: 'YouTube videos section background'
  }
];

const SectionBackgroundManager: React.FC = () => {
  const [sections, setSections] = useState<SectionConfig[]>(SECTIONS);
  const [loading, setLoading] = useState(false);
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentBackgrounds();
  }, []);

  const loadCurrentBackgrounds = async () => {
    try {
      setLoading(true);
      const sectionKeys = sections.map(s => s.key);
      
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', sectionKeys);

      if (error) throw error;

      const updatedSections = sections.map(section => {
        const setting = data?.find(d => d.key === section.key);
        const backgroundImage = setting?.value?.backgroundImage || '';
        
        return {
          ...section,
          currentImage: backgroundImage
        };
      });

      setSections(updatedSections);
    } catch (error) {
      console.error('Error loading backgrounds:', error);
      toast.error('Failed to load current backgrounds');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, sectionKey: string) => {
    try {
      console.log('🚀 Starting file upload for section:', sectionKey);
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });

      setUploadingSection(sectionKey);

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `section-backgrounds/${fileName}`;

      console.log('📤 Uploading to path:', filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw uploadError;
      }

      console.log('✅ Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL:', publicUrl);

      // Update section setting
      await updateSectionBackground(sectionKey, publicUrl);

      console.log('✅ Background updated successfully');
      toast.success('Background image uploaded successfully!');

    } catch (error: any) {
      console.error('❌ Error uploading image:', error);
      const errorMessage = error.message || 'Failed to upload background image';
      toast.error(errorMessage);
    } finally {
      setUploadingSection(null);
    }
  };

  const updateSectionBackground = async (sectionKey: string, imageUrl: string) => {
    try {
      // Get current setting
      const { data: currentSetting, error: fetchError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', sectionKey)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      // Update with new background image
      const updatedValue = {
        ...(currentSetting?.value || {}),
        backgroundImage: imageUrl
      };

      const { error: updateError } = await supabase
        .from('settings')
        .upsert({
          key: sectionKey,
          value: updatedValue
        });

      if (updateError) throw updateError;

      // Update local state
      setSections(prev => prev.map(section => 
        section.key === sectionKey 
          ? { ...section, currentImage: imageUrl }
          : section
      ));

    } catch (error) {
      console.error('Error updating section background:', error);
      throw error;
    }
  };

  const removeSectionBackground = async (sectionKey: string) => {
    try {
      await updateSectionBackground(sectionKey, '');
      toast.success('Background image removed successfully!');
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background image');
    }
  };

  const previewSection = (imageUrl: string) => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Section Background Manager</h2>
          <p className="text-gray-600">Manage background images for all website sections</p>
        </div>
        <Button 
          onClick={loadCurrentBackgrounds} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <SectionCard
                key={section.key}
                section={section}
                onFileUpload={handleFileUpload}
                onRemoveBackground={removeSectionBackground}
                onPreview={previewSection}
                isUploading={uploadingSection === section.key}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {sections.map((section) => (
            <SectionListItem
              key={section.key}
              section={section}
              onFileUpload={handleFileUpload}
              onRemoveBackground={removeSectionBackground}
              onPreview={previewSection}
              isUploading={uploadingSection === section.key}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SectionCardProps {
  section: SectionConfig;
  onFileUpload: (file: File, sectionKey: string) => void;
  onRemoveBackground: (sectionKey: string) => void;
  onPreview: (imageUrl: string) => void;
  isUploading: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  onFileUpload,
  onRemoveBackground,
  onPreview,
  isUploading
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File input changed for section:', section.key);
    const file = event.target.files?.[0];
    console.log('📄 Selected file:', file);

    if (file) {
      console.log('✅ File selected, calling onFileUpload');
      onFileUpload(file, section.key);
    } else {
      console.log('⚠️ No file selected');
    }

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg">{section.name}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Image Preview */}
        {section.currentImage ? (
          <div className="relative">
            <img
              src={section.currentImage}
              alt={`${section.name} background`}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onPreview(section.currentImage!)}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemoveBackground(section.key)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">No background image</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`upload-${section.key}`}
          />
          <Label
            htmlFor={`upload-${section.key}`}
            className={`
              cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium
              ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
              disabled:opacity-50 h-10 px-4 py-2 w-full
              ${section.currentImage
                ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isUploading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Uploading...' : section.currentImage ? 'Change Image' : 'Upload Image'}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

interface SectionListItemProps extends SectionCardProps {}

const SectionListItem: React.FC<SectionListItemProps> = ({
  section,
  onFileUpload,
  onRemoveBackground,
  onPreview,
  isUploading
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File input changed for section (list view):', section.key);
    const file = event.target.files?.[0];
    console.log('📄 Selected file:', file);

    if (file) {
      console.log('✅ File selected, calling onFileUpload');
      onFileUpload(file, section.key);
    } else {
      console.log('⚠️ No file selected');
    }

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {section.currentImage ? (
              <img
                src={section.currentImage}
                alt={`${section.name} background`}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-gray-400" />
              </div>
            )}
            
            <div>
              <h3 className="font-semibold">{section.name}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {section.currentImage && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPreview(section.currentImage!)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveBackground(section.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id={`upload-list-${section.key}`}
              />
              <Label
                htmlFor={`upload-list-${section.key}`}
                className={`
                  cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium
                  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none
                  disabled:opacity-50 h-10 px-4 py-2
                  ${section.currentImage
                    ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isUploading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading ? 'Uploading...' : section.currentImage ? 'Change' : 'Upload'}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionBackgroundManager;

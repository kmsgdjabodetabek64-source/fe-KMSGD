import { useState, useEffect } from "react";
import { getGaleri, type GaleriItem } from "../services/galeriService";
import { Lightbox } from "../components/Lightbox";
import { VideoGallery } from "../components/VideoGallery";
import { PhotoGallery } from "../components/PhotoGallery";
import { GalleryHero } from "../components/GalleryHero";

const GaleriPage = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<GaleriItem[]>([]);
  const [videos, setVideos] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaleri = async () => {
      setLoading(true);
      try {
        const [photosData, videosData] = await Promise.all([
          getGaleri("FOTO", 1, 100),
          getGaleri("VIDEO", 1, 100),
        ]);
        setPhotos(photosData.data);
        setVideos(videosData.data);
      } catch (error) {
        console.error("Gagal mengambil data galeri:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGaleri();
  }, []);

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen flex flex-col pt-20">
      <GalleryHero />

        <PhotoGallery
          photos={photos}
          loading={loading}
          onPhotoClick={setSelectedPhotoIndex}
        />

        <VideoGallery
          videos={videos}
          loading={loading}
        />

      <Lightbox
        photos={photos}
        currentIndex={selectedPhotoIndex}
        onNavigate={setSelectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
      />
    </div>
  );
};

export default GaleriPage;

"use client";

import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Instagram, GalleryVerticalIcon } from "lucide-react";
import { createClient } from 'pexels';

const client = createClient('563492ad6f91700001000001ade6c731e2ba4ab38c8372715ec5bf99');
const collectionId = "aynzlp2";
const query = 'Nature';


const playfair = Playfair_Display({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

interface Photo {
  id: number;
  src: string;
  title: string;
  price?: string;
  description?: string;
}

const menuItems = [
  { id: "home", label: "Home" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "purchase", label: "Purchase" },
];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Home() {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Fetch photos from Pexels API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await client.collections.media({
          id:collectionId,
          per_page: 500,
        });

        if ('media' in response) {
          const photos = response?.media.map((photo: any, index: number) => ({
            id: photo?.id,
            src: photo?.src?.landscape,
            title: photo?.alt || `Photography ${index + 1}`,
            price: "Starting From ₹200", 
            description: photo?.photographer,
          }));
          setFeaturedPhotos(photos?.slice(6,24)); 
          setGalleryPhotos(photos?.slice(3));
        }
      } catch (error) {
        console.error("Error fetching photos from Pexels API:", error);
      }
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    if (featuredPhotos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPhotoIndex(
        (prevIndex) => (prevIndex + 1) % featuredPhotos.length
      );
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredPhotos]);

  const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );

  const CardContent: React.FC<CardProps> = ({
    children,
    className,
    ...props
  }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 text-gray-900 ${montserrat.className}`}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-50 h-50">
                <img src="/logo.png" alt="" />
              </div>
            </Link>
            <div className="flex space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className="hover:text-gray-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main className="pt-16">
        <section
          id="home"
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhotoIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={featuredPhotos[currentPhotoIndex]?.src}
                alt={featuredPhotos[currentPhotoIndex]?.title}
                layout="fill"
                objectFit="cover"
                quality={100}
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </motion.div>
          </AnimatePresence>
          <div className="relative z-10 text-center text-white">
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-4 ${playfair.className}`}
            >
              Lens & Lore
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl mb-8">
              Capturing Earth's most breathtaking moments
            </p>
            <Button
              className="bg-white text-gray-900 hover:bg-gray-200 h-11 px-8"
              onClick={() =>
                document
                  .getElementById("gallery")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Gallery
            </Button>
          </div>
        </section>

        <section id="gallery" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-8 ${playfair.className}`}
            >
              Step Into the World of Nature's Art
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    width={600}
                    height={400}
                    className="w-full h-64 object-cover"
                  />
                  <motion.div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-semibold text-center px-4">
                      {photo.title}
                    </h3>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-8 ${playfair.className}`}
            >
              Meet the Artist Behind the Lens
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <Image
                src={featuredPhotos[currentPhotoIndex]?.src}
                alt="Featured Work"
                width={400}
                height={400}
                className="rounded-lg w-64 h-64 object-cover"
              />
              <div>
                <p className="text-lg mb-4">
                  Hi, I’m Ankit — passionate landscape photographer, I traverse the globe
                  seeking out Earth's most stunning vistas and hidden corners.
                  Each image in my collection tells a story of adventure,
                  beauty, and the raw power of nature.
                </p>
                <p className="text-lg mb-4">
                  From misty mountain peaks to serene lakeside views, my work
                  aims to transport viewers to these magnificent locations,
                  allowing them to experience the same sense of wonder I felt
                  when capturing these moments.
                </p>
                <p className="text-lg">
                  Every photograph is available as a museum-quality print,
                  carefully produced to bring these natural wonders into your
                  space with stunning clarity and detail.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="purchase" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-8 ${playfair.className}`}
            >
              Bring Nature’s Wonders Home
            </h2>
            <Card className="bg-gray-50 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <Image
                    src={featuredPhotos[currentPhotoIndex]?.src}
                    alt={featuredPhotos[currentPhotoIndex]?.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 md:w-1/2 flex flex-col justify-center">
                  <h3
                    className={`text-2xl font-semibold mb-4 ${playfair.className}`}
                  >
                    {featuredPhotos[currentPhotoIndex]?.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bring the beauty of nature into your space with this
                    stunning limited edition print. Each piece is carefully
                    produced using archival-quality materials and comes with a
                    signed certificate of authenticity.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {featuredPhotos[currentPhotoIndex]?.price}
                    </span>
                    <Link
                      href={`https://wa.me/8882999775?text=I'm interested in purchasing the print "${featuredPhotos[currentPhotoIndex]?.title}" for ${featuredPhotos[currentPhotoIndex]?.price}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-green-500 hover:bg-green-600 text-white h-10 px-4 py-2">
                        Purchase via WhatsApp{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-2xl font-bold ${playfair.className}`}>
                  {selectedPhoto.title}
                </h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                width={800}
                height={600}
                className="w-full h-[60vh] object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-6">{selectedPhoto.description}</p>
              <Link
                href={`https://wa.me/8882999775?text=I'm interested in purchasing a print of "${selectedPhoto.title}"`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-10">
                  Purchase via WhatsApp
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="w-50 h-50">
              <img src="/logo.png" alt="" />
            </div>
            <p className="text-gray-600">
              Capturing Earth's most breathtaking moments
            </p>
          </div>
          <div className="flex space-x-4">
            <Link href="https://www.instagram.com/belikeank_/" target="_blank" className="text-gray-600 hover:text-gray-900">
              <Instagram size={24} />
            </Link>
            <Link href="https://www.pexels.com/@captain/gallery/" target="_blank" className="text-gray-600 hover:text-gray-900">
              <GalleryVerticalIcon size={24} />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600">
          <p>&copy; 2024 Lens & Lore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

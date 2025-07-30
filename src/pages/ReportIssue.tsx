import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Camera, MapPin, Send, Trash2, X } from 'lucide-react';

const categories = [
  'Road Maintenance', 'Street Lighting', 'Waste Management',
  'Water Supply', 'Public Safety', 'Parks & Recreation',
  'Traffic', 'Other'
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOMD0C6KMNr7eQ';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 12.9716, // Bangalore coordinates as default
  lng: 77.5946
};

export default function ReportIssue() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng });
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Form data
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Camera states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' }, // Back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(error => {
          console.error('Camera access error:', error);
          toast({
            title: 'Camera Error',
            description: 'Unable to access your camera.',
            variant: 'destructive',
          });
          setIsCameraOn(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOn, toast]);

  // Get current location
  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setGettingLocation(false);
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: 'Location Error',
            description: 'Could not get your current location.',
            variant: 'destructive',
          });
          setGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by this browser.',
        variant: 'destructive',
      });
      setGettingLocation(false);
    }
  };

  // Handle map click
  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setCoordinates({ lat, lng });
      setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (images.length + newFiles.length > 8) {
      toast({
        title: 'Image Limit Reached',
        description: 'Maximum of 8 images allowed.',
        variant: 'destructive',
      });
      return;
    }

    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Images must be less than 5MB.',
          variant: 'destructive',
        });
        return;
      }
    }

    setImages([...images, ...newFiles]);
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Capture photo from camera
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(blob => {
        if (blob) setCapturedBlob(blob);
      }, 'image/jpeg', 0.8);
    }
  };

  // Confirm captured photo
  const confirmCapturedPhoto = () => {
    if (!capturedBlob) return;

    if (images.length >= 8) {
      toast({
        title: 'Image Limit Reached',
        description: 'Maximum of 8 images allowed.',
        variant: 'destructive',
      });
      return;
    }

    const newFile = new File([capturedBlob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
    setImages([...images, newFile]);
    setCapturedBlob(null);
    setIsCameraOn(false);
    
    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Close camera
  const closeCamera = () => {
    setIsCameraOn(false);
    setCapturedBlob(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Upload image to Supabase
  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('complaint-images')
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('complaint-images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  };

  // Form validation
  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Issue title is required.',
        variant: 'destructive',
      });
      return false;
    }
    if (!category) {
      toast({
        title: 'Validation Error',
        description: 'Category is required.',
        variant: 'destructive',
      });
      return false;
    }
    if (!description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Description is required.',
        variant: 'destructive',
      });
      return false;
    }
    if (!location.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Location is required.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'Please login to submit a complaint.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Upload all images
      const uploadedUrls: string[] = [];
      
      for (const file of images) {
        const url = await uploadImage(file);
        if (!url) {
          throw new Error('Failed to upload one or more images');
        }
        uploadedUrls.push(url);
      }

      // Insert complaint into database
      const { error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          image_urls: uploadedUrls,
          status: 'Pending'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: 'Success!',
        description: 'Your complaint has been submitted successfully.',
      });

      // Reset form
      setTitle('');
      setCategory('');
      setDescription('');
      setLocation('');
      setImages([]);
      setCoordinates(defaultCenter);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your complaint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Report a Civic Issue
          </CardTitle>
          <CardDescription>
            Help us improve your community by reporting issues that need attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the issue"
                rows={4}
                required
              />
            </div>

            {/* Google Maps Location Selection */}
            <div className="space-y-2">
              <Label>Location *</Label>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Click on map or enter manually"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {gettingLocation ? 'Getting...' : 'GPS'}
                  </Button>
                </div>
                
                <div className="rounded-lg overflow-hidden border">
                  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={coordinates}
                      zoom={15}
                      onClick={onMapClick}
                    >
                      <Marker position={coordinates} draggable />
                    </GoogleMap>
                  </LoadScript>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                </div>
              </div>
            </div>

            {/* Camera and Image Upload */}
            <div className="space-y-4">
              <Label>Photos (Max 8)</Label>
              
              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Options */}
              <div className="flex gap-2 flex-wrap">
                {images.length < 8 && (
                  <>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline">
                        Choose Files
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCameraOn(true)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                  </>
                )}
              </div>

              {/* Camera Interface */}
              {isCameraOn && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Camera</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={closeCamera}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded border"
                        style={{ maxHeight: '300px' }}
                      />
                      
                      <div className="flex gap-2 justify-center">
                        <Button type="button" onClick={capturePhoto}>
                          <Camera className="w-4 h-4 mr-2" />
                          Capture
                        </Button>
                        <Button type="button" variant="outline" onClick={closeCamera}>
                          Close
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Captured Photo Preview */}
              {capturedBlob && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Label>Captured Photo</Label>
                      <img
                        src={URL.createObjectURL(capturedBlob)}
                        alt="Captured"
                        className="w-full max-w-sm rounded border mx-auto"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button type="button" onClick={confirmCapturedPhoto}>
                          Use Photo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCapturedBlob(null)}
                        >
                          Retake
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
// import { useEffect, useRef, useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from '@/components/ui/select';
// import { Camera, MapPin, Send, Trash2, X } from 'lucide-react';

// const categories = [
//   'Road Maintenance', 'Street Lighting', 'Waste Management',
//   'Water Supply', 'Public Safety', 'Parks & Recreation',
//   'Traffic', 'Other'
// ];

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOMD0C6KMNr7eQ';

// const mapContainerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const defaultCenter = {
//   lat: 12.9716,
//   lng: 77.5946
// };

// export default function ReportIssue() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState<File[]>([]);
//   const [location, setLocation] = useState('');
//   const [coordinates, setCoordinates] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng });
//   const [gettingLocation, setGettingLocation] = useState(false);
//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('');
//   const [description, setDescription] = useState('');

//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [isCameraOn, setIsCameraOn] = useState(false);
//   const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   useEffect(() => {
//     if (isCameraOn && videoRef.current) {
//       navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
//         .then(mediaStream => {
//           setStream(mediaStream);
//           if (videoRef.current) videoRef.current.srcObject = mediaStream;
//         })
//         .catch(error => {
//           toast({ title: 'Camera Error', description: 'Unable to access your camera.', variant: 'destructive' });
//           setIsCameraOn(false);
//         });
//     }
//     return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
//   }, [isCameraOn]);

//   const getCurrentLocation = () => {
//     setGettingLocation(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCoordinates({ lat: latitude, lng: longitude });
//           setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
//           setGettingLocation(false);
//         },
//         () => {
//           toast({ title: 'Location Error', description: 'Could not get your current location.', variant: 'destructive' });
//           setGettingLocation(false);
//         },
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
//       );
//     } else {
//       toast({ title: 'Location Not Supported', description: 'Geolocation not supported.', variant: 'destructive' });
//       setGettingLocation(false);
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const newFiles = Array.from(files);
//     for (const file of newFiles) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast({ title: 'File Too Large', description: 'Images must be <5MB.', variant: 'destructive' });
//         return;
//       }
//     }
//     setImages([...images, ...newFiles]);
//   };

//   const capturePhoto = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     if (ctx) {
//       ctx.drawImage(video, 0, 0);
//       canvas.toBlob(blob => { if (blob) setCapturedBlob(blob); }, 'image/jpeg');
//     }
//   };

//   const confirmCapturedPhoto = () => {
//     if (!capturedBlob) return;
//     const newFile = new File([capturedBlob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
//     setImages([...images, newFile]);
//     setCapturedBlob(null);
//     setIsCameraOn(false);
//     if (stream) { stream.getTracks().forEach(track => track.stop()); setStream(null); }
//   };

//   const uploadImage = async (file: File): Promise<string | null> => {
//     const fileName = `${Date.now()}-${file.name}`;
//     const { data, error } = await supabase.storage.from('complaint-images').upload(fileName, file);
//     if (error) return null;
//     const { data: urlData } = supabase.storage.from('complaint-images').getPublicUrl(data.path);
//     return urlData?.publicUrl || null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !category || !description || !location || !user) return;
//     setLoading(true);
//     try {
//       const uploadedUrls = await Promise.all(images.map(uploadImage));
//       if (uploadedUrls.includes(null)) throw new Error('Image upload failed');
//       await supabase.from('complaints').insert({
//         user_id: user.id,
//         title,
//         description,
//         category,
//         location,
//         latitude: coordinates.lat,
//         longitude: coordinates.lng,
//         image_urls: uploadedUrls.filter(Boolean),
//         status: 'Pending'
//       });
//       toast({ title: 'Submitted', description: 'Your complaint has been submitted.' });
//       setTitle(''); setCategory(''); setDescription(''); setLocation(''); setImages([]); setCoordinates(defaultCenter);
//     } catch (err) {
//       toast({ title: 'Error', description: 'Submission failed.', variant: 'destructive' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Form JSX here */}
//     </div>
//   );
// }
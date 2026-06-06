export const MAX_UPLOAD_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_ORIGINAL_IMAGE_SIZE = 20 * 1024 * 1024;

const MAX_IMAGE_DIMENSION = 1200;
const INITIAL_QUALITY = 0.86;
const MIN_QUALITY = 0.58;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read the selected image.'));
    };

    image.src = objectUrl;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Unable to prepare the image for upload.'));
        }
      },
      'image/jpeg',
      quality
    );
  });

const getResizedDimensions = (width, height) => {
  const largestSide = Math.max(width, height);

  if (largestSide <= MAX_IMAGE_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_IMAGE_DIMENSION / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

export const prepareImageForUpload = async (file) => {
  if (!file) {
    return null;
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file.');
  }

  if (file.size > MAX_ORIGINAL_IMAGE_SIZE) {
    throw new Error('Image is too large. Please choose an image smaller than 20 MB.');
  }

  const image = await loadImage(file);
  const dimensions = getResizedDimensions(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

  let quality = INITIAL_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_UPLOAD_IMAGE_SIZE && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - 0.1);
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new Error('Image is too large. Please choose a smaller or lower-resolution photo.');
  }

  const baseName = file.name.replace(/\.[^/.]+$/, '') || 'profile-image';
  return new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
};

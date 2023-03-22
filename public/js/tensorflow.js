const fileInput = document.getElementById('file-input');
const image = document.getElementById('image');
const description = document.getElementById('prediction');
const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
const inputError = document.getElementById('input-error');

let model;

/**
 * Display the result in the page
 */
function displayDescription(predictions) {
  // Sort by probability
  const result = predictions.sort((a, b) => a > b)[0];

  if (result.probability > 0.2) {
    const probability = Math.round(result.probability * 100);

    // Display result
    description.innerText = `${probability}% sure this is a ${result.className.replace(',', ' or')} 🐶`;
  } else description.innerText = 'I am not sure what I should recognize 😢';
}

/**
 * Classify with the image with the mobilenet model
 */
function classifyImage() {
  model.classify(image).then((predictions) => {
    displayDescription(predictions);
  });
}

/**
 * Get the image from file input and display on page
 */
function getImage() {
  // Check if an image has been found in the input
  if (!fileInput.files[0]) throw new Error('Image not found');
  const file = fileInput.files[0];

  // Check if file is an image
  if (!acceptedImageTypes.includes(file.type)) {
    inputError.classList.add('show');
    throw Error('The uploaded file is not an image');
  } else inputError.classList.remove('show');

  // Get the data url form the image
  const reader = new FileReader();

  // When reader is ready display image
  reader.onload = function (event) {
    // Ge the data url
    const dataUrl = event.target.result;

    // Create image object
    const imageElement = new Image();
    imageElement.src = dataUrl;

    // When image object is loaded
    imageElement.onload = function () {
      // Set <img /> attributes
      image.setAttribute('src', this.src);
      image.setAttribute('height', this.height);
      image.setAttribute('width', this.width);

      // Classify image
      classifyImage();
    };

    // Add the image-loaded class to the body
    document.body.classList.add('image-loaded');
  };

  // Get data URL
  reader.readAsDataURL(file);
}

/**
 * Load model
 */
mobilenet.load().then((m) => {
  // Save model
  model = m;

  // Remove loading class from body
  document.body.classList.remove('loading');

  // When user uploads a new image, display the new image on the webpage
  fileInput.addEventListener('change', getImage);
});
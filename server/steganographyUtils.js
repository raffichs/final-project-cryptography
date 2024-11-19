// // const { createCanvas, loadImage } = require("canvas");

// const MAX_COLOR_VALUE = 256;
// const MAX_BIT_VALUE = 8;

// function removeNLeastSignificantBits(value, n) {
//   return (value >> n) << n;
// }

// function getNLeastSignificantBits(value, n) {
//   return value & ((1 << n) - 1);
// }

// function getNMostSignificantBits(value, n) {
//   return value >> (MAX_BIT_VALUE - n);
// }

// function shiftNBitsTo8(value, n) {
//   return value << (MAX_BIT_VALUE - n);
// }

// async function encode(hiddenImagePath, coverImagePath, nBits = 2) {
//   const hiddenImage = await loadImage(hiddenImagePath);
//   const coverImage = await loadImage(coverImagePath);

//   const canvas = createCanvas(coverImage.width, coverImage.height);
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(coverImage, 0, 0);

//   const coverImageData = ctx.getImageData(
//     0,
//     0,
//     coverImage.width,
//     coverImage.height
//   );
//   const hiddenImageData = getCanvasImageData(hiddenImage);

//   for (let i = 0; i < coverImageData.data.length; i += 4) {
//     // Process Red, Green, Blue channels
//     for (let j = 0; j < 3; j++) {
//       const hiddenValue = hiddenImageData.data[i + j] || 0;
//       const coverValue = coverImageData.data[i + j];

//       const hiddenMSB = getNMostSignificantBits(hiddenValue, nBits);
//       const coverLSB = removeNLeastSignificantBits(coverValue, nBits);

//       coverImageData.data[i + j] = hiddenMSB + coverLSB;
//     }
//   }

//   ctx.putImageData(coverImageData, 0, 0);
//   return canvas.toBuffer("image/png");
// }

// function getCanvasImageData(image) {
//   const canvas = createCanvas(image.width, image.height);
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(image, 0, 0);
//   return ctx.getImageData(0, 0, image.width, image.height);
// }

// async function decode(encodedImagePath, nBits = 2) {
//   const encodedImage = await loadImage(encodedImagePath);

//   const canvas = createCanvas(encodedImage.width, encodedImage.height);
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(encodedImage, 0, 0);

//   const encodedImageData = ctx.getImageData(
//     0,
//     0,
//     encodedImage.width,
//     encodedImage.height
//   );
//   const decodedImageData = ctx.createImageData(
//     encodedImage.width,
//     encodedImage.height
//   );

//   for (let i = 0; i < encodedImageData.data.length; i += 4) {
//     // Process Red, Green, Blue channels
//     for (let j = 0; j < 3; j++) {
//       const encodedValue = encodedImageData.data[i + j];
//       const extractedBits = getNLeastSignificantBits(encodedValue, nBits);
//       decodedImageData.data[i + j] = shiftNBitsTo8(extractedBits, nBits);

//       // Log specific examples for the first few pixels
//       if (i < 12) {
//         console.log(`Pixel Index: ${i + j}`);
//         console.log(`Encoded Value: ${encodedValue}, Extracted Bits: ${extractedBits}, Decoded Value: ${decodedImageData.data[i + j]}`);
//       }
//     }
//     // Set alpha channel
//     decodedImageData.data[i + 3] = 255;
//   }

//   ctx.putImageData(decodedImageData, 0, 0);
//   return canvas.toBuffer("image/png");
// }

// module.exports = { encode, decode };
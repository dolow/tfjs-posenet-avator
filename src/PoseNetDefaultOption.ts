const PoseNetDefaultOption = Object.freeze({
  // Can be either MobileNetV1 or ResNet50.
  // It determines which PoseNet architecture to load.
  architecture: 'MobileNetV1',

  // Can be one of 8, 16, 32
  // (Stride 16, 32 are supported for the ResNet architecture
  //  and stride 8, 16, 32 are supported for the MobileNetV1 architecture).
  // It specifies the output stride of the PoseNet model.
  // The smaller the value, the larger the output resolution, and more accurate the model at the cost of speed.
  // Set this to a larger value to increase speed at the cost of accuracy.
  outputStride: 16,

  // A number or an Object of type {width: number, height: number}.
  // Defaults to 257.
  // It specifies the size the image is resized and padded to before it is fed into the PoseNet model.
  // The larger the value, the more accurate the model at the cost of speed.
  // Set this to a smaller value to increase speed at the cost of accuracy.
  // If a number is provided, the image will be resized and padded to be a square with the same width and height.
  // If width and height are provided, the image will be resized and padded to the specified width and height.
  // inputResolution: { width: 160, height: 160 },

  // Can be one of 1.01, 1.0, 0.75, or 0.50
  // (The value is used only by the MobileNetV1 architecture and not by the ResNet architecture).
  // It is the float multiplier for the depth (number of channels) for all convolution ops.
  // The larger the value, the larger the size of the layers,
  // and more accurate the model at the cost of speed.
  // Set this to a smaller value to increase speed at the cost of accuracy.
  multiplier: 0.75,

  // This argument controls the bytes used for weight quantization. The available options are:
  // - 4. 4 bytes per float (no quantization). Leads to highest accuracy and original model size (~90MB).
  // - 2. 2 bytes per float. Leads to slightly lower accuracy and 2x model size reduction (~45MB).
  // - 1. 1 byte per float. Leads to lower accuracy and 4x model size reduction (~22MB).
  quantBytes: 2,

  // An optional string that specifies custom url of the model.
  // This is useful for local development or countries that don't have access to the model hosted on GCP.
  // modelUrl: ''
});

export {
  PoseNetDefaultOption
}

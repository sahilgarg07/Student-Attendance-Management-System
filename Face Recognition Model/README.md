# Face Recognition Model

We developed the following Face Recognition Model to implement One-Shot Face Verification functionality by trying to build a Siamese Neural Network. To develop the neural network we took reference from the research paper-- [Siamese Neural Networks for One-shot Image Recognition by Gregory Koch, Richard Zemel and Ruslan Salakhutdinov](https://www.cs.cmu.edu/~rsalakhu/papers/oneshot1.pdf).

We employed advanced libraries like **TensorFlow** and **Keras** to assist in developing the neural network. The training dataset was created by modifying the well-known Labeled Faces in the Wild dataset.

The primary issue arose from the hardware limitations of the Face Recognition model. Initially, when constructing the Siamese Neural Network, we anticipated sufficient resources for model training. However, when the desired outcomes weren't achieved, we identified flaws in our approach. Training the model for improved results required multiple epochs. However, our complex model, with thousands of neurons processing thousands of images sized at 105 x 105 x 3, necessitated nearly ten epochs, which surpassed our hardware capabilities. Consequently, we had to adapt the entire functionality initially designed around our model to accommodate Python’s Face Recognition model.

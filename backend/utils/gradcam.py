import torch
import torch.nn.functional as F
import cv2
import numpy as np
import matplotlib.pyplot as plt


class GradCAM:

    def __init__(self, model, target_layer):

        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        self.target_layer.register_forward_hook(
            self.forward_hook
        )

        self.target_layer.register_full_backward_hook(
            self.backward_hook
        )

    def forward_hook(
        self,
        module,
        input,
        output
    ):
        self.activations = output

    def backward_hook(
        self,
        module,
        grad_input,
        grad_output
    ):
        self.gradients = grad_output[0]

    def generate(
        self,
        input_tensor,
        class_idx=None
    ):

        self.model.zero_grad()

        output = self.model(
            input_tensor
        )

        if class_idx is None:

            class_idx = torch.argmax(
                output,
                dim=1
            ).item()

        score = output[:, class_idx]

        score.backward()

        gradients = self.gradients[0]
        activations = self.activations[0]

        weights = torch.mean(
            gradients,
            dim=(1, 2)
        )

        cam = torch.zeros(
            activations.shape[1:],
            device=activations.device
        )

        for i, w in enumerate(weights):
            cam += w * activations[i]

        cam = F.relu(cam)

        cam -= cam.min()

        cam /= (
            cam.max() + 1e-8
        )

        return cam.detach().cpu().numpy()
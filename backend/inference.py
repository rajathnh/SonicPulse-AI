import os
import uuid
import torch

from model import build_model
from utils.audio import (
    preprocess_audio,
    wav_to_spectrogram
)

from utils.gradcam import GradCAM
from utils.gradcam_utils import save_gradcam


device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


model = build_model()

model.load_state_dict(
    torch.load(
        "models/best_model.pth",
        map_location=device
    )
)

model.to(device)
model.eval()


gradcam = GradCAM(
    model,
    model.conv_head
)


def predict(audio_path):

    # tensor for model
    spec_tensor, spectrogram_file = (
        preprocess_audio(audio_path)
    )

    # original log-mel for GradCAM overlay
    log_mel = wav_to_spectrogram(
        audio_path
    )

    spec_tensor = (
        spec_tensor
        .unsqueeze(0)
        .to(device)
    )

    # forward pass
    outputs = model(
        spec_tensor
    )

    probs = torch.softmax(
        outputs,
        dim=1
    )

    pred = outputs.argmax(
        dim=1
    ).item()

    confidence = float(
        probs[0][pred]
    )

    # Grad-CAM
    cam = gradcam.generate(
        spec_tensor,
        pred
    )

    gradcam_file = (
        f"gradcam_"
        f"{uuid.uuid4().hex}.png"
    )

    gradcam_path = os.path.join(
        "results",
        gradcam_file
    )

    save_gradcam(
        log_mel,
        cam,
        gradcam_path
    )

    return {

        "prediction":
            "abnormal"
            if pred == 1
            else "normal",

        "confidence":
            confidence,

        "spectrogram":
            spectrogram_file,

        "gradcam":
            gradcam_file
    }
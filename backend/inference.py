import torch

from model import build_model
from utils.audio import preprocess_audio, spectrogram_to_image_base64


device = torch.device(
    "cuda" if torch.cuda.is_available()
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


def predict(audio_path):

    spec, log_mel = preprocess_audio(
        audio_path
    )

    spec = spec.unsqueeze(0)

    spec = spec.to(device)

    with torch.no_grad():

        outputs = model(spec)

        probs = torch.softmax(
            outputs,
            dim=1
        )

        pred = outputs.argmax(
            dim=1
        ).item()

    # Generate spectrogram image
    spectrogram_image = spectrogram_to_image_base64(log_mel)

    return {
        "prediction":
            "abnormal"
            if pred == 1
            else "normal",

        "confidence":
            float(probs[0][pred]),
        
        "spectrogram": 
            spectrogram_image
    }
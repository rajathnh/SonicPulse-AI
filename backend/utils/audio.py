import torch
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import uuid


def wav_to_spectrogram(audio_path):

    y, sr = librosa.load(
        audio_path,
        sr=16000
    )

    mel = librosa.feature.melspectrogram(
        y=y,
        sr=sr,
        n_mels=128,
        n_fft=1024,
        hop_length=512
    )

    log_mel = librosa.power_to_db(
        mel,
        ref=np.max
    )

    return log_mel.astype(np.float32)


def save_spectrogram(log_mel):

    filename = f"spec_{uuid.uuid4().hex}.png"

    path = f"results/{filename}"

    plt.figure(figsize=(8, 4))

    librosa.display.specshow(
        log_mel,
        sr=16000,
        x_axis="time",
        y_axis="mel"
    )

    plt.colorbar(format="%+2.0f dB")

    plt.tight_layout()

    plt.savefig(path)

    plt.close()

    return filename


def spectrogram_to_tensor(log_mel):

    spectrogram = torch.tensor(
        log_mel,
        dtype=torch.float32
    )

    spectrogram = spectrogram.unsqueeze(0)

    spectrogram = spectrogram.repeat(
        3,
        1,
        1
    )

    return spectrogram


def preprocess_audio(audio_path):

    log_mel = wav_to_spectrogram(
        audio_path
    )

    spectrogram_file = save_spectrogram(
        log_mel
    )

    tensor = spectrogram_to_tensor(
        log_mel
    )

    return tensor, spectrogram_file
# utils/audio.py

import librosa
import numpy as np
import torch


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


def spectrogram_to_tensor(log_mel):

    spectrogram = torch.tensor(
        log_mel,
        dtype=torch.float32
    )

    # [128, T]
    # -> [1, 128, T]

    spectrogram = spectrogram.unsqueeze(0)

    # EfficientNet expects 3 channels
    # [1,128,T] -> [3,128,T]

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

    tensor = spectrogram_to_tensor(
        log_mel
    )

    return tensor
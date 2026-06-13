# utils/audio.py

import librosa
import numpy as np
import torch
import matplotlib.pyplot as plt
import io
import base64


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


def spectrogram_to_image_base64(log_mel):
    """Convert mel-spectrogram to base64 encoded image"""
    
    # Create figure
    fig, ax = plt.subplots(figsize=(12, 6))
    
    # Display spectrogram using librosa
    img = librosa.display.specshow(
        log_mel,
        sr=16000,
        hop_length=512,
        x_axis='time',
        y_axis='mel',
        cmap='magma',
        ax=ax
    )
    
    # Add colorbar
    plt.colorbar(img, ax=ax, format='%+2.0f dB')
    
    ax.set_title('Mel-Frequency Spectrogram', fontsize=14, fontweight='bold')
    ax.set_xlabel('Time (s)')
    ax.set_ylabel('Frequency (Hz)')
    
    # Save to buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
    buffer.seek(0)
    plt.close(fig)
    
    # Convert to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return image_base64


def preprocess_audio(audio_path):

    log_mel = wav_to_spectrogram(
        audio_path
    )

    tensor = spectrogram_to_tensor(
        log_mel
    )

    return tensor, log_mel
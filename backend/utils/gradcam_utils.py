import cv2
import numpy as np
import matplotlib.pyplot as plt


def overlay_gradcam(
    spectrogram,
    cam
):

    height, width = spectrogram.shape

    cam = cv2.resize(
        cam,
        (width, height)
    )

    heatmap = cv2.applyColorMap(
        np.uint8(255 * cam),
        cv2.COLORMAP_JET
    )

    spectrogram_norm = spectrogram.copy()

    spectrogram_norm -= spectrogram_norm.min()

    spectrogram_norm /= (
        spectrogram_norm.max() + 1e-8
    )

    spectrogram_img = np.uint8(
        spectrogram_norm * 255
    )

    spectrogram_img = cv2.cvtColor(
        spectrogram_img,
        cv2.COLOR_GRAY2BGR
    )

    result = cv2.addWeighted(
        spectrogram_img,
        0.6,
        heatmap,
        0.4,
        0
    )

    return result


def save_gradcam(
    spectrogram,
    cam,
    save_path
):

    result = overlay_gradcam(
        spectrogram,
        cam
    )

    plt.figure(
        figsize=(10, 4)
    )

    plt.imshow(
        cv2.cvtColor(
            result,
            cv2.COLOR_BGR2RGB
        ),
        aspect="auto",
        origin="lower"
    )

    plt.axis("off")

    plt.tight_layout()

    plt.savefig(
        save_path,
        bbox_inches="tight"
    )

    plt.close()
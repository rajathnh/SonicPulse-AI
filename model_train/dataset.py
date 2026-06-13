from pathlib import Path

import numpy as np
import torch
from torch.utils.data import Dataset
from tqdm import tqdm


class SpectrogramDataset(Dataset):

    def __init__(self, file_paths, labels):

        self.labels = labels

        print("Loading spectrograms into RAM...")

        self.data = []

        for path in tqdm(file_paths):

            spec = np.load(path)

            spec = torch.tensor(
                spec,
                dtype=torch.float32
            )

            if spec.ndim == 2:
                spec = spec.unsqueeze(0)

            self.data.append(spec)

        print("Done.")

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):

        return (
            self.data[idx],
            torch.tensor(
                self.labels[idx],
                dtype=torch.long
            )
        )


def load_file_paths(root_dir):

    root = Path(root_dir)

    file_paths = []
    labels = []

    for f in (root / "normal").glob("*.npy"):
        file_paths.append(str(f))
        labels.append(0)

    for f in (root / "abnormal").glob("*.npy"):
        file_paths.append(str(f))
        labels.append(1)

    return file_paths, labels
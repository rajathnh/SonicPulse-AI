import time

import torch
import torch.nn as nn
import torch.optim as optim

from tqdm import tqdm
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader

from dataset import SpectrogramDataset, load_file_paths
from model import build_model


# ============================================
# CONFIG
# ============================================

DATASET_PATH = r"D:\DBMS\Idea to Impact\valve_spectograms"

BATCH_SIZE = 16
EPOCHS = 30
LEARNING_RATE = 1e-4


# ============================================
# TRAINING
# ============================================

def train():

    device = torch.device(
        "cuda" if torch.cuda.is_available()
        else "cpu"
    )

    print(f"\nUsing device: {device}")

    file_paths, labels = load_file_paths(
        DATASET_PATH
    )

    print(f"Total samples: {len(file_paths)}")

    (
        train_files,
        val_files,
        train_labels,
        val_labels
    ) = train_test_split(
        file_paths,
        labels,
        test_size=0.2,
        stratify=labels,
        random_state=42
    )

    print(f"Train samples: {len(train_files)}")
    print(f"Validation samples: {len(val_files)}")

    train_dataset = SpectrogramDataset(
        train_files,
        train_labels
    )

    val_dataset = SpectrogramDataset(
        val_files,
        val_labels
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=16,
        shuffle=True,
        num_workers=0
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=16,
        shuffle=False,
        num_workers=0
    )

    model = build_model().to(device)

    criterion = nn.CrossEntropyLoss()

    optimizer = optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE
    )

    best_f1 = 0.0

    print("\nStarting Training...\n")

    for epoch in range(EPOCHS):

        epoch_start = time.time()

        # =====================================
        # TRAINING
        # =====================================

        model.train()

        train_loss = 0.0

        train_bar = tqdm(
            train_loader,
            desc=f"Epoch {epoch+1}/{EPOCHS}",
            leave=True
        )

        for spectrograms, labels in train_bar:

            spectrograms = spectrograms.repeat(
                1, 3, 1, 1
            )

            spectrograms = spectrograms.to(
                device,
                non_blocking=True
            )

            labels = labels.to(
                device,
                non_blocking=True
            )

            optimizer.zero_grad()

            outputs = model(
                spectrograms
            )

            loss = criterion(
                outputs,
                labels
            )

            loss.backward()

            optimizer.step()

            train_loss += loss.item()

            train_bar.set_postfix(
                loss=f"{loss.item():.4f}"
            )

        avg_train_loss = (
            train_loss /
            len(train_loader)
        )

        # =====================================
        # VALIDATION
        # =====================================

        model.eval()

        val_loss = 0.0

        all_preds = []
        all_labels = []

        with torch.no_grad():

            for spectrograms, labels in val_loader:

                spectrograms = spectrograms.repeat(
                    1, 3, 1, 1
                )

                spectrograms = spectrograms.to(
                    device,
                    non_blocking=True
                )

                labels = labels.to(
                    device,
                    non_blocking=True
                )

                outputs = model(
                    spectrograms
                )

                loss = criterion(
                    outputs,
                    labels
                )

                val_loss += loss.item()

                preds = outputs.argmax(
                    dim=1
                )

                all_preds.extend(
                    preds.cpu().numpy()
                )

                all_labels.extend(
                    labels.cpu().numpy()
                )

        avg_val_loss = (
            val_loss /
            len(val_loader)
        )

        accuracy = accuracy_score(
            all_labels,
            all_preds
        )

        precision = precision_score(
            all_labels,
            all_preds,
            zero_division=0
        )

        recall = recall_score(
            all_labels,
            all_preds,
            zero_division=0
        )

        f1 = f1_score(
            all_labels,
            all_preds,
            zero_division=0
        )

        epoch_time = (
            time.time() -
            epoch_start
        )

        saved = "NO"

        # =====================================
        # SAVE BEST MODEL
        # =====================================

        if f1 > best_f1:

            best_f1 = f1

            torch.save(
                model.state_dict(),
                "best_model.pth"
            )

            saved = "YES"

        # =====================================
        # EPOCH SUMMARY
        # =====================================

        print("\n" + "=" * 50)

        print(
            f"Epoch {epoch+1}/{EPOCHS}"
        )

        print(
            f"Train Loss : {avg_train_loss:.4f}"
        )

        print(
            f"Val Loss   : {avg_val_loss:.4f}"
        )

        print(
            f"Accuracy   : {accuracy:.4f}"
        )

        print(
            f"Precision  : {precision:.4f}"
        )

        print(
            f"Recall     : {recall:.4f}"
        )

        print(
            f"F1 Score   : {f1:.4f}"
        )

        print(
            f"Epoch Time : {epoch_time:.2f} sec"
        )

        print(
            f"Best F1 So Far : {best_f1:.4f}"
        )

        print(
            f"Best Model Saved? {saved}"
        )

        print("=" * 50)

    print("\nTraining Complete")

    print(
        f"Best F1 Achieved: "
        f"{best_f1:.4f}"
    )


if __name__ == "__main__":
    train()
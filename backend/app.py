from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import os
import shutil

from inference import predict


app = FastAPI(
    title="Valve Anomaly Detection API"
)

# React frontend support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@app.get("/")
def health_check():

    return {
        "status": "running"
    }


@app.post("/predict")
async def predict_audio(
    file: UploadFile = File(...)
):

    if not file.filename.endswith(".wav"):

        return {
            "error":
            "Only .wav files are supported"
        }

    temp_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    try:

        with open(
            temp_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        result = predict(
            temp_path
        )

        return result

    finally:

        if os.path.exists(
            temp_path
        ):
            os.remove(
                temp_path
            )
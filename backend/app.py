from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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
RESULTS_DIR = "results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


@app.get("/")
def health_check():

    return {
        "status": "running"
    }

app.mount(
    "/results",
    StaticFiles(directory="results"),
    name="results"
)
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
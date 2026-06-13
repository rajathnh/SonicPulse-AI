import timm


def build_model():

    model = timm.create_model(
        "efficientnet_b0",
        pretrained=True,
        num_classes=2
    )

    return model
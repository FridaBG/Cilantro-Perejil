from enum import Enum


class Label(str, Enum):
    cilantro = "cilantro"
    perejil = "perejil"

class ImageClassificationResult:
    def __init__(self, label: Label, confidence: float):
        self.label: Label = label
        self.confidence: float = confidence
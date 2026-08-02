"""Pydantic Schema: Entity (NER output)"""
from typing import Literal
from pydantic import BaseModel

EntityLabel = Literal[
    "IP_ADDRESS", "USER", "FILE_PATH", "CVE",
    "HOSTNAME", "PORT", "EMAIL", "URL", "AWS_ARN", "AWS_INSTANCE",
]


class EntitySchema(BaseModel):
    text: str
    label: EntityLabel
    start: int
    end: int

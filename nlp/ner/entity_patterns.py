"""
NLP NER — spaCy EntityRuler Patterns
Patterns for spaCy's EntityRuler to detect domain-specific entities
that spaCy's base NER model might miss.
"""

ENTITY_RULER_PATTERNS = [
    # SSH / auth actions
    {"label": "ATTACK_TYPE", "pattern": "Failed password"},
    {"label": "ATTACK_TYPE", "pattern": "invalid user"},
    {"label": "ATTACK_TYPE", "pattern": "authentication failure"},
    {"label": "ATTACK_TYPE", "pattern": [{"LOWER": "brute"}, {"LOWER": "force"}]},
    {"label": "ATTACK_TYPE", "pattern": [{"LOWER": "port"}, {"LOWER": "scan"}]},

    # AWS API actions
    {"label": "AWS_ACTION", "pattern": "AttachUserPolicy"},
    {"label": "AWS_ACTION", "pattern": "PutBucketPolicy"},
    {"label": "AWS_ACTION", "pattern": "GetObject"},
    {"label": "AWS_ACTION", "pattern": "AssumeRole"},

    # Malware indicators
    {"label": "MALWARE", "pattern": "mimikatz.exe"},
    {"label": "MALWARE", "pattern": "powershell.exe"},
    {"label": "MALWARE", "pattern": [{"LOWER": "encoded"}, {"LOWER": "command"}]},
    {"label": "MALWARE", "pattern": [{"LOWER": "reverse"}, {"LOWER": "shell"}]},

    # Protocols
    {"label": "PROTOCOL", "pattern": "TCP"},
    {"label": "PROTOCOL", "pattern": "UDP"},
    {"label": "PROTOCOL", "pattern": "ssh2"},
    {"label": "PROTOCOL", "pattern": "HTTP"},
]
